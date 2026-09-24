export function Spinner({ size = 40 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center py-16">
      <div
        className="animate-spin rounded-full border-4 border-slate-700 border-t-brand-500"
        style={{ width: size, height: size }}
      />
    </div>
  );
}

export function FullPageSpinner() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-4">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-brand-500" />
        <p className="text-sm text-slate-400">Loading...</p>
      </div>
    </div>
  );
}