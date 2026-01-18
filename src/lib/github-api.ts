import {
  buildContributionCalendar,
  buildWeeksFromDayMap,
  normalizeContributionColors,
} from "@/lib/contribution-calendar";
import type { ContributionDay } from "@/lib/github";
import { defaultContributionColors } from "@/lib/github";
import { resolveGitHubToken } from "@/lib/github-utils";
import { createServerFn } from "@tanstack/react-start";

export const getGitHubRepoInfo = createServerFn({ method: "GET" }).handler(async () => {
	return {};
});

export const getGitHubContributionCalendar = createServerFn({ method: "GET" }).handler(async () => {
	const username = "urdadx";
	const token = resolveGitHubToken();

	if (token) {
		try {
			// Set 'to' to end of today
			const to = new Date();
			to.setHours(23, 59, 59, 999);

			// Set 'from' to exactly 365 days ago from today
			const from = new Date(to);
			from.setDate(from.getDate() - 364);
			from.setHours(0, 0, 0, 0);

			const response = await fetch("https://api.github.com/graphql", {
				method: "POST",
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
					"User-Agent": "Portfolio-Website",
				},
				body: JSON.stringify({
					query: `
              query ($login: String!, $from: DateTime!, $to: DateTime!) {
                user(login: $login) {
                  contributionsCollection(from: $from, to: $to) {
                    contributionCalendar {
                      totalContributions
                      colors
                      weeks {
                        contributionDays {
                          date
                          color
                          contributionCount
                        }
                      }
                    }
                  }
                }
              }
            `,
					variables: {
						login: username,
						from: from.toISOString(),
						to: to.toISOString(),
					},
				}),
			});

			if (!response.ok) {
				throw new Error(`GitHub GraphQL request failed: ${response.status}`);
			}

			const graphResult = (await response.json()) as {
				data?: {
					user?: {
						contributionsCollection?: {
							contributionCalendar?: {
								totalContributions?: number;
								colors?: string[];
								weeks: {
									contributionDays: Array<{
										date: string;
										color: string;
										contributionCount: number;
									}>;
								}[];
							};
						};
					};
				};
				errors?: Array<{ message: string }>;
			};

			if (graphResult.errors?.length) {
				const aggregated = graphResult.errors.map((err) => err.message).join("; ");
				throw new Error(`GitHub GraphQL errors: ${aggregated}`);
			}

			const calendarData =
				graphResult.data?.user?.contributionsCollection?.contributionCalendar;

			if (calendarData) {
				const colors = normalizeContributionColors(calendarData.colors ?? []);
				const today = new Date();
				today.setHours(23, 59, 59, 999);

				// Create a map of all contribution days
				const dayMap = new Map<string, ContributionDay>();

				for (const week of calendarData.weeks) {
					for (const day of week.contributionDays) {
						const dayDate = new Date(day.date);
						dayDate.setHours(0, 0, 0, 0);

						// Skip future dates
						if (dayDate > today) {
							continue;
						}

						const levelIndex = colors.indexOf(day.color);
						dayMap.set(day.date, {
							date: day.date,
							count: day.contributionCount,
							level: levelIndex >= 0 ? levelIndex : 0,
							fill: day.color,
						});
					}
				}

				const weeks = buildWeeksFromDayMap(dayMap);

				if (weeks.length === 0) {
					return null;
				}

				return buildContributionCalendar(
					weeks,
					colors,
					calendarData.totalContributions,
				);
			}
		} catch (error) {
			console.error("Failed to fetch GitHub contributions via GraphQL:", error);
		}
	}

	try {
		const response = await fetch("https://github.com/users/urdadx/contributions", {
			headers: {
				Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
				"Accept-Language": "en-US,en;q=0.9",
				"Cache-Control": "no-cache",
				Pragma: "no-cache",
				"User-Agent":
					"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
			},
		});

		if (!response.ok) {
			throw new Error(`GitHub contributions request failed: ${response.status}`);
		}

		const html = await response.text();
		const rectMatches = html.match(/<rect[^>]*>/g) ?? [];

		const dayMap = new Map<string, ContributionDay>();
		const levelColors: Record<number, string> = {};

		for (const rect of rectMatches) {
			const attributes: Record<string, string> = {};
			const attrRegex = /([a-zA-Z_:][a-zA-Z0-9_.:-]*)="([^"]*)"/g;
			let attrMatch: RegExpExecArray | null;

			while ((attrMatch = attrRegex.exec(rect)) !== null) {
				const [, key, value] = attrMatch;
				attributes[key] = value;
			}

			const date = attributes["data-date"];

			if (!date) {
				continue;
			}

			const count = Number.parseInt(attributes["data-count"] ?? "0", 10);
			const level = Number.parseInt(attributes["data-level"] ?? "0", 10);
			const fill = attributes["fill"];

			if (Number.isFinite(level) && fill && levelColors[level] === undefined) {
				levelColors[level] = fill;
			}

			dayMap.set(date, {
				date,
				count: Number.isFinite(count) ? count : 0,
				level: Number.isFinite(level) ? level : 0,
				fill,
			});
		}

		if (dayMap.size === 0) {
			throw new Error("No contribution data parsed from GitHub response");
		}

		const weeks = buildWeeksFromDayMap(dayMap);

		if (weeks.length === 0) {
			throw new Error("No contribution data parsed from GitHub response");
		}

		const totalMatch = html.match(/([0-9,]+) contributions in the last year/i);
		const totalContributions = totalMatch
			? Number.parseInt(totalMatch[1]!.replace(/,/g, ""), 10)
			: undefined;

		const colors = normalizeContributionColors(
			Array.from(
				{ length: 5 },
				(_, index) => levelColors[index] ?? defaultContributionColors[index],
			),
		);

		return buildContributionCalendar(weeks, colors, totalContributions);
	} catch (error) {
		console.error("Failed to fetch GitHub contributions via HTML:", error);
		return null;
	}
});
