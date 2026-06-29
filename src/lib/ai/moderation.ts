const BLOCKED_PATTERNS = [
  /ignore\s+(all\s+)?previous\s+instructions/i,
  /ignore\s+(all\s+)?above\s+(instructions|prompt)/i,
  /you\s+are\s+(now|not)\s+(an?\s+)?/i,
  /forget\s+(all\s+)?previous/i,
  /system\s+prompt/i,
  /reveal\s+(your|the)\s+(prompt|instructions)/i,
  /bypass|jailbreak|dansuh/i,
];

export function detectPromptInjection(text: string): boolean {
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.test(text)) return true;
  }
  return false;
}

export function sanitizePrompt(text: string): string {
  return text
    .replace(/<[^>]*>/g, "")
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g, "")
    .trim()
    .slice(0, 10000);
}
