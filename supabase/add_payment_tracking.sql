-- Add payment tracking columns to jobs table
alter table jobs 
add column if not yet exists deposit_paid boolean default false,
add column if not yet exists payment_method text; -- 'stripe', 'cash', 'etransfer', etc.

-- No RLS changes needed as Admin has full access and Public has no direct update access (handled via API/RPC)
