-- ENUMS
CREATE TYPE public.app_role AS ENUM ('worker','landlord','admin');
CREATE TYPE public.wage_type AS ENUM ('per_day','per_acre','fixed');
CREATE TYPE public.job_status AS ENUM ('draft','open','in_progress','completed','cancelled');
CREATE TYPE public.application_status AS ENUM ('pending','shortlisted','hired','rejected','withdrawn');
CREATE TYPE public.contract_status AS ENUM ('pending','active','completed','disputed','cancelled');

-- PROFILES
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT '',
  phone TEXT,
  photo_url TEXT,
  village TEXT,
  district TEXT,
  state TEXT,
  language TEXT NOT NULL DEFAULT 'en',
  bio TEXT,
  skills TEXT[] NOT NULL DEFAULT '{}',
  crops TEXT[] NOT NULL DEFAULT '{}',
  equipment TEXT[] NOT NULL DEFAULT '{}',
  years_experience INT NOT NULL DEFAULT 0,
  day_rate NUMERIC(10,2),
  farm_name TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT false,
  rating NUMERIC(3,2) NOT NULL DEFAULT 0,
  jobs_completed INT NOT NULL DEFAULT 0,
  onboarded BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_read_all" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- ROLES
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT, INSERT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "roles_read_all" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "roles_insert_self_non_admin" ON public.user_roles FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id AND role <> 'admin');

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

-- JOBS
CREATE TABLE public.jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  crop TEXT,
  description TEXT,
  area_acres NUMERIC(8,2),
  crew_size INT NOT NULL DEFAULT 1,
  skills_required TEXT[] NOT NULL DEFAULT '{}',
  wage_amount NUMERIC(10,2) NOT NULL,
  wage_type public.wage_type NOT NULL DEFAULT 'per_day',
  start_date DATE,
  end_date DATE,
  food_provided BOOLEAN NOT NULL DEFAULT false,
  stay_provided BOOLEAN NOT NULL DEFAULT false,
  transport_provided BOOLEAN NOT NULL DEFAULT false,
  tools_provided BOOLEAN NOT NULL DEFAULT false,
  village TEXT,
  district TEXT,
  state TEXT,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  urgency TEXT NOT NULL DEFAULT 'flexible',
  women_friendly BOOLEAN NOT NULL DEFAULT false,
  women_only BOOLEAN NOT NULL DEFAULT false,
  escrow_funded BOOLEAN NOT NULL DEFAULT false,
  escrow_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status public.job_status NOT NULL DEFAULT 'open',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.jobs TO authenticated;
GRANT ALL ON public.jobs TO service_role;
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "jobs_read_all" ON public.jobs FOR SELECT TO authenticated USING (true);
CREATE POLICY "jobs_insert_own" ON public.jobs FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "jobs_update_own" ON public.jobs FOR UPDATE TO authenticated USING (auth.uid() = owner_id) WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "jobs_delete_own" ON public.jobs FOR DELETE TO authenticated USING (auth.uid() = owner_id);
CREATE INDEX jobs_status_created_idx ON public.jobs (status, created_at DESC);
CREATE INDEX jobs_district_idx ON public.jobs (district);

-- APPLICATIONS
CREATE TABLE public.job_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  message TEXT,
  voice_note_url TEXT,
  counter_wage NUMERIC(10,2),
  status public.application_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (job_id, worker_id)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.job_applications TO authenticated;
GRANT ALL ON public.job_applications TO service_role;
ALTER TABLE public.job_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "apps_read_involved" ON public.job_applications FOR SELECT TO authenticated
  USING (auth.uid() = worker_id OR auth.uid() = (SELECT owner_id FROM public.jobs j WHERE j.id = job_id));
CREATE POLICY "apps_insert_own" ON public.job_applications FOR INSERT TO authenticated WITH CHECK (auth.uid() = worker_id);
CREATE POLICY "apps_update_involved" ON public.job_applications FOR UPDATE TO authenticated
  USING (auth.uid() = worker_id OR auth.uid() = (SELECT owner_id FROM public.jobs j WHERE j.id = job_id))
  WITH CHECK (auth.uid() = worker_id OR auth.uid() = (SELECT owner_id FROM public.jobs j WHERE j.id = job_id));
CREATE POLICY "apps_delete_own" ON public.job_applications FOR DELETE TO authenticated USING (auth.uid() = worker_id);

-- CONTRACTS
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.jobs(id) ON DELETE CASCADE,
  worker_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  agreed_wage NUMERIC(10,2) NOT NULL,
  wage_type public.wage_type NOT NULL DEFAULT 'per_day',
  start_date DATE,
  end_date DATE,
  escrow_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  released_amount NUMERIC(12,2) NOT NULL DEFAULT 0,
  status public.contract_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.contracts TO authenticated;
GRANT ALL ON public.contracts TO service_role;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contracts_read_involved" ON public.contracts FOR SELECT TO authenticated
  USING (auth.uid() = worker_id OR auth.uid() = owner_id);
CREATE POLICY "contracts_insert_owner" ON public.contracts FOR INSERT TO authenticated WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "contracts_update_involved" ON public.contracts FOR UPDATE TO authenticated
  USING (auth.uid() = worker_id OR auth.uid() = owner_id)
  WITH CHECK (auth.uid() = worker_id OR auth.uid() = owner_id);

-- WALLET
CREATE TABLE public.wallet_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  contract_id UUID REFERENCES public.contracts(id) ON DELETE SET NULL,
  amount NUMERIC(12,2) NOT NULL,
  direction TEXT NOT NULL DEFAULT 'credit',
  kind TEXT NOT NULL DEFAULT 'payout',
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.wallet_transactions TO authenticated;
GRANT ALL ON public.wallet_transactions TO service_role;
ALTER TABLE public.wallet_transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wallet_read_own" ON public.wallet_transactions FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "wallet_insert_own" ON public.wallet_transactions FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- MESSAGES
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  recipient_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT,
  voice_note_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.messages TO authenticated;
GRANT ALL ON public.messages TO service_role;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_read_involved" ON public.messages FOR SELECT TO authenticated
  USING (auth.uid() = sender_id OR auth.uid() = recipient_id);
CREATE POLICY "messages_insert_own" ON public.messages FOR INSERT TO authenticated WITH CHECK (auth.uid() = sender_id);

-- NOTICE BOARD
CREATE TABLE public.notice_board (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  kind TEXT NOT NULL DEFAULT 'notice',
  title TEXT NOT NULL,
  body TEXT,
  image_url TEXT,
  district TEXT,
  village TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notice_board TO authenticated;
GRANT ALL ON public.notice_board TO service_role;
ALTER TABLE public.notice_board ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notice_read_all" ON public.notice_board FOR SELECT TO authenticated USING (true);
CREATE POLICY "notice_insert_own" ON public.notice_board FOR INSERT TO authenticated WITH CHECK (auth.uid() = author_id);
CREATE POLICY "notice_update_own" ON public.notice_board FOR UPDATE TO authenticated USING (auth.uid() = author_id) WITH CHECK (auth.uid() = author_id);
CREATE POLICY "notice_delete_own" ON public.notice_board FOR DELETE TO authenticated USING (auth.uid() = author_id);

-- updated_at trigger
CREATE OR REPLACE FUNCTION public.touch_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER t_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER t_jobs_updated BEFORE UPDATE ON public.jobs FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER t_apps_updated BEFORE UPDATE ON public.job_applications FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();
CREATE TRIGGER t_contracts_updated BEFORE UPDATE ON public.contracts FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- auto-create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', ''))
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();