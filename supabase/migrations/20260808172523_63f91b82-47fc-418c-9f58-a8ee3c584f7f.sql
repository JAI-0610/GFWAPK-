GRANT SELECT ON public.jobs TO anon;
CREATE POLICY "jobs_public_open_read" ON public.jobs FOR SELECT TO anon USING (status = 'open');