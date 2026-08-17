import { Link, Outlet } from 'react-router-dom';

export function PublicLayout() {
  return (
    <div className="relative min-h-screen">
      <header className="flex items-center justify-between px-5 py-5 md:px-10">
        <Link to="/" className="tracking-[0.28em] text-xs font-semibold">
          FLUX
        </Link>
        <nav className="flex items-center gap-5 text-sm text-mute" aria-label="Marketing">
          <Link to="/pricing" className="hover:text-ink">
            Pricing
          </Link>
          <Link to="/login" className="hover:text-ink">
            Log in
          </Link>
          <Link
            to="/app"
            className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-[#07080d]"
          >
            Try FLUX
          </Link>
        </nav>
      </header>
      <Outlet />
    </div>
  );
}
