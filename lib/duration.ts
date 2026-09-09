/**
 * Tenure maths.
 *
 * Every duration on the site — "5 months" in the experience card, the
 * months-of-experience stat, the About paragraph — is derived from the
 * start/end months in `data/experience.ts` rather than typed out, so none
 * of it goes stale on its own.
 *
 * Every function takes an explicit `now`. The page passes one timestamp
 * down from the server so the server render and the client hydration
 * agree; nothing here reads the clock on its own.
 */

/** A month, as `YYYY-MM`. A role with no end month is still running. */
export type MonthStamp = string;

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

/** Splits `YYYY-MM` into its two numbers. */
function parseStamp(stamp: MonthStamp): [year: number, month: number] {
  const [year = 1970, month = 1] = stamp.split("-").map(Number);
  return [year, month];
}

/** Months since epoch — the unit all the arithmetic below works in. */
function toMonthIndex(stamp: MonthStamp): number {
  const [year, month] = parseStamp(stamp);
  return year * 12 + (month - 1);
}

function monthIndexOf(date: Date): number {
  return date.getFullYear() * 12 + date.getMonth();
}

/** "2025-04" → "Apr 2025". */
export function formatMonth(stamp: MonthStamp): string {
  const [year, month] = parseStamp(stamp);
  return `${MONTH_NAMES[month - 1]} ${year}`;
}

/**
 * Whole months worked, counting the start month itself — the way people
 * read a CV. April to September inclusive is six months, not five.
 */
export function monthsWorked(
  start: MonthStamp,
  end: MonthStamp | undefined,
  now: Date,
): number {
  const last = end ? toMonthIndex(end) : monthIndexOf(now);
  return Math.max(1, last - toMonthIndex(start) + 1);
}

/** 5 → "5 months"; 14 → "1 yr 2 mos"; 24 → "2 yrs". */
export function formatDuration(months: number): string {
  if (months < 12) return `${months} ${months === 1 ? "month" : "months"}`;

  const years = Math.floor(months / 12);
  const rest = months % 12;
  const yearPart = `${years} ${years === 1 ? "yr" : "yrs"}`;

  return rest === 0 ? yearPart : `${yearPart} ${rest} ${rest === 1 ? "mo" : "mos"}`;
}

/** "Apr 2025 — Present". */
export function formatPeriod(
  start: MonthStamp,
  end: MonthStamp | undefined,
): string {
  return `${formatMonth(start)} — ${end ? formatMonth(end) : "Present"}`;
}

/** "Apr 2025 — Present · 6 months" — the line shown on an experience card. */
export function formatTenure(
  start: MonthStamp,
  end: MonthStamp | undefined,
  now: Date,
): string {
  return `${formatPeriod(start, end)} · ${formatDuration(monthsWorked(start, end, now))}`;
}

/**
 * Total months of experience across every role.
 *
 * Overlapping roles are merged rather than added: a two-month internship
 * taken during a full-time job is two months of the same calendar, not two
 * extra months of experience.
 */
export function totalMonthsOfExperience(
  roles: readonly { startDate: MonthStamp; endDate?: MonthStamp }[],
  now: Date,
): number {
  const ranges = roles
    .map((role) => ({
      from: toMonthIndex(role.startDate),
      to: role.endDate ? toMonthIndex(role.endDate) : monthIndexOf(now),
    }))
    .sort((a, b) => a.from - b.from);

  let total = 0;
  let cursor = -Infinity;

  for (const range of ranges) {
    // Ranges are inclusive of both end months, hence the +1 on each span.
    const from = Math.max(range.from, cursor + 1);
    if (range.to >= from) {
      total += range.to - from + 1;
      cursor = range.to;
    }
  }

  return Math.max(1, total);
}
