-- REVIEWS
CREATE TABLE public.reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contract_id uuid REFERENCES public.contracts(id) ON DELETE CASCADE,
  job_id uuid REFERENCES public.jobs(id) ON DELETE SET NULL,
  reviewer_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reviewee_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating integer NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment text,
  punctuality integer CHECK (punctuality BETWEEN 1 AND 5),
  quality integer CHECK (quality BETWEEN 1 AND 5),
  communication integer CHECK (communication BETWEEN 1 AND 5),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contract_id, reviewer_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.reviews TO authenticated;
GRANT ALL ON public.reviews TO service_role;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY reviews_read_all ON public.reviews FOR SELECT TO authenticated USING (true);
CREATE POLICY reviews_insert_own ON public.reviews FOR INSERT TO authenticated WITH CHECK (auth.uid() = reviewer_id AND reviewer_id <> reviewee_id);
CREATE POLICY reviews_update_own ON public.reviews FOR UPDATE TO authenticated USING (auth.uid() = reviewer_id) WITH CHECK (auth.uid() = reviewer_id);
CREATE POLICY reviews_delete_own ON public.reviews FOR DELETE TO authenticated USING (auth.uid() = reviewer_id);
CREATE TRIGGER t_reviews_updated BEFORE UPDATE ON public.reviews FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

CREATE OR REPLACE FUNCTION public.refresh_profile_rating()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE target uuid;
BEGIN
  target := COALESCE(NEW.reviewee_id, OLD.reviewee_id);
  UPDATE public.profiles p
     SET rating = COALESCE((SELECT ROUND(AVG(r.rating)::numeric, 2) FROM public.reviews r WHERE r.reviewee_id = target), 0)
   WHERE p.id = target;
  RETURN NULL;
END; $$;
CREATE TRIGGER t_reviews_rating AFTER INSERT OR UPDATE OR DELETE ON public.reviews
FOR EACH ROW EXECUTE FUNCTION public.refresh_profile_rating();

-- SAVED JOBS
CREATE TABLE public.saved_jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, job_id)
);
GRANT SELECT, INSERT, DELETE ON public.saved_jobs TO authenticated;
GRANT ALL ON public.saved_jobs TO service_role;
ALTER TABLE public.saved_jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY saved_jobs_own ON public.saved_jobs FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY saved_jobs_insert_own ON public.saved_jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY saved_jobs_delete_own ON public.saved_jobs FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- JOB ALERTS
CREATE TABLE public.job_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  district text,
  state text,
  crop text,
  keywords text,
  min_wage numeric,
  channel text NOT NULL DEFAULT 'app',
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_alerts TO authenticated;
GRANT ALL ON public.job_alerts TO service_role;
ALTER TABLE public.job_alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY job_alerts_all_own ON public.job_alerts FOR ALL TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER t_job_alerts_updated BEFORE UPDATE ON public.job_alerts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- JOB INVITES
CREATE TABLE public.job_invites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  owner_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  worker_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message text,
  status text NOT NULL DEFAULT 'sent',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (job_id, worker_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_invites TO authenticated;
GRANT ALL ON public.job_invites TO service_role;
ALTER TABLE public.job_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY job_invites_read_involved ON public.job_invites FOR SELECT TO authenticated USING (auth.uid() = owner_id OR auth.uid() = worker_id);
CREATE POLICY job_invites_insert_owner ON public.job_invites FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY job_invites_update_involved ON public.job_invites FOR UPDATE TO authenticated USING (auth.uid() = owner_id OR auth.uid() = worker_id) WITH CHECK (auth.uid() = owner_id OR auth.uid() = worker_id);
CREATE POLICY job_invites_delete_owner ON public.job_invites FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE TRIGGER t_job_invites_updated BEFORE UPDATE ON public.job_invites FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- MARKET RATES
CREATE TABLE public.market_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  crop text NOT NULL,
  district text,
  state text,
  wage_low numeric,
  wage_high numeric,
  unit text NOT NULL DEFAULT 'per_day',
  source text,
  rate_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.market_rates TO anon;
GRANT SELECT ON public.market_rates TO authenticated;
GRANT ALL ON public.market_rates TO service_role;
ALTER TABLE public.market_rates ENABLE ROW LEVEL SECURITY;
CREATE POLICY market_rates_public_read ON public.market_rates FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY market_rates_admin_write ON public.market_rates FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.market_rates (crop, district, state, wage_low, wage_high, unit, source) VALUES
('Paddy', 'Thanjavur', 'Tamil Nadu', 450, 600, 'per_day', 'Community reports'),
('Sugarcane', 'Kolhapur', 'Maharashtra', 500, 700, 'per_day', 'Community reports'),
('Cotton', 'Guntur', 'Andhra Pradesh', 400, 550, 'per_day', 'Community reports'),
('Wheat', 'Ludhiana', 'Punjab', 550, 750, 'per_day', 'Community reports'),
('Grapes', 'Nashik', 'Maharashtra', 500, 650, 'per_day', 'Community reports'),
('Tea', 'Jorhat', 'Assam', 350, 480, 'per_day', 'Community reports'),
('Banana', 'Theni', 'Tamil Nadu', 420, 580, 'per_day', 'Community reports'),
('Groundnut', 'Junagadh', 'Gujarat', 430, 560, 'per_day', 'Community reports');