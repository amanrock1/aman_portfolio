import { Resend } from "resend";
import { z } from "zod";

export const dynamic = "force-dynamic";

const resend = new Resend(process.env.RESEND_API_KEY);

const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 3;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

const Email = z.object({
  fullName: z.string().min(2, "Full name is invalid!"),
  email: z.string().email({ message: "Email is invalid!" }),
  message: z.string().min(10, "Message is too short!"),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "unknown";
    if (isRateLimited(ip)) {
      return Response.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { success, data, error: zodError } = Email.safeParse(body);
    if (!success) {
      return Response.json({ error: zodError?.message }, { status: 400 });
    }

    const { fullName, email, message } = data;

    const html = `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px;background:#f9fafb;border-radius:12px;">
        <h2 style="margin:0 0 8px;font-size:22px;color:#111827;">New message from your portfolio</h2>
        <p style="margin:0 0 24px;color:#6b7280;font-size:14px;">Someone reached out via your contact form.</p>
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:12px 16px;background:#fff;border:1px solid #e5e7eb;border-radius:8px 8px 0 0;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;font-weight:600;">Name</span><br/>
              <span style="font-size:16px;color:#111827;font-weight:600;">${fullName}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px;background:#fff;border:1px solid #e5e7eb;border-top:none;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;font-weight:600;">Email</span><br/>
              <a href="mailto:${email}" style="font-size:15px;color:#2563eb;">${email}</a>
            </td>
          </tr>
          <tr>
            <td style="padding:12px 16px;background:#fff;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 8px 8px;">
              <span style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#9ca3af;font-weight:600;">Message</span><br/>
              <p style="font-size:15px;color:#374151;margin:8px 0 0;line-height:1.6;">${message}</p>
            </td>
          </tr>
        </table>
        <p style="margin:24px 0 0;font-size:12px;color:#d1d5db;">Sent via portfolio contact form</p>
      </div>
    `;

    const { data: resendData, error: resendError } = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: ["amanprabhat438@gmail.com"],
      subject: `New message from ${fullName} — Portfolio`,
      html,
    });

    if (resendError) {
      console.error("Resend error:", resendError);
      return Response.json({ error: "Failed to send email", detail: resendError }, { status: 500 });
    }

    return Response.json({ success: true, id: resendData?.id });
  } catch (error) {
    console.error("Send route error:", error);
    return Response.json({ error: String(error) }, { status: 500 });
  }
}
