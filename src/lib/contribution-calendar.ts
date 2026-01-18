import { defaultContributionColors } from "@/lib/github";
import type { ContributionCalendar, ContributionDay, ContributionWeek } from "@/lib/github";

const MOBILE_WEEKS = 26;

export const normalizeContributionColors = (colors: string[]) =>
  Array.from({ length: 5 }, (_, index) => colors[index] ?? defaultContributionColors[index]);

export const buildContributionCalendar = (
  weeks: ContributionWeek[],
  colors: string[],
  totalContributions?: number,
): ContributionCalendar => {
  const normalizedColors = normalizeContributionColors(colors);
  const weekLabels: string[] = [];
  const monthFormatter = new Intl.DateTimeFormat("en-US", { month: "short" });
  let lastMonth = -1;
  let lastYear = -1;

  weeks.forEach((week, weekIndex) => {
    const firstActiveDay = week.find((day) => day !== null);

    if (!firstActiveDay) {
      weekLabels.push("");
      return;
    }

    const date = new Date(firstActiveDay.date);
    const currentMonth = date.getMonth();
    const currentYear = date.getFullYear();

    // Show label only on first occurrence of a new month
    if (currentMonth !== lastMonth || currentYear !== lastYear) {
      // Check if the first day of this week is early enough in the month (day 1-14)
      // GitHub only shows month labels when there's enough space
      const firstDayOfWeek = new Date(firstActiveDay.date);
      const dayOfMonth = firstDayOfWeek.getDate();

      // Skip label for the very first week if it's a partial week (< 7 days)
      // This prevents showing labels when the year starts mid-week
      if (weekIndex === 0 && week.length < 7) {
        weekLabels.push("");
      } else if (dayOfMonth <= 14) {
        weekLabels.push(monthFormatter.format(date));
        lastMonth = currentMonth;
        lastYear = currentYear;
      } else {
        weekLabels.push("");
      }
    } else {
      weekLabels.push("");
    }
  });

  return {
    weeks,
    weekLabels,
    totalContributions,
    levelColors: normalizedColors,
    recentWeeks: weeks.slice(-MOBILE_WEEKS),
    recentWeekLabels: weekLabels.slice(-MOBILE_WEEKS),
  };
};

export const buildWeeksFromDayMap = (dayMap: Map<string, ContributionDay>): ContributionWeek[] => {
  const sortedDates = Array.from(dayMap.keys()).sort();
  if (sortedDates.length === 0) {
    return [];
  }

  const firstDate = new Date(sortedDates[0]!);
  const lastDate = new Date(sortedDates[sortedDates.length - 1]!);

  // Don't show future dates - cap at today
  const today = new Date();
  today.setHours(23, 59, 59, 999);
  const effectiveLastDate = lastDate > today ? today : lastDate;

  // Find the Sunday of the week containing firstDate
  // getDay() returns 0 for Sunday, 1 for Monday, etc.
  const startDate = new Date(firstDate);
  const dayOfWeek = startDate.getDay();
  startDate.setDate(startDate.getDate() - dayOfWeek); // Go back to Sunday

  // Build weeks: each week is [Sun, Mon, Tue, Wed, Thu, Fri, Sat]
  const weeks: ContributionWeek[] = [];
  let currentWeek: ContributionWeek = [];

  for (
    let cursor = new Date(startDate);
    cursor <= effectiveLastDate;
    cursor.setDate(cursor.getDate() + 1)
  ) {
    const isoDate = cursor.toISOString().split("T")[0]!;
    const contributionDay = dayMap.get(isoDate) ?? null;

    currentWeek.push(contributionDay);

    // If we've filled 7 days (Sun-Sat), start a new week
    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }

  // Add any remaining partial week
  if (currentWeek.length > 0) {
    // Pad with nulls to make it 7 days
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    weeks.push(currentWeek);
  }

  return weeks;
};
