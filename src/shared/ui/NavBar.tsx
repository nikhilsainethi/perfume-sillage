// ============================================================
// SILLAGE — editorial nav
// Slim bar: wordmark left, destinations + search right. The
// active pill MORPHS between links (shared layoutId). Search is
// global — from any page it filters the atlas and lands on the
// fan. The bar is near-opaque so section eyebrows and orbs don't
// ghost through beneath it; a right-edge fade hints that the
// link row scrolls on narrow phones.
// ============================================================

import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useAtelier } from '@/store/atelierStore';
import { useDiscovery } from '@/store/discoveryStore';

const LINKS = [
  { to: '/', label: 'Atlas', end: true },
  { to: '/finder', label: 'Finder', end: false },
  { to: '/houses', label: 'Houses', end: false },
  { to: '/atelier', label: 'Atelier', end: false },
  { to: '/shelf', label: 'My Shelf', end: false },
];

export function NavBar() {
  const count = useAtelier((s) => s.creations.length);
  const setSearch = useDiscovery((s) => s.setSearch);
  const clearNotes = useDiscovery((s) => s.clearNotes);
  const navigate = useNavigate();

  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (searchOpen) inputRef.current?.focus();
  }, [searchOpen]);

  const submit = () => {
    const q = query.trim();
    setSearchOpen(false);
    setQuery('');
    if (!q) return;
    setSearch(q);
    clearNotes();
    navigate('/', { state: { scrollTo: 'browse' } });
  };

  return (
    <header className="glass-nav sticky top-0 z-40 border-b border-[var(--line)]">
      <nav
        aria-label="Primary"
        className="relative mx-auto flex h-14 w-full max-w-[1180px] items-center justify-between gap-2 px-4 sm:px-8"
      >
        <Link
          to="/"
          className="shrink-0 font-display text-[17px] tracking-[0.08em] text-parchment outline-none transition-colors hover:text-champagne-bright sm:text-[19px]"
        >
          SILLAGE
        </Link>

        <div className="relative flex min-w-0 items-center">
          {/* five links must survive a 375px viewport — scroll, don't wrap */}
          <div className="scrollbar-none flex items-center gap-0.5 overflow-x-auto pr-8 sm:gap-2 sm:pr-0">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.end}
                className="relative shrink-0 rounded-chip px-2.5 py-1.5 font-sans text-[13px] outline-none sm:px-4"
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
          {/* scroll hint on phones: the row fades out under the search button */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-7 w-8 sm:hidden"
            style={{ background: 'linear-gradient(90deg, transparent, #FAF8F4)' }}
          />

          <button
            type="button"
            aria-label="Search the atlas"
            onClick={() => setSearchOpen(true)}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-parchment-dim outline-none transition-colors hover:text-champagne-bright"
          >
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden>
              <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
              <path d="M20 20l-3.8-3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* global search overlay — one field, Enter lands on the filtered fan */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="glass-nav absolute inset-0 z-10 flex items-center gap-3 px-4 sm:px-8"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-champagne-bright">
                <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.6" />
                <path d="M20 20l-3.8-3.8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') submit();
                  if (e.key === 'Escape') setSearchOpen(false);
                }}
                onBlur={() => setSearchOpen(false)}
                placeholder="Search any scent, house, nose or note…"
                className="h-full flex-1 bg-transparent font-sans text-[15px] text-parchment placeholder:text-muted outline-none"
              />
              <span className="hidden shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-muted sm:block">
                Enter to search · Esc to close
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  );
}
