-- Emails tendacareke@gmail.com about every activity on the site, via the booking-notify Edge Function:
--   * bookings: created, claimed, status changed
--   * profiles: specialist/volunteer sign-ups and updates
--   * equipment: new donations
--   * a daily 09:00 (Nairobi) list of bookings still pending after 24 hours
--
-- Before running, store the shared secret in Vault (same value as the function's WEBHOOK_SECRET):
--   select vault.create_secret('<secret>', 'booking_webhook_secret');
create extension if not exists pg_net;
create extension if not exists pg_cron;

-- Short reference (TC-1001, TC-1002, ...) used in email subjects so Gmail threads each booking.
alter table public.bookings
    add column if not exists ref bigint generated always as identity (start with 1001);

create or replace function public.post_activity_email(payload jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
    perform net.http_post(
        url     := 'https://xcqgcgktymkymobticqa.supabase.co/functions/v1/booking-notify',
        headers := jsonb_build_object(
            'Content-Type', 'application/json',
            'x-webhook-secret', (select decrypted_secret from vault.decrypted_secrets where name = 'booking_webhook_secret')
        ),
        body    := payload
    );
end;
$$;

create or replace function public.notify_activity_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
    perform public.post_activity_email(jsonb_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'record', to_jsonb(new),
        'old_record', case when TG_OP = 'UPDATE' then to_jsonb(old) end
    ));
    return new;
end;
$$;

create or replace function public.send_booking_followups()
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
    overdue jsonb;
begin
    select jsonb_agg(to_jsonb(b) order by b.created_at)
      into overdue
      from public.bookings b
     where b.status = 'pending'
       and b.created_at < now() - interval '24 hours';

    if overdue is not null then
        perform public.post_activity_email(jsonb_build_object('type', 'FOLLOWUP', 'bookings', overdue));
    end if;
end;
$$;

-- These run as the table owner, so keep them out of reach of the public API.
revoke execute on function public.post_activity_email(jsonb) from public, anon, authenticated;
revoke execute on function public.send_booking_followups() from public, anon, authenticated;

-- Replaces the bookings-only trigger from the first version of this file, if it was run.
drop trigger if exists bookings_email_on_insert on public.bookings;
drop trigger if exists bookings_email_on_status_change on public.bookings;
drop function if exists public.notify_booking_email();

create trigger bookings_email_on_insert
    after insert on public.bookings
    for each row execute function public.notify_activity_email();

create trigger bookings_email_on_status_change
    after update of status on public.bookings
    for each row when (old.status is distinct from new.status)
    execute function public.notify_activity_email();

drop trigger if exists profiles_email_on_change on public.profiles;
create trigger profiles_email_on_change
    after insert or update on public.profiles
    for each row execute function public.notify_activity_email();

drop trigger if exists equipment_email_on_insert on public.equipment;
create trigger equipment_email_on_insert
    after insert on public.equipment
    for each row execute function public.notify_activity_email();

-- 06:00 UTC = 09:00 Nairobi.
select cron.schedule('booking-followup-daily', '0 6 * * *', 'select public.send_booking_followups()');
