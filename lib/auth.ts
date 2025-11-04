import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(prisma) as any,
    secret: process.env.NEXTAUTH_SECRET,
    session: { strategy: "jwt" },
    providers: [
        Credentials({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            authorize: async (creds) => {
                if (!creds?.email || !creds?.password) return null;
                const user = await prisma.user.findUnique({ where: { email: creds.email } });
                if (!user) return null;
                const ok = await bcrypt.compare(creds.password, user.passwordHash);
                if (!ok) return null;
                return { id: String(user.id), email: user.email, name: user.name ?? undefined };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) token.id = (user as any).id;
            return token;
        },
        async session({ session, token }) {
            if (token?.id) (session.user as any).id = token.id;
            return session;
        },
    },
};