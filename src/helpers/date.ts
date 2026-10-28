const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_DAY = 24 * MS_PER_HOUR;

export const formatLongDate = (date: Date): string =>
  date.toLocaleDateString(undefined, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

/** e.g. "Fri, 9 Oct" (locale dependent). */
export const formatShortDate = (date: Date): string =>
  date.toLocaleDateString(undefined, {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  });

/** e.g. "3:30 PM" (locale dependent). */
export const formatTime = (date: Date): string =>
  date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });

export const formatDateTime = (date: Date): string =>
  `${formatShortDate(date)} · ${formatTime(date)}`;

/** e.g. "Today, 5:30 PM", "Tomorrow, 9:00 AM" or "Fri, 9 Oct, 3:30 PM". */
export const formatRelativeDateTime = (
  date: Date,
  now: Date = new Date(),
): string => {
  const dayDiff = Math.round(
    (startOfDay(date).getTime() - startOfDay(now).getTime()) / MS_PER_DAY,
  );
  const day =
    dayDiff === 0
      ? 'Today'
      : dayDiff === 1
      ? 'Tomorrow'
      : dayDiff === -1
      ? 'Yesterday'
      : formatShortDate(date);
  return `${day}, ${formatTime(date)}`;
};

/** Local calendar day as "yyyy-MM-dd", e.g. for comparing due dates. */
export const toLocalDayKey = (date: Date): string =>
  [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-');

export const startOfDay = (date: Date): Date =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

export const isSameDay = (a: Date, b: Date): boolean =>
  startOfDay(a).getTime() === startOfDay(b).getTime();

/** The next full hour after `from`, used as a sensible default reminder time. */
export const nextFullHour = (from: Date = new Date()): Date => {
  const next = new Date(from.getTime() + MS_PER_HOUR);
  next.setMinutes(0, 0, 0);
  return next;
};

/** Combines the calendar day of `day` with the clock time of `time`. */
export const withDate = (time: Date, day: Date): Date =>
  new Date(
    day.getFullYear(),
    day.getMonth(),
    day.getDate(),
    time.getHours(),
    time.getMinutes(),
  );

/** Combines the clock time of `time` with the calendar day of `day`. */
export const withTime = (day: Date, time: Date): Date => withDate(time, day);
