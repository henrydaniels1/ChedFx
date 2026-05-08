-- Media Gallery Table Setup
-- Run this if creating the table for the first time:
/*
create table media_gallery (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  name text not null,
  path text not null,
  note text default '',
  created_at timestamptz default now()
);

alter table media_gallery enable row level security;

create policy "Users manage own media" on media_gallery
  for all using (auth.uid() = user_id);
*/

-- If table already exists, run this to add the note column:
alter table media_gallery add column if not exists note text default '';
