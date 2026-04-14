"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createBrowserSupabaseClient } from "@/lib/supabase/client";
import { loginSchema } from "@/types/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const result = loginSchema.safeParse({ email, password });
    if (!result.success) {
      const errors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0];
        if (typeof field === "string") {
          errors[field] = issue.message;
        }
      }
      setFieldErrors(errors);
      return;
    }

    setLoading(true);

    const supabase = createBrowserSupabaseClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      const errorMessage = signInError.message || "Invalid email or password. Please try again.";
      setError(errorMessage);
      setLoading(false);
      return;
    }

    router.refresh();
    router.push("/dashboard");
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold tracking-tight">Welcome back</h2>
        <p className="mt-2 text-base text-muted-foreground">
          Sign in to continue tracking your applications.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {error && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive shadow-sm">
            <div className="flex items-start gap-3">
              <svg className="h-5 w-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
              <p>{error}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email" className="text-sm font-semibold">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-base transition-colors focus-visible:bg-background"
          />
          {fieldErrors.email && (
            <p className="text-sm font-medium text-destructive">{fieldErrors.email}</p>
          )}
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password" className="text-sm font-semibold">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="Your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="h-12 rounded-xl border-border/80 bg-muted/40 px-4 text-base transition-colors focus-visible:bg-background"
          />
          {fieldErrors.password && (
            <p className="text-sm font-medium text-destructive">{fieldErrors.password}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={loading}
          className="mt-2 h-12 rounded-xl text-base font-semibold tracking-wide shadow-lg shadow-primary/25 transition-all hover:shadow-xl hover:shadow-primary/30"
        >
          {loading ? "Signing in..." : "Sign in"}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-semibold text-primary hover:underline">
            Create one
          </Link>
        </p>
      </form>
    </div>
  );
}
