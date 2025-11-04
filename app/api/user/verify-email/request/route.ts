import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { headers } from "next/headers";
import { mailer, verifyEmailTemplates } from "@/lib/mailer";

export const runtime = "nodejs";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    if (user.emailVerified) return NextResponse.json({ ok: true, alreadyVerified: true });

    const token = randomUUID();
    const expires = new Date(Date.now() + 1000 * 60 * 60); // 1h

    await prisma.verificationToken.deleteMany({ where: { identifier: user.email } });
    await prisma.verificationToken.create({ data: { identifier: user.email, token, expires } });

    const base = process.env.NEXTAUTH_URL;

    const verifyUrl = `${base}/api/user/verify-email/confirm?token=${token}`;

    if (process.env.NODE_ENV !== "production") await mailer.verify();

    const { subject, text, html } = verifyEmailTemplates(verifyUrl);
    const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
    const info = await mailer.sendMail({
      from,
      to: user.email,
      subject,
      text,
      html,
    });

    console.log("MAIL:", {
      messageId: info.messageId,
      accepted: info.accepted,
      rejected: info.rejected,
      response: info.response,
      envelope: info.envelope,
    });
    if (info.rejected && info.rejected.length) {
      return NextResponse.json(
        { error: `SMTP rechazó: ${info.rejected.join(", ")}` },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        ok: true,
        preview: process.env.NODE_ENV !== "production" ? verifyUrl : undefined,
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("verify-email request error:", err);
    return NextResponse.json({ error: err?.message || "Error enviando el email" }, { status: 500 });
  }
}
