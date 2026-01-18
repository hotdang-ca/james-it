-- Securely fetch job details by UUID (Magic Link)
-- This function runs with "security definer" meaning it bypasses RLS (uses creator's permissions).
create or replace function get_job_by_uuid(job_uuid uuid)
returns setof jobs
language sql
security definer
as $$
  select * from jobs where customer_uuid = job_uuid;
$$;

-- Securely fetch messages for a job via UUID
create or replace function get_job_messages(job_uuid uuid)
returns setof messages
language sql
security definer
as $$
  select m.* 
  from messages m
  join jobs j on m.job_id = j.id
  where j.customer_uuid = job_uuid
  order by m.created_at asc;
$$;

-- Securely fetch latest geo logs for a job via UUID
create or replace function get_job_geolocation(job_uuid uuid)
returns setof geolocation_logs
language sql
security definer
as $$
  select g.*
  from geolocation_logs g
  join jobs j on g.job_id = j.id
  where j.customer_uuid = job_uuid
  order by g.created_at desc
  limit 100; -- Limit history for performance
$$;

-- Grant access to public (anon)
grant execute on function get_job_by_uuid to anon, authenticated;
grant execute on function get_job_messages to anon, authenticated;
grant execute on function get_job_geolocation to anon, authenticated;
