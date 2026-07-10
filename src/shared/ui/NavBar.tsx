// ============================================================
// SILLAGE — editorial nav
// Slim glass bar: wordmark left, the five destinations right.
// The active pill MORPHS between links (shared layoutId) —
// navigation feels like one object sliding, not two states.
// ============================================================

import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAtelier } from '@/store/atelierStore';

const LINKS = [
  { to: '/', label: 'Atlas', end: true },
  { to: '/finder', label: 'Finder', end: false },
  { to: '/houses', label: 'Houses', end: false },
  { to: '/atelier', label: 'Atelier', end: false },
  { to: '/shelf', label: 'My Shelf', end: false },
];

export function NavBar() {
  const count = useAtelier((s) => s.creations.length);

  return (
    <header className="glass sticky top-0 z-40 border-b border-[var(--line)]">
      <nav
        aria-label="Primary"
        className="mx-auto flex h-14 w-full max-w-[1180px] items-center justify-between px-5 sm:px-8"
      >
        <Link
          to="/"
          className="shrink-0 font-display text-[19px] tracking-[0.08em] text-parchment outline-none transition-colors hover:text-champagne-bright"
        >
          SILLAGE
        </Link>

        {/* five links must survive a 390px viewport — scroll, don't wrap */}
        <div className="scrollbar-none flex items-center gap-1 overflow-x-auto sm:gap-2">
          {LINKS.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className="relative shrink-0 rounded-chip px-3 py-1.5 font-sans text-[13px] outline-none sm:px-4"
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.span
                      layoutId="nav-pill"
                      className="absolute inset-0 rounded-chip"
                      style={{ background: 'rgba(176,132,60,0.14)' }}
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span
                    className="relative z-10 transition-colors"
                    style={{ color: isActive ? '#8A6526' : '#6E6456' }}
                  >
                    {l.label}
                    {l.to === '/shelf' && count > 0 && (
                      <span
                        className="ml-1.5 inline-flex h-[16px] min-w-[16px] items-center justify-center rounded-full px-1 font-mono text-[10px]"
                        style={{
                          background: isActive ? '#B0843C' : 'rgba(176,132,60,0.18)',
                          color: isActive ? '#FFFFFF' : '#8A6526',
                        }}
                      >
                        {count}
                      </span>
                    )}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
}
