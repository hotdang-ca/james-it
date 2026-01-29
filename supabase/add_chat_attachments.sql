-- Add attachment columns to messages table
ALTER TABLE messages
ADD COLUMN attachment_url text,
ADD COLUMN attachment_type text,
ADD COLUMN attachment_name text;
