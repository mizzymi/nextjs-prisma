"use client";
import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="px-4 py-2 bg-teal-700 text-white rounded disabled:opacity-60 cursor-pointer"
    >
      Cerrar sesión
    </button>
  );
}
