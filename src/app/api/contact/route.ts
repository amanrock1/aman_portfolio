import { NextResponse } from "next/server";
import { Resend } from "resend";
import { z } from "zod";
import { config } from "@/data/config";

const schema = z.object({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().email().max(200),
  message: z.string().trim().min(5).max(5000),
  website: z.string().max(0).optional(), // honeypot: real people leave it empty
});

// Simple per-instance rate limit: 5 messages per IP per hour.
const hits = new Map<string, number[]>();
function limited(ip: string) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < 3_600_000);
  recent.push(now);
  hits.set(ip, recent);
  return recent.length > 5;
}

export async function POST(req: Request) {
  const key = process.env.RESEND_API_KEY;
  if (!key) return NextResponse.json({ error: "Contact form is not configured." }, { status: 503 });

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (limited(ip)) return NextResponse.json({ error: "Too many messages. Please email directly." }, { status: 429 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Please check the form fields." }, { status: 400 });
  const { name, email, message } = parsed.data;

  const { error } = await new Resend(key).emails.send({
    from: "Portfolio <onboarding@resend.dev>",
    to: config.email,
    replyTo: email,
    subject: `Portfolio message from ${name}`,
    text: `${message}\n\n— ${name} <${email}>`,
  });
  if (error) return NextResponse.json({ error: "Could not send. Please email directly." }, { status: 502 });

  return NextResponse.json({ ok: true });
}
