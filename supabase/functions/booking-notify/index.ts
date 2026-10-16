// Emails the Tenda Care base inbox whenever a booking is created or claimed.
// Called by the database trigger in supabase/migrations/20261016010000_booking_email_notifications.sql.
//
// Secrets (Supabase → Edge Functions → Secrets):
//   RESEND_API_KEY   — from https://resend.com/api-keys
//   WEBHOOK_SECRET   — same value stored in Vault as 'booking_webhook_secret'
//   NOTIFY_TO        — optional, defaults to tendacareke@gmail.com
//   NOTIFY_FROM      — optional, defaults to Resend's test sender

type Booking = Record<string, string | null>;

const NOTIFY_TO = Deno.env.get("NOTIFY_TO") ?? "tendacareke@gmail.com";
const NOTIFY_FROM = Deno.env.get("NOTIFY_FROM") ?? "Tenda Care Bookings <onboarding@resend.dev>";

const TYPE_LABELS: Record<string, string> = {
  therapy: "Therapy",
  caregiver: "Caregiver",
  repair: "Equipment Repair",
  research: "Research",
};

const escape = (v: unknown) =>
  String(v ?? "—").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));

const table = (rows: [string, unknown][]) =>
  `<table style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows
    .map(([k, v]) => `<tr><td style="padding:6px 16px 6px 0;color:#64748b;font-weight:bold">${k}</td><td style="padding:6px 0;color:#0f172a">${escape(v)}</td></tr>`)
    .join("")}</table>`;

const bookingRows = (b: Booking): [string, unknown][] => [
  ["Booking type", TYPE_LABELS[b.type ?? ""] ?? b.type],
  ["Service", b.service],
  ["Category", b.category],
  ["Name", b.patient_name],
  ["Contact", b.contact],
  ["Preferred date", b.preferred_date],
  ["Notes", b.notes],
  ["Specialist role", b.specialist_role],
  ["Status", b.status],
  ["Submitted", b.created_at ? new Date(b.created_at).toLocaleString("en-KE", { timeZone: "Africa/Nairobi" }) : null],
  ["Booking ID", b.id],
];

function buildEmail(op: string, record: Booking, old: Booking | null) {
  const label = TYPE_LABELS[record.type ?? ""] ?? "Booking";
  if (op === "INSERT") {
    return {
      subject: `New ${label} booking: ${record.service ?? "No service given"}`,
      html: `<h2 style="font-family:Arial,sans-serif;color:#1d4ed8">New booking received</h2>${table(bookingRows(record))}`,
    };
  }
  if (op === "UPDATE" && old?.status === "pending" && record.status === "confirmed") {
    return {
      subject: `Booking claimed by ${record.specialist_name ?? "a specialist"}: ${record.service ?? label}`,
      html: `<h2 style="font-family:Arial,sans-serif;color:#15803d">Booking claimed in the Specialist Inbox</h2>${table([
        ["Specialist", record.specialist_name],
        ["Specialist email", record.specialist_email],
        ...bookingRows(record),
      ])}`,
    };
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.headers.get("x-webhook-secret") !== Deno.env.get("WEBHOOK_SECRET")) {
    return new Response("Unauthorized", { status: 401 });
  }

  const { type: op, record, old_record } = await req.json();
  const email = buildEmail(op, record, old_record);
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
