-- Run this SQL in your Supabase SQL Editor to create the trade_reminders table

create table trade_reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  pair text not null,
  direction text not null,
  remind_at timestamptz not null,
  sl numeric,
  tp numeric,
  notes text,
  created_at timestamptz default now()
);

-- Enable Row Level Security
alter table trade_reminders enable row level security;

-- Create policy so users can only manage their own reminders
create policy "Users manage own reminders" on trade_reminders
  for all using (auth.uid() = user_id);

-- Create index for faster queries
create index trade_reminders_user_id_idx on trade_reminders(user_id);
create index trade_reminders_remind_at_idx on trade_reminders(remind_at);
