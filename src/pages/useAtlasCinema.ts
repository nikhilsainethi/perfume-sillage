// ============================================================
// SILLAGE — Atlas scroll cinema (GSAP + ScrollTrigger)
// The journey page becomes scroll-orchestrated: a briefly
// pinned hero whose layers part at different depths, scrubbed
// mask-reveals on each act's headline, and a champagne
// progress hairline under the nav.
//
// Guard rails ("make no mistakes"):
// - everything sits behind prefers-reduced-motion
// - the pin is desktop-only (gsap.matchMedia)
// - the route transition for THIS page is opacity-only, so no
//   transformed ancestor ever breaks ScrollTrigger's pinning
// - useGSAP scopes + reverts every trigger on unmount
// ============================================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useAtlasCinema(scope: React.RefObject<HTMLDivElement | null>) {
  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add(
        {
          motionOK: '(prefers-reduced-motion: no-preference)',
          desktop: '(min-width: 1024px)',
        },
        (context) => {
          const { motionOK, desktop } = context.conditions as {
            motionOK: boolean;
            desktop: boolean;
          };
          if (!motionOK) return;

          // champagne hairline tracking the whole journey
          gsap.to('[data-scroll-progress]', {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.35 },
          });

          // each act's headline unmasks as it enters
          for (const sel of ['#discover h2', '#browse h2', '#compare h2']) {
            gsap.fromTo(
              sel,
              { clipPath: 'inset(0 0 100% 0)', y: 26 },
              {
                clipPath: 'inset(0 0 -14% 0)', // slight overshoot so descenders never clip
                y: 0,
                ease: 'none',
                scrollTrigger: { trigger: sel, start: 'top 88%', end: 'top 56%', scrub: 0.5 },
              },
            );
          }

          if (!desktop) return;

          // pinned hero: layers part at different depths as you leave
          gsap
            .timeline({
              scrollTrigger: {
                trigger: '[data-hero]',
                start: 'top top',
                end: '+=55%',
                scrub: 0.6,
                pin: true,
                anticipatePin: 1,
              },
            })
            .to('[data-hero-title]', { yPercent: -16, opacity: 0.16, letterSpacing: '0.05em', ease: 'none' }, 0)
            .to('[data-hero-sub]', { yPercent: -46, opacity: 0, ease: 'none' }, 0)
            .to('[data-hero-cta]', { yPercent: -32, opacity: 0, ease: 'none' }, 0)
            .to('[data-hero-bottle]', { yPercent: 9, scale: 0.94, ease: 'none' }, 0);
        },
      );
    },
    { scope },
  );
}
