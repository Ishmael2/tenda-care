// Emails the Tenda Care base inbox about every activity on the site:
// new bookings, claimed bookings, specialist/volunteer sign-ups, equipment donations,
// and a daily list of bookings still pending after 24 hours.
// Called by the triggers and cron job in supabase/migrations/20261016010000_activity_email_notifications.sql.
//
// Secrets (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY   — from https://resend.com/api-keys
//   WEBHOOK_SECRET   — same value stored in Vault as 'booking_webhook_secret'
//   NOTIFY_TO        — optional, defaults to tendacareke@gmail.com
//   NOTIFY_FROM      — optional, defaults to Resend's test sender
//
// Every email ends with a one-word tag (tcbooking, tcclaimed, tcfollowup, tcsignup, tcdonation)
// for Gmail filters to label on.

type Row = Record<string, unknown>;
type Email = { subject: string; html: string; reply_to?: string; headers?: Record<string, string> };

const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? "tendacareke@gmail.com";
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") ?? "Tenda Care Activity <onboarding@resend.dev>";
const DASHBOARD_URL = "https://supabase.com/dashboard/project/xcqgcgktymkymobticqa/editor";

const TYPE_LABELS: Record<string, string> = {
  therapy: "Therapy",
  caregiver: "Caregiver",
  repair: "Equipment Repair",
  research: "Research",
};

const escape = (v: unknown) =>
  String(v ?? "—").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const isEmail = (v: unknown) => typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

const nairobiTime = (v: unknown) =>
  v ? new Date(String(v)).toLocaleString("en-KE", { timeZone: "Africa/Nairobi" }) : null;

const hoursSince = (v: unknown) => Math.floor((Date.now() - new Date(String(v)).getTime()) / 3_600_000);

const ref = (b: Row) => (b.ref ? `TC-${b.ref}` : `TC-${String(b.id).slice(0, 8)}`);

