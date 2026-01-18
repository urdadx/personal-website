export interface ContributionDay {
	date: string;
	count: number;
	level: number;
	fill?: string;
}

export type ContributionWeek = (ContributionDay | null)[];

export interface ContributionCalendar {
	weeks: ContributionWeek[];
	weekLabels: string[];
	totalContributions?: number;
	levelColors: string[];
	recentWeeks?: ContributionWeek[];
	recentWeekLabels?: string[];
}

export const defaultContributionColors = ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"];
