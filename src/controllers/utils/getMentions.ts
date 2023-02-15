export const getMentions = (content: string): string[] | null => {
  const regex = /\B@[a-z0-9_-]+/gi;
  return content.match(regex);
};
