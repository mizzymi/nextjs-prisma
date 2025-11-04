import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");
    if (!token) return NextResponse.redirect(new URL("/dashboard?verify=missing", req.url));

    const vt = await prisma.verificationToken.findUnique({ where: { token } });
    if (!vt) return NextResponse.redirect(new URL("/dashboard?verify=invalid", req.url));
    if (vt.expires < new Date()) {
        await prisma.verificationToken.delete({ where: { token } });
        return NextResponse.redirect(new URL("/dashboard?verify=expired", req.url));
    }

    await prisma.user.update({
        where: { email: vt.identifier },
        data: { emailVerified: new Date() },
    });
    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.redirect(new URL("/dashboard?verify=ok", req.url));
}