const table = (rows: [string, unknown][]) =>
  `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#64748b;font-weight:bold;vertical-align:top">${k}</td><td style="padding:6px 0;color:#0f172a">${escape(v)}</td></tr>`)
    .join("")}</table>`;

const layout = (heading: string, color: string, body: string, tag: string, note = "") =>
  `<div style="font-family:Arial,sans-serif;max-width:640px">
    <h2 style="color:${color};margin:0 0 16px">${heading}</h2>
    ${note ? `<p style="color:#334155;font-size:14px;margin:0 0 16px">${note}</p>` : ""}
    ${body}
    <p style="margin:24px 0 0;font-size:13px"><a href="${DASHBOARD_URL}" style="color:#1d4ed8">Open the database in Supabase</a></p>
    <p style="margin:16px 0 0;font-size:11px;color:#94a3b8">Tag: ${tag}</p>
  </div>`;

const bookingRows = (b: Row): [string, unknown][] => [
  ["Reference", ref(b)],
  ["Booking type", TYPE_LABELS[String(b.type)] ?? b.type],
  ["Service", b.service],
  ["Category", b.category],
  ["Name", b.patient_name],
  ["Contact", b.contact],
  ["Preferred date", b.preferred_date],
  ["Notes", b.notes],
  ["Specialist role", b.specialist_role],
  ["Status", b.status],
  ["Submitted", nairobiTime(b.created_at)],
];

// All emails about one booking share a subject and References header so Gmail keeps them in one thread.
const bookingThread = (b: Row) => {
  const threadId = `<booking-${b.id}@tenda-care.notify>`;
  return {
    subject: `[${ref(b)}] ${TYPE_LABELS[String(b.type)] ?? "Booking"}: ${b.service ?? "No service given"}`,
    headers: { "In-Reply-To": threadId, References: threadId },
    ...(isEmail(b.contact) ? { reply_to: String(b.contact).trim() } : {}),
  };
};

const replyHint = (b: Row) =>
  isEmail(b.contact)
    ? "Click <b>Reply</b> to email the patient directly."
    : b.contact
      ? `No email given. Contact the patient on <b>${escape(b.contact)}</b>.`
      : "";

function bookingEmail(op: string, b: Row, old: Row | null): Email | null {
  if (op === "INSERT") {
    return {
      ...bookingThread(b),
      html: layout("New booking received", "#1d4ed8", table(bookingRows(b)), "tcbooking", replyHint(b)),
    };
  }
  if (op === "UPDATE" && old?.status === "pending" && b.status === "confirmed") {
    return {
      ...bookingThread(b),
      html: layout(
        `Booking claimed by ${escape(b.specialist_name ?? "a specialist")}`,
        "#15803d",
        table([["Specialist", b.specialist_name], ["Specialist email", b.specialist_email], ...bookingRows(b)]),
        "tcclaimed",
        replyHint(b),
      ),
    };
  }
  if (op === "UPDATE" && old?.status !== b.status) {
    return {
      ...bookingThread(b),
      html: layout(`Booking status changed: ${escape(old?.status)} → ${escape(b.status)}`, "#475569", table(bookingRows(b)), "tcbooking"),
    };
  }
  return null;
}

function profileEmail(op: string, p: Row): Email {
  const action = op === "INSERT" ? "New sign-up" : "Profile updated";
  return {
    subject: `${action}: ${p.full_name ?? "Unknown"} (${p.role ?? "No role"})`,
    ...(isEmail(p.email) ? { reply_to: String(p.email).trim() } : {}),
    html: layout(
      `${action}: ${escape(p.full_name)}`,
      "#7c3aed",
      table([
        ["Name", p.full_name],
        ["Role", p.role],
        ["Email", p.email],
        ["Phone", p.phone],
        ["Location", p.location],
        ["Experience (years)", p.experience_years],
        ["Availability", p.availability],
        ["Mission statement", p.mission_statement],
        ["Shown in public directory", p.public_consent ? "Yes" : "No"],
      ]),
      "tcsignup",
      isEmail(p.email) ? "Click <b>Reply</b> to email them directly." : "",
    ),
  };
}

function equipmentEmail(e: Row): Email {
  const images = Array.isArray(e.image_urls) ? (e.image_urls as string[]) : [];
  const gallery = images
    .map((u) => `<a href="${escape(u)}"><img src="${escape(u)}" alt="Donated equipment photo" style="width:180px;margin:8px 8px 0 0;border-radius:8px"></a>`)
    .join("");
  return {
    subject: `New equipment donation: ${e.name ?? "Unnamed item"} (${e.device_type ?? "Unknown type"})`,
    html: layout(
      `New equipment donation: ${escape(e.name)}`,
      "#c2410c",
      table([
        ["Item", e.name],
        ["Device type", e.device_type],
        ["Condition", e.condition],
        ["Description", e.description],
        ["Defects", e.defects],
        ["Donor", e.donor],
        ["Listed", nairobiTime(e.created_at)],
      ]) + gallery,
      "tcdonation",
    ),
  };
}

function followupEmail(bookings: Row[]): Email {
  const rows = bookings
    .map((b) => `<tr>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;font-weight:bold">${escape(ref(b))}</td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0">${escape(TYPE_LABELS[String(b.type)] ?? b.type)}<br><span style="color:#64748b">${escape(b.service)}</span></td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0">${escape(b.patient_name)}<br><span style="color:#64748b">${escape(b.contact)}</span></td>
      <td style="padding:8px;border-bottom:1px solid #e2e8f0;color:#b91c1c;font-weight:bold">${hoursSince(b.created_at)}h</td>
    </tr>`)
    .join("");
  const today = new Date().toLocaleDateString("en-KE", { timeZone: "Africa/Nairobi", day: "numeric", month: "short", year: "numeric" });
  return {
    subject: `Follow-up needed: ${bookings.length} booking${bookings.length === 1 ? "" : "s"} pending over 24h (${today})`,
    html: layout(
      "Bookings waiting for action",
      "#b91c1c",
      `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px;width:100%">
        <tr style="text-align:left;color:#64748b"><th style="padding:8px">Ref</th><th style="padding:8px">Service</th><th style="padding:8px">Patient</th><th style="padding:8px">Waiting</th></tr>
        ${rows}
      </table>`,
      "tcfollowup",
      "These bookings are still <b>pending</b>. Search Gmail for the reference (e.g. TC-1001) to open the booking's thread, then mark it confirmed, completed or cancelled in Supabase once it is handled.",
    ),
  };
}

function buildEmail(payload: Row): Email | null {
  const { type: op, table: source, record, old_record } = payload as {
    type: string; table?: string; record?: Row; old_record?: Row | null;
  };
  if (op === "FOLLOWUP") {
    const bookings = (payload.bookings as Row[]) ?? [];
    return bookings.length ? followupEmail(bookings) : null;
  }
  if (!record) return null;
  if (source === "profiles") return profileEmail(op, record);
  if (source === "equipment") return op === "INSERT" ? equipmentEmail(record) : null;
  return bookingEmail(op, record, old_record ?? null);
}

Deno.serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const email = buildEmail(await req.json());
  if (!email) return new Response("Ignored", { status: 200 });

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${Deno.env.get("RESEND_API_KEY")}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from: NOTIFY_FROM, to: [NOTIFY_TO], ...email }),
  });
  const body = await res.text();
  if (!res.ok) console.error("Resend error", res.status, body);
  return new Response(body, { status: res.ok ? 200 : 502 });
});
