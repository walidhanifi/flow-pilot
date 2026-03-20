"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  readonly email: string;
}

export function Header({ email }: HeaderProps) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);

    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (!res.ok) {
        setLoggingOut(false);
        return;
      }
      router.refresh();
      router.push("/login");
    } catch {
      setLoggingOut(false);
    }
  }

  return (
    <header className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-lg font-semibold">Tracker</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-muted-foreground">{email}</span>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          disabled={loggingOut}
        >
          {loggingOut ? "Logging out..." : "Log out"}
        </Button>
      </div>
    </header>
  );
}
