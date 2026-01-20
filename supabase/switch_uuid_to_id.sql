-- Update RPCs to use job.id instead of customer_uuid

-- Get Job By UUID (Now looks up by Primary Key ID)
CREATE OR REPLACE FUNCTION get_job_by_uuid(job_uuid uuid)
RETURNS SETOF jobs
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM jobs WHERE id = job_uuid;
$$;

-- Get Job Messages
CREATE OR REPLACE FUNCTION get_job_messages(job_uuid uuid)
RETURNS SETOF messages
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT m.* 
  FROM messages m
  WHERE m.job_id = job_uuid
  ORDER BY m.created_at ASC;
$$;

-- Get Job Geolocation
CREATE OR REPLACE FUNCTION get_job_geolocation(job_uuid uuid)
RETURNS SETOF geolocation_logs
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT g.*
  FROM geolocation_logs g
  WHERE g.job_id = job_uuid
  ORDER BY g.created_at ASC;
$$;
