-- Calls the booking-notify Edge Function when a booking is created or its status changes.
-- Before running, store the shared secret in Vault (same value as the function's WEBHOOK_SECRET):
--   select vault.create_secret('<secret>', 'booking_webhook_secret');
create extension if not exists pg_net;

create or replace function public.notify_booking_email()
returns trigger
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
        body    := jsonb_build_object(
            'type', TG_OP,
            'record', to_jsonb(new),
            'old_record', case when TG_OP = 'UPDATE' then to_jsonb(old) end
        )
    );
    return new;
end;
$$;

drop trigger if exists bookings_email_on_insert on public.bookings;
create trigger bookings_email_on_insert
    after insert on public.bookings
    for each row execute function public.notify_booking_email();

drop trigger if exists bookings_email_on_status_change on public.bookings;
create trigger bookings_email_on_status_change
    after update of status on public.bookings
    for each row when (old.status is distinct from new.status)
    execute function public.notify_booking_email();
