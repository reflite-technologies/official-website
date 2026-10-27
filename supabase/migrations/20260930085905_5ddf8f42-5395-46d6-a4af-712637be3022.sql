create type public.app_role as enum ('admin', 'user');
create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  unique (user_id, role)
);
grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;
alter table public.user_roles enable row level security;
create policy "Users see own roles" on public.user_roles for select to authenticated using (user_id = auth.uid());

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean language sql stable security definer set search_path = public
as $$ select exists (select 1 from public.user_roles where user_id = _user_id and role = _role) $$;

-- First account ever created becomes the admin
create or replace function public.handle_first_admin()
returns trigger language plpgsql security definer set search_path = public
as $$
begin
  if not exists (select 1 from public.user_roles where role = 'admin') then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  end if;
  return new;
end $$;
create trigger on_auth_user_created_first_admin after insert on auth.users
for each row execute function public.handle_first_admin();

create table public.inbox_messages (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('email','website','instagram','x')),
  external_id text,
  thread_id text,
  from_name text,
  from_address text,
  subject text,
  body text not null default '',
  received_at timestamptz not null default now(),
  status text not null default 'new' check (status in ('new','read','replied')),
  ai_draft text,
  reply text,
  replied_at timestamptz,
  created_at timestamptz not null default now(),
  unique (channel, external_id)
);
grant select, update, delete on public.inbox_messages to authenticated;
grant all on public.inbox_messages to service_role;
alter table public.inbox_messages enable row level security;
create policy "Admins read inbox" on public.inbox_messages for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins update inbox" on public.inbox_messages for update to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "Admins delete inbox" on public.inbox_messages for delete to authenticated using (public.has_role(auth.uid(),'admin'));
create index inbox_messages_received_idx on public.inbox_messages (received_at desc);