const MENTION_REGEX = /@(\w{3,30})/g;

export function parseMentions(content: string): string[] {
  const matches = content.match(MENTION_REGEX);
  if (!matches) return [];
  return matches.map((m) => m.slice(1));
}

export function replaceMentionsWithLinks(content: string): string {
  return content.replace(MENTION_REGEX, (match, username) => {
    return `[@${username}](/users/${username})`;
  });
}

export { MENTION_REGEX };
