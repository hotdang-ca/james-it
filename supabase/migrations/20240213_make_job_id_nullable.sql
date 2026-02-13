-- Make job_id nullable in payment_requests to support invoice-only payments
ALTER TABLE public.payment_requests
ALTER COLUMN job_id DROP NOT NULL;
