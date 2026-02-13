-- Create invoices table
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    contact_id UUID REFERENCES public.contacts(id) ON DELETE CASCADE,
    description TEXT,
    due_date DATE,
    status TEXT DEFAULT 'DRAFT' CHECK (status IN ('DRAFT', 'SENT', 'PAID', 'PARTIAL', 'VOID'))
);

-- Add invoice_id to jobs table
ALTER TABLE public.jobs 
ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL;

-- Add invoice_id to payment_requests table
ALTER TABLE public.payment_requests
ADD COLUMN IF NOT EXISTS invoice_id UUID REFERENCES public.invoices(id) ON DELETE SET NULL;

-- Enable Row Level Security (RLS) on invoices
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;

-- Create policies for invoices (adjust based on your actual auth needs, assuming public ready for now or authenticated admin)
-- Allow full access to authenticated users (admin)
create policy "Enable all access for authenticated users" on "public"."invoices"
  as permissive for all
  to authenticated
  using (true)
  with check (true);

-- Allow read access to everyone (access via UUID magic link needs this, or specific function)
-- For now, allowing public read for invoices similar to jobs if needed, or rely on service role for admin and public pages use specific fetching.
-- Assuming public read is needed for the magic link page:
create policy "Enable read access for public" on "public"."invoices"
  as permissive for select
  to public
  using (true);
