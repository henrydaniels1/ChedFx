-- Add note column to existing media_gallery table
alter table media_gallery add column note text default '';
