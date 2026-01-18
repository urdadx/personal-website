export interface Project {
	title: string;
	description: string;
	link: string;
	year: string;
	status?: "active" | "archived";
	repoKey?: string;
}

export const projects: Project[] = [
	{
		title: "Padyna",
		description: "AI powered customer service platform for businesses",
		link: "https://padyna.com",
		year: "2025",
		status: "active",
		repoKey: "padyna",
	},
	{
		title: "Bundy",
		description: "A fun wordsearch adventure game",
		link: "https://bundy.urdadx.com",
		year: "2026",
		status: "active",
		repoKey: "bundy",
	},
	{
		title: "Librelinks",
		description: "An open-source link in bio tool",
		link: "https://github.com/urdadx/librelinks",
		year: "2023",
		status: "active",
		repoKey: "librelinks",
	},
];
