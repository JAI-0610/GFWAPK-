-- Add gender and taluk to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS taluk TEXT;

-- Add taluk to jobs
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS taluk TEXT;

-- Add taluk to job_alerts
ALTER TABLE public.job_alerts ADD COLUMN IF NOT EXISTS taluk TEXT;
