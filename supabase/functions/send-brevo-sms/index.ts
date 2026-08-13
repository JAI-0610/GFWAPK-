import "@supabase/functions-js/edge-runtime.d.ts";

const BREVO_API_KEY = Deno.env.get("BREVO_API_KEY");
const BREVO_SENDER = Deno.env.get("BREVO_SENDER") || "GoFarmWork";

export default {
  async fetch(req: Request) {
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405 })
    }

    try {
      if (!BREVO_API_KEY) {
        throw new Error("BREVO_API_KEY is missing in Edge Function secrets.");
      }

      const payload = await req.json()
      
      // Supabase send_sms hook payload structure:
      // {
      //   "user": { ... },
      //   "sms": { "otp": "123456" },
      //   "phone": "+1234567890"
      // }
      const phone = payload.phone || payload.user?.phone;
      const otp = payload.sms?.otp;

      if (!phone || !otp) {
        console.error("Missing phone or OTP in payload:", payload);
        return new Response(JSON.stringify({ error: 'Missing phone or OTP in payload' }), {
          headers: { 'Content-Type': 'application/json' },
          status: 400,
        })
      }

      console.log(`Sending OTP to ${phone} via Brevo...`);

      const response = await fetch("https://api.brevo.com/v3/transactionalSMS/sms", {
        method: "POST",
        headers: {
          "accept": "application/json",
          "api-key": BREVO_API_KEY,
          "content-type": "application/json"
        },
        body: JSON.stringify({
          type: "transactional",
          unicodeEnabled: false,
          sender: BREVO_SENDER,
          recipient: phone,
          content: `Your GoFarmWork verification code is: ${otp}`
        })
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Brevo API error:", result);
        return new Response(JSON.stringify({ error: result }), {
          headers: { 'Content-Type': 'application/json' },
          status: response.status,
        })
      }

      console.log(`Successfully dispatched SMS to ${phone}`);

      return new Response(JSON.stringify({ success: true, result }), {
        headers: { 'Content-Type': 'application/json' },
        status: 200,
      })

    } catch (error) {
      console.error("Internal error:", error);
      return new Response(JSON.stringify({ error: error.message }), {
        headers: { 'Content-Type': 'application/json' },
        status: 500,
      })
    }
  },
};
