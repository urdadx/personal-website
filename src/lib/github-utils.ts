export const resolveGitHubToken = () => {
  const env = typeof process !== "undefined" ? process.env : undefined;

  return env?.GITHUB_TOKEN ?? env?.VITE_GITHUB_TOKEN ?? undefined;
};
