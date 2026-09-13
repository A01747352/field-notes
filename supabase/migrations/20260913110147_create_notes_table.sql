-- Field Notes: core "notes" table.
--
-- Shape follows the Note entity in docs/design.md (section 3): text,
-- photo(s), category, location, date/time, weather, music and people
-- are all optional except the timestamp — a note can be a bare photo,
-- a bare thought, or both.

create table if not exists public.notes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade default auth.uid(),

  text text,
  photo_paths text[] not null default '{}',

  category text check (
    category is null
    or category in ('place', 'cafe', 'hike', 'food', 'culture', 'people', 'thought', 'sound')
  ),

  -- Location, reverse-geocoded to a display name (e.g. "Uppsala").
  latitude double precision,
  longitude double precision,
  place_name text,

  -- When the moment happened, distinct from when the row was written,
  -- so a note can be backdated and so client-side timezone handling
  -- doesn't corrupt "when" (see docs/github-workflow.md's own example
  -- bug: fix/note-date-timezone-bug).
  occurred_at timestamptz not null default now(),

  -- Auto-filled context, confirmed by the user before saving.
  weather jsonb, -- { "temp_c": 12, "condition": "cloudy" }
  music jsonb, -- { "track": "Apéro", "artist": "Polo & Pan", "album_art_url": "...", "spotify_url": "..." }
  people text[] not null default '{}', -- free-text mentions, not linked accounts

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  -- A note needs at least a photo or some text to be worth keeping.
  -- (cardinality(), not array_length(): array_length() on an empty
  -- array returns NULL, and a CHECK treats NULL as passing.)
  constraint notes_has_content check (text is not null or cardinality(photo_paths) > 0)
);

comment on table public.notes is 'A single field note: a moment worth keeping, per docs/design.md.';

create index if not exists notes_user_id_occurred_at_idx
  on public.notes (user_id, occurred_at desc);

-- Keep updated_at current on every edit.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists notes_set_updated_at on public.notes;
create trigger notes_set_updated_at
  before update on public.notes
  for each row
  execute function public.set_updated_at();

-- Row Level Security: every user only ever sees and touches their own notes.
alter table public.notes enable row level security;

create policy "Notes are selectable by their owner"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Notes are insertable by their owner"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Notes are updatable by their owner"
  on public.notes for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Notes are deletable by their owner"
  on public.notes for delete
  using (auth.uid() = user_id);

-- Storage: a private bucket for note photos, one folder per user
-- (path convention: "<user_id>/<file>"), enforced by policy below.
insert into storage.buckets (id, name, public)
values ('note-photos', 'note-photos', false)
on conflict (id) do nothing;

create policy "Note photos are readable by their owner"
  on storage.objects for select
  using (
    bucket_id = 'note-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Note photos are uploadable by their owner"
  on storage.objects for insert
  with check (
    bucket_id = 'note-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );

create policy "Note photos are deletable by their owner"
  on storage.objects for delete
  using (
    bucket_id = 'note-photos'
    and auth.uid()::text = (storage.foldername(name))[1]
  );
