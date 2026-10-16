-- Bookings submitted from the Therapies, Research and Exchange (repair) pages,
-- and claimed by specialists from the Specialist Inbox.
create table if not exists public.bookings (
    id               uuid primary key default gen_random_uuid(),
    created_at       timestamptz not null default now(),
    type             text,
    service          text,
    category         text,
    specialist_role  text,
    patient_name     text,
    contact          text,
    preferred_date   date,
    notes            text,
    status           text default 'pending',
    specialist_name  text,
    specialist_email text
);

-- The table may already exist from an earlier setup with only some of these columns.
alter table public.bookings
    add column if not exists created_at       timestamptz not null default now(),
    add column if not exists type             text,
    add column if not exists service          text,
    add column if not exists category         text,
    add column if not exists specialist_role  text,
    add column if not exists patient_name     text,
    add column if not exists contact          text,
    add column if not exists preferred_date   date,
    add column if not exists notes            text,
    add column if not exists status           text,
    add column if not exists specialist_name  text,
    add column if not exists specialist_email text;

alter table public.bookings alter column status set default 'pending';
update public.bookings set status = 'pending' where status is null;

alter table public.bookings drop constraint if exists bookings_type_check;
alter table public.bookings add constraint bookings_type_check
    check (type in ('therapy', 'caregiver', 'repair', 'research')) not valid;
alter table public.bookings drop constraint if exists bookings_status_check;
alter table public.bookings add constraint bookings_status_check
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')) not valid;

create index if not exists bookings_specialist_role_idx on public.bookings (specialist_role, created_at desc);

alter table public.bookings enable row level security;

-- The site has no login, so the public (anon) role submits, lists and claims bookings.
drop policy if exists "Public can submit bookings" on public.bookings;
create policy "Public can submit bookings"
    on public.bookings for insert to anon, authenticated
    with check (status = 'pending' and specialist_name is null and specialist_email is null);

drop policy if exists "Public can read bookings" on public.bookings;
create policy "Public can read bookings"
    on public.bookings for select to anon, authenticated
    using (true);

-- A booking can only be claimed once: pending -> confirmed.
drop policy if exists "Specialists can claim pending bookings" on public.bookings;
create policy "Specialists can claim pending bookings"
    on public.bookings for update to anon, authenticated
    using (status = 'pending')
    with check (status = 'confirmed');

-- Only the claim columns may be changed by the public.
revoke update on public.bookings from anon, authenticated;
grant update (status, specialist_name, specialist_email) on public.bookings to anon, authenticated;

-- Live updates for the Specialist Inbox.
do $$
begin
    if not exists (
        select 1 from pg_publication_tables
        where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'bookings'
    ) then
        alter publication supabase_realtime add table public.bookings;
    end if;
end $$;
