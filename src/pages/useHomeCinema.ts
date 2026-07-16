// ============================================================
// SILLAGE — Home scroll cinema (GSAP + ScrollTrigger)
// The overture: a pinned constellation stage whose title drifts
// and letter-spaces open as you scroll out, counter-drifting
// strips of real bottles, and the champagne progress hairline.
//
// Guard rails: everything behind prefers-reduced-motion, the
// pin is desktop-only, useGSAP reverts every trigger on
// unmount, and this route's transition is opacity-only so no
// transformed ancestor ever breaks the pin.
// ============================================================

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(ScrollTrigger, useGSAP);

export function useHomeCinema(scope: React.RefObject<HTMLDivElement | null>) {
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

          gsap.to('[data-scroll-progress]', {
            scaleX: 1,
            ease: 'none',
            scrollTrigger: { start: 0, end: 'max', scrub: 0.35 },
          });

          // counter-drifting shelves of real bottles
          gsap.to('[data-strip-a]', {
            xPercent: -14,
            ease: 'none',
            scrollTrigger: { trigger: '[data-strip-a]', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          });
          gsap.to('[data-strip-b]', {
            xPercent: 14,
            ease: 'none',
            scrollTrigger: { trigger: '[data-strip-b]', start: 'top bottom', end: 'bottom top', scrub: 0.6 },
          });

          // section headlines unmask on entry
          for (const sel of ['[data-h2-counted]', '[data-h2-doors]']) {
            gsap.fromTo(
              sel,
              { clipPath: 'inset(0 0 100% 0)', y: 26 },
              {
                clipPath: 'inset(0 0 -14% 0)',
                y: 0,
                ease: 'none',
                scrollTrigger: { trigger: sel, start: 'top 88%', end: 'top 58%', scrub: 0.5 },
              },
            );
          }

          if (!desktop) return;

          // pinned overture: the title parts from the constellation stage
          gsap
            .timeline({
              scrollTrigger: {
                trigger: '[data-overture]',
                start: 'top top',
                end: '+=60%',
                scrub: 0.6,
                pin: true,
                anticipatePin: 1,
              },
            })
            .to('[data-h1-title]', { yPercent: -18, opacity: 0.14, letterSpacing: '0.12em', ease: 'none' }, 0)
            .to('[data-h1-sub]', { yPercent: -50, opacity: 0, ease: 'none' }, 0)
            .to('[data-h1-cta]', { yPercent: -34, opacity: 0, ease: 'none' }, 0)
            .to('[data-h1-stage]', { scale: 0.955, opacity: 0.45, ease: 'none' }, 0);
        },
      );
    },
    { scope },
  );
}
