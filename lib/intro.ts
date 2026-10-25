/**
 * The preloader plays once per hard load. Hero animations wait for it on
 * that first load, and start straight away on later client navigations.
 */
export const INTRO_SECONDS = 2.1;

let played = false;

export function introDelay(): number {
  return played ? 0 : INTRO_SECONDS;
}

export function markIntroPlayed(): void {
  played = true;
}
