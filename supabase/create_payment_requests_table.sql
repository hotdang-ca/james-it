-- Create payment_requests table
create table if not exists payment_requests (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  job_id uuid references jobs(id) not null,
  amount decimal(10, 2) not null,
  description text,
  stripe_payment_link text,
  stripe_session_id text,
  status text default 'PENDING', -- 'PENDING', 'PAID', 'CANCELLED'
  payment_method text -- 'STRIPE', 'CASH', 'E-TRANSFER'
);

-- Enable RLS
alter table payment_requests enable row level security;
create policy "Admin full access to payment_requests" on payment_requests for all using (auth.role() = 'authenticated');

-- Migrate existing data from jobs table
-- If a job has a stripe_payment_link, create a payment request for it
insert into payment_requests (job_id, amount, description, stripe_payment_link, status, payment_method)
select 
  id as job_id, 
  quoted_price as amount, 
  coalesce(description, 'Initial Deposit') as description, 
  stripe_payment_link, 
  case when deposit_paid = true then 'PAID' else 'PENDING' end as status,
  payment_method
from jobs
where stripe_payment_link is not null or deposit_paid = true;

-- Note: We are NOT dropping the columns from 'jobs' yet to ensure backward compatibility during dev, 
-- but in a production migration we might eventually clean them up. 
-- For now, 'payment_requests' will be the source of truth for payments.
