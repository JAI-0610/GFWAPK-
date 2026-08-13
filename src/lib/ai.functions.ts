import { createServerFn } from "@tanstack/react-start";

type AskInput = {
  question: string;
  language: string;
  role: string;
};

export const askFarmhand = createServerFn({ method: "POST" })
  .inputValidator((input: AskInput) => {
    if (!input || typeof input.question !== "string" || input.question.trim().length === 0) {
      throw new Error("Question is required");
    }
    return {
      question: input.question.slice(0, 1000),
      language: String(input.language ?? "English").slice(0, 40),
      role: String(input.role ?? "worker").slice(0, 20),
    };
  })
  .handler(async ({ data }) => {
    const key = process.env["EXTERNAL_API_KEY"];
    if (!key) throw new Error("AI is not configured");

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${key}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{
            text: `You are Farmhand, a warm, practical assistant inside GO FARM WORK, a marketplace for Indian farm owners and farm workers.
The user is a ${data.role}. Always answer in ${data.language}.
Keep answers under 120 words, use very simple words, short sentences, no jargon, no markdown headings.
Help with: fair daily wages by crop and region, how to describe farm work, worker safety, crop timing, and how payments are held safely until work is done.
If asked about anything outside farming or farm work, gently steer back.`
          }]
        },
        contents: [
          { role: "user", parts: [{ text: data.question }] },
        ],
      }),
    });

    if (response.status === 429) throw new Error("Too many questions right now. Try again shortly.");
    if (!response.ok) {
      const body = await response.text();
      throw new Error(`AI request failed [${response.status}]: ${body}`);
    }

    const json = await response.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text?.trim();

    return { answer: text || "Sorry, I could not answer that. Please ask again." };
  });
