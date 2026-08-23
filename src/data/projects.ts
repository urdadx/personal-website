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
    title: "Bizme",
    description: "Better audience engagement backend for your content",
    link: "https://bizme.urdadx.com",
    year: "2026",
    status: "active",
    repoKey: "bizme",
  },
  {
    title: "Blockade",
    description: "A chrome extension to block distracting websites and apps",
    link: "https://blockade.urdadx.com",
    year: "2026",
    status: "active",
    repoKey: "blockade",
  },
  {
    title: "Librelinks",
    description: "An open-source link in bio platform for creators",
    link: "https://links.urdadx.com",
    year: "2023",
    status: "active",
    repoKey: "librelinks",
  },
  {
    title: "Bundy",
    description: "Multiplayer wordsearch adventure game",
    link: "https://bundy.urdadx.com",
    year: "2025",
    status: "active",
    repoKey: "bundy",
  },

];
