-- 1. Notification preferences
CREATE TABLE public.notification_prefs (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  in_app boolean NOT NULL DEFAULT true,
  email boolean NOT NULL DEFAULT true,
  sms boolean NOT NULL DEFAULT false,
  whatsapp boolean NOT NULL DEFAULT true,
  job_alerts boolean NOT NULL DEFAULT true,
  application_updates boolean NOT NULL DEFAULT true,
  contract_milestones boolean NOT NULL DEFAULT true,
  payment_updates boolean NOT NULL DEFAULT true,
  quiet_hours_start smallint,
  quiet_hours_end smallint,
  timezone text NOT NULL DEFAULT 'Asia/Kolkata',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.notification_prefs TO authenticated;
GRANT ALL ON public.notification_prefs TO service_role;
ALTER TABLE public.notification_prefs ENABLE ROW LEVEL SECURITY;
CREATE POLICY notification_prefs_own ON public.notification_prefs FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER t_notification_prefs_updated BEFORE UPDATE ON public.notification_prefs
  FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

-- 2. Notifications inbox
CREATE TYPE public.notification_kind AS ENUM (
  'job_alert','application_update','contract_milestone','payment_update','invite','message','system'
);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind public.notification_kind NOT NULL DEFAULT 'system',
  title text NOT NULL,
  body text,
  link text,
  data jsonb NOT NULL DEFAULT '{}'::jsonb,
  read_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY notifications_read_own ON public.notifications FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY notifications_update_own ON public.notifications FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY notifications_delete_own ON public.notifications FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
CREATE INDEX idx_notifications_user_created ON public.notifications (user_id, created_at DESC);
CREATE INDEX idx_notifications_unread ON public.notifications (user_id) WHERE read_at IS NULL;

-- 3. Delivery log
CREATE TABLE public.notification_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id uuid REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  channel text NOT NULL,
  destination text,
  status text NOT NULL DEFAULT 'queued',
  provider text,
  provider_message_id text,
  error text,
  attempts integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  sent_at timestamptz
);
GRANT SELECT ON public.notification_deliveries TO authenticated;
GRANT ALL ON public.notification_deliveries TO service_role;
ALTER TABLE public.notification_deliveries ENABLE ROW LEVEL SECURITY;
CREATE POLICY notification_deliveries_read_own ON public.notification_deliveries FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE INDEX idx_deliveries_notification ON public.notification_deliveries (notification_id);

-- 4. Phone verification (WhatsApp / SMS OTP)
CREATE TABLE public.phone_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text NOT NULL,
  code_hash text NOT NULL,
  channel text NOT NULL DEFAULT 'whatsapp',
  attempts integer NOT NULL DEFAULT 0,
  expires_at timestamptz NOT NULL,
  verified_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.phone_verifications TO service_role;
ALTER TABLE public.phone_verifications ENABLE ROW LEVEL SECURITY;
CREATE INDEX idx_phone_verifications_phone ON public.phone_verifications (phone, created_at DESC);

-- 5. Profile flags
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS phone_verified boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS whatsapp_opt_in boolean NOT NULL DEFAULT true;