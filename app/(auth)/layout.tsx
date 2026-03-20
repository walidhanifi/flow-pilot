export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1">
      {/* Left panel — bold gradient */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between relative overflow-hidden bg-[oklch(0.58_0.22_25)]">
        {/* Layered gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[oklch(0.55_0.24_15)] via-[oklch(0.58_0.22_25)] to-[oklch(0.65_0.20_45)]" />
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_25%_25%,white_1px,transparent_1px)] bg-[length:32px_32px]" />

        <div className="relative z-10 flex flex-col justify-between h-full p-12">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Tracker
            </h1>
          </div>
          <div className="max-w-sm">
            <blockquote className="text-xl font-semibold leading-relaxed text-white/95">
              &ldquo;The job search is a full-time job. Track it like one.&rdquo;
            </blockquote>
            <p className="mt-4 text-sm font-medium text-white/70">
              Organize applications, track progress, land the role.
            </p>
          </div>
          <div className="text-xs text-white/40">
            Built for focused job seekers.
          </div>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
        {/* Mobile logo */}
        <div className="mb-10 lg:hidden">
          <h1 className="text-2xl font-bold tracking-tight text-primary">
            Tracker
          </h1>
        </div>
        <div className="w-full max-w-[420px]">{children}</div>
      </div>
    </div>
  );
}
