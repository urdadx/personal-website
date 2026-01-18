import type { CSSProperties } from "react";
import { memo, useState } from "react";

import type { ContributionCalendar, ContributionDay, ContributionWeek } from "@/lib/github";
import { cn } from "@/lib/utils";

interface TooltipData {
  contributions: number;
  date: string;
  dayName: string;
  x: number;
  y: number;
}

interface GithubContributionsProps {
  calendar: ContributionCalendar;
}

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const visibleDayLabels = new Set([1, 3, 5]);

const rangeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
});

const MOBILE_WEEK_LIMIT = 26;
const GRID_GAP = 4;
const MOBILE_GRID_GAP = 3;
const MOBILE_CELL_MIN = 12;

export const GithubContributions = memo(function GithubContributions({
  calendar,
}: GithubContributionsProps) {
  const { weeks, weekLabels, recentWeeks, recentWeekLabels, totalContributions, levelColors } =
    calendar;
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);

  if (!weeks.length) {
    return null;
  }

  const startDate = weeks[0]?.find((day) => day)?.date ?? weeks[0]?.[weeks[0].length - 1]?.date;
  const lastActiveWeek = [...weeks].reverse().find((week) => week.some((day) => day !== null));
  const endDate = lastActiveWeek
    ?.slice()
    .reverse()
    .find((day) => day)?.date;

  const rangeText =
    startDate && endDate
      ? `${rangeFormatter.format(new Date(startDate))} – ${rangeFormatter.format(new Date(endDate))}`
      : undefined;

  const buildColumnStyle = (
    count: number,
    options?: { minCell?: number; gap?: number },
  ): CSSProperties => ({
    gridTemplateColumns: options?.minCell
      ? `repeat(${count}, minmax(${options.minCell}px, 1fr))`
      : `repeat(${count}, minmax(0, 1fr))`,
    columnGap: `${options?.gap ?? GRID_GAP}px`,
  });

  const buildRowStyle = (gap: number): CSSProperties => ({
    gridTemplateRows: "repeat(7, minmax(0, 1fr))",
    rowGap: `${gap}px`,
  });

  const columnStyle = buildColumnStyle(weeks.length);
  const weekRowStyle = buildRowStyle(GRID_GAP);

  const renderDayCell = (day: ContributionDay | null, dayOfWeek: number, weekIndex: number) => {
    if (!day) {
      return (
        <span
          key={`day-${dayOfWeek}-${weekIndex}-empty`}
          className="aspect-square w-full rounded-[3px]"
        />
      );
    }

    const background = day.fill ?? levelColors[day.level] ?? levelColors[0] ?? "#ebedf0";
    const contributions = day.count ?? 0;

    const date = new Date(day.date);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    const formattedDate = date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    const handleMouseEnter = (e: React.MouseEvent<HTMLSpanElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      setTooltip({
        contributions,
        date: formattedDate,
        dayName,
        x: rect.left + rect.width / 2,
        y: rect.top - 8,
      });
    };

    const handleMouseLeave = () => {
      setTooltip(null);
    };

    return (
      <span
        key={`day-${dayOfWeek}-${weekIndex}`}
        role="img"
        className="aspect-square w-full rounded-[3px] border border-border/20 hover:border-border/40 transition-colors cursor-default"
        style={{ backgroundColor: background }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        aria-label={`${contributions} contribution${contributions === 1 ? "" : "s"} on ${formattedDate}`}
      />
    );
  };

  const renderDayRow = (
    dayOfWeek: number,
    calendarWeeks: ContributionWeek[],
    dayColumnStyle: CSSProperties,
  ) => {
    return (
      <div key={`day-${dayOfWeek}`} className="grid" style={dayColumnStyle}>
        {calendarWeeks.map((week, weekIndex) =>
          renderDayCell(week[dayOfWeek] ?? null, dayOfWeek, weekIndex),
        )}
      </div>
    );
  };

  const renderCalendar = (
    calendarWeeks: ContributionWeek[],
    labels: string[],
    variants: {
      showWeekdayColumn: boolean;
      columnStyle: CSSProperties;
      rowStyle: CSSProperties;
      scrollable?: boolean;
    },
  ) => {
    const contentClassName = cn(
      "flex flex-col gap-3",
      variants.scrollable && "overflow-x-auto pb-1",
    );

    return (
      <div className={cn(variants.showWeekdayColumn && "grid md:grid-cols-[auto_1fr] md:gap-4")}>
        {variants.showWeekdayColumn && (
          <div
            className="hidden md:grid text-[11px] font-medium text-muted-foreground"
            style={weekRowStyle}
            aria-hidden
          >
            {Array.from({ length: 7 }).map((_, index) => (
              <span
                key={`day-label-${index}`}
                className={visibleDayLabels.has(index) ? "leading-3" : "invisible"}
              >
                {visibleDayLabels.has(index) ? dayNames[index] : "—"}
              </span>
            ))}
          </div>
        )}

        <div className={contentClassName}>
          <div
            className="grid text-[9px] uppercase tracking-wide text-muted-foreground sm:text-[10px]"
            style={variants.columnStyle}
            aria-hidden
          >
            {labels.map((label, index) => (
              <span key={`month-${index}`} className="leading-3">
                {label}
              </span>
            ))}
          </div>
          <div className="grid" style={variants.rowStyle}>
            {Array.from({ length: 7 }).map((_, dayOfWeek) =>
              renderDayRow(dayOfWeek, calendarWeeks, variants.columnStyle),
            )}
          </div>
        </div>
      </div>
    );
  };

  const mobileWeeks = recentWeeks?.length ? recentWeeks : weeks.slice(-MOBILE_WEEK_LIMIT);
  const mobileLabels = recentWeekLabels?.length
    ? recentWeekLabels
    : weekLabels.slice(-MOBILE_WEEK_LIMIT);
  const mobileGridMinWidth =
    mobileWeeks.length * MOBILE_CELL_MIN + (mobileWeeks.length - 1) * MOBILE_GRID_GAP;

  const mobileColumnStyle: CSSProperties = {
    ...buildColumnStyle(mobileWeeks.length, {
      minCell: MOBILE_CELL_MIN,
      gap: MOBILE_GRID_GAP,
    }),
    minWidth: mobileGridMinWidth,
  };

  const mobileRowStyle: CSSProperties = {
    ...buildRowStyle(MOBILE_GRID_GAP),
    minWidth: mobileGridMinWidth,
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/60 p-4 relative">
      <div className="mb-6 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium sm:text-base" style={{ fontFamily: "Inter, sans-serif" }}>
          {typeof totalContributions === "number"
            ? `${totalContributions.toLocaleString("en-US")} contributions in the last year`
            : "Contributions in the last year"}
        </p>
        {rangeText && (
          <p
            className="text-xs text-muted-foreground sm:text-sm sm:text-right sm:leading-snug sm:whitespace-nowrap"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {rangeText}
          </p>
        )}
      </div>

      <div className="hidden md:block">
        {renderCalendar(weeks, weekLabels, {
          showWeekdayColumn: true,
          columnStyle,
          rowStyle: weekRowStyle,
        })}
      </div>

      <div className="md:hidden">
        {renderCalendar(mobileWeeks, mobileLabels, {
          showWeekdayColumn: false,
          columnStyle: mobileColumnStyle,
          rowStyle: mobileRowStyle,
          scrollable: true,
        })}
      </div>

      <div className=" flex flex-wrap items-center justify-end gap-2 text-[11px] text-muted-foreground ">
        <span>Less</span>
        <div className="flex items-center" style={{ gap: `${GRID_GAP}px` }}>
          {levelColors.map((color, index) => (
            <span
              key={`legend-${index}`}
              className="h-3 w-3 rounded-[3px] border border-border/30 sm:h-2.75 sm:w-2.75"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {tooltip && (
        <div
          className="fixed z-50 pointer-events-none"
          style={{
            left: `${tooltip.x}px`,
            top: `${tooltip.y}px`,
            transform: "translate(-50%, -100%)",
          }}
        >
          <div className="bg-foreground text-background px-3 py-2 rounded-md shadow-lg text-xs font-mono whitespace-nowrap">
            <div className="font-semibold">
              {tooltip.contributions === 0
                ? "No contributions"
                : tooltip.contributions === 1
                  ? "1 contribution"
                  : `${tooltip.contributions} contributions`}
            </div>
            <div className="text-[10px] opacity-80 mt-0.5">
              {tooltip.dayName}, {tooltip.date}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
