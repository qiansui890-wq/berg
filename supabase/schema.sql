-- ============================================================
-- Berg PC Case Platform — Supabase schema
-- Paste this whole file into the Supabase SQL Editor and run it.
-- It creates the tables, row-level security (RLS) policies, and a
-- trigger that creates a profile row whenever a new auth user signs up.
-- ============================================================

-- ---------- Extensions ----------
create extension if not exists "pgcrypto";

-- ============================================================
-- profiles  (1:1 with auth.users — holds role, display name, title)
-- role: 'admin' | 'lawyer' | 'client'
-- ============================================================
create table if not exists public.profiles (
  id          uuid primary key references auth.users(id) on delete cascade,
  role        text not null default 'client' check (role in ('admin','lawyer','client')),
  name        text not null default '',
  email       text not null default '',
  title       text default '',
  created_at  timestamptz not null default now()
);

-- Helper: is the current user an admin?  (security definer avoids RLS recursion)
create or replace function public.is_admin()
returns boolean language sql security definer stable as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

create or replace function public.my_role()
returns text language sql security definer stable as $$
  select coalesce((select role from public.profiles where id = auth.uid()), 'client');
$$;

-- ============================================================
-- clients  (one row per case)
-- ============================================================
create table if not exists public.clients (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,  -- the client login that owns this case
  lawyer_id     uuid references auth.users(id) on delete set null,  -- handling attorney
  name          text not null default '',
  email         text default '',
  phone         text default '',
  address       text default '',
  dob           text default '',
  occupation    text default '',
  id_type       text default '',
  id_number     text default '',
  status        text not null default 'Intake',
  matter_type   text default 'Crypto Fraud',
  amount_lost   numeric default 0,
  currency      text default 'USD',
  date_of_loss  text default '',
  platform      text default '',
  funds_method  text default 'crypto',
  jurisdiction  text default '',
  overseas      boolean default false,
  narrative     text default '',
  strategies    text[] default '{}',
  intake_complete boolean default false,
  created_by    uuid,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index if not exists clients_lawyer_idx on public.clients(lawyer_id);
create index if not exists clients_user_idx   on public.clients(user_id);

-- Helper: can the current user see this case?
create or replace function public.can_see_client(c public.clients)
returns boolean language sql security definer stable as $$
  select public.is_admin()
      or c.lawyer_id = auth.uid()
      or c.user_id   = auth.uid();
$$;

-- ============================================================
-- Child tables (all scoped by client_id)
-- ============================================================
create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  addr text not null, role text default 'hop', label text default '',
  balance text default '', usd text default '', sort int default 0
);

create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  name text not null, type text default 'pdf', size text default '',
  status text default 'review', storage_key text,
  uploaded_by text default '', uploaded_at timestamptz default now()
);

create table if not exists public.timeline (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  icon text default 'dot', text text not null, by text default '',
  date text default '', created_at timestamptz default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  from_id uuid, from_name text default '', from_role text default '',
  text text not null, read boolean default false, ts timestamptz default now()
);

-- notes are internal — clients must NEVER read these
create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.clients(id) on delete cascade,
  author text default '', text text not null, ts timestamptz default now()
);

create table if not exists public.activity (
  id uuid primary key default gen_random_uuid(),
  actor text default '', action text not null, target text default '',
  ts timestamptz default now()
);

-- ============================================================
-- Enable RLS
-- ============================================================
alter table public.profiles  enable row level security;
alter table public.clients   enable row level security;
alter table public.wallets   enable row level security;
alter table public.documents enable row level security;
alter table public.timeline  enable row level security;
alter table public.messages  enable row level security;
alter table public.notes     enable row level security;
alter table public.activity  enable row level security;

-- ---------- profiles policies ----------
-- everyone signed-in may read profiles (needed to show attorney names);
-- you may tighten this to is_admin() if you prefer.
create policy "profiles readable" on public.profiles for select using (auth.uid() is not null);
create policy "own profile update" on public.profiles for update using (id = auth.uid() or public.is_admin());
create policy "admin manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());

-- ---------- clients policies ----------
create policy "clients visible" on public.clients for select using (public.can_see_client(clients));
create policy "clients insert"  on public.clients for insert with check (public.is_admin() or my_role() = 'lawyer' or user_id = auth.uid());
create policy "clients update"  on public.clients for update using (public.is_admin() or lawyer_id = auth.uid()) with check (public.is_admin() or lawyer_id = auth.uid());
create policy "clients delete"  on public.clients for delete using (public.is_admin());

-- ---------- child tables: visible if the parent case is visible ----------
-- (clients can read wallets/timeline/messages/documents of their own case; notes excluded below)
create policy "wallets rw" on public.wallets for all
  using (exists (select 1 from public.clients c where c.id = client_id and public.can_see_client(c)))
  with check (exists (select 1 from public.clients c where c.id = client_id and (public.is_admin() or c.lawyer_id = auth.uid())));

create policy "documents read" on public.documents for select
  using (exists (select 1 from public.clients c where c.id = client_id and public.can_see_client(c)));
create policy "documents write" on public.documents for all
  using (exists (select 1 from public.clients c where c.id = client_id and (public.is_admin() or c.lawyer_id = auth.uid() or c.user_id = auth.uid())))
  with check (exists (select 1 from public.clients c where c.id = client_id and (public.is_admin() or c.lawyer_id = auth.uid() or c.user_id = auth.uid())));

create policy "timeline rw" on public.timeline for all
  using (exists (select 1 from public.clients c where c.id = client_id and public.can_see_client(c)))
  with check (exists (select 1 from public.clients c where c.id = client_id and (public.is_admin() or c.lawyer_id = auth.uid())));

create policy "messages rw" on public.messages for all
  using (exists (select 1 from public.clients c where c.id = client_id and public.can_see_client(c)))
  with check (exists (select 1 from public.clients c where c.id = client_id and public.can_see_client(c)));

-- NOTES: lawyer + admin only — clients are explicitly excluded
create policy "notes rw" on public.notes for all
  using (exists (select 1 from public.clients c where c.id = client_id and (public.is_admin() or c.lawyer_id = auth.uid())))
  with check (exists (select 1 from public.clients c where c.id = client_id and (public.is_admin() or c.lawyer_id = auth.uid())));

-- ---------- activity ----------
create policy "activity read"  on public.activity for select using (public.is_admin() or my_role() = 'lawyer');
create policy "activity insert" on public.activity for insert with check (auth.uid() is not null);

-- ============================================================
-- Trigger: create a profile automatically on signup.
-- Reads name/role from the signup metadata (raw_user_meta_data).
-- ============================================================
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, role, name, email, title)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'client'),
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    new.email,
    coalesce(new.raw_user_meta_data->>'title', '')
  );
  -- if the new user is a client, open a blank case for them
  if coalesce(new.raw_user_meta_data->>'role', 'client') = 'client' then
    insert into public.clients (user_id, name, email)
    values (new.id, coalesce(new.raw_user_meta_data->>'name', ''), new.email);
  end if;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
-- Realtime: broadcast row changes so other sessions stay in sync
-- ============================================================
alter publication supabase_realtime add table public.clients, public.wallets, public.documents, public.timeline, public.messages, public.notes, public.activity;

-- ============================================================
-- DONE. Next:
--  1. Create your first admin: sign a user up through the app (or
--     Auth > Users), then in SQL run:
--       update public.profiles set role='admin' where email='you@firm.com';
--  2. (Optional) create a Storage bucket named 'evidence' for real
--     file uploads, and use signed URLs from the client.
-- ============================================================
