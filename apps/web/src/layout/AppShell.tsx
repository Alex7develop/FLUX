import { NavLink, Outlet } from 'react-router-dom';
import { Suspense } from 'react';
import { useFluxStore } from '../store/useFluxStore';

const links = [
  { to: '/app', label: 'Workspace', end: true },
  { to: '/app/inbox', label: 'Inbox' },
  { to: '/app/search', label: 'Search' },
  { to: '/app/graph', label: 'Graph' },
  { to: '/app/devices', label: 'Devices' },
];

export function AppShell() {
  const connected = useFluxStore((state) => state.connected);

  return (
    <div className="relative min-h-screen">
      <header className="sticky top-0 z-20 flex items-center justify-between gap-4 px-5 py-4 backdrop-blur-xl md:px-8">
        <NavLink to="/app" className="tracking-[0.28em] text-xs font-semibold">
          FLUX
        </NavLink>
        <nav className="hidden items-center gap-5 text-sm text-mute md:flex" aria-label="App">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                isActive ? 'text-ink' : 'transition-colors hover:text-ink'
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-xs text-mute">
          <span className="hidden font-mono tracking-[0.16em] uppercase sm:inline">
            {connected ? 'Web · connected' : 'Web · local'}
          </span>
          <NavLink to="/app/settings" className="hover:text-ink">
            Settings
          </NavLink>
        </div>
      </header>
      <nav
        className="flex gap-4 overflow-x-auto px-5 pb-2 text-sm text-mute md:hidden"
        aria-label="App mobile"
      >
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) => (isActive ? 'text-ink' : undefined)}
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <Suspense
        fallback={
          <main className="grid min-h-[50vh] place-items-center text-mute">Loading workspace…</main>
        }
      >
        <Outlet />
      </Suspense>
    </div>
  );
}
