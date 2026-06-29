export type KeywordResult = {
  word: string;
  count: number;
  density: number;
  score: number;
};

const STOP_WORDS = new Set([
  "the",
  "a",
  "an",
  "and",
  "or",
  "but",
  "in",
  "on",
  "at",
  "to",
  "for",
  "of",
  "by",
  "with",
  "from",
  "as",
  "is",
  "was",
  "are",
  "were",
  "be",
  "been",
  "being",
  "have",
  "has",
  "had",
  "do",
  "does",
  "did",
  "will",
  "would",
  "could",
  "should",
  "may",
  "might",
  "shall",
  "can",
  "need",
  "dare",
  "ought",
  "used",
  "this",
  "that",
  "these",
  "those",
  "it",
  "its",
  "he",
  "she",
  "they",
  "we",
  "you",
  "me",
  "him",
  "her",
  "us",
  "them",
  "my",
  "your",
  "his",
  "their",
  "our",
  "its",
  "not",
  "no",
  "nor",
  "so",
  "if",
  "then",
  "than",
  "too",
  "very",
  "just",
  "about",
  "up",
  "down",
  "out",
  "off",
  "over",
  "under",
  "again",
  "further",
  "once",
  "here",
  "there",
  "when",
  "where",
  "why",
  "how",
  "all",
  "each",
  "every",
  "both",
  "few",
  "more",
  "most",
  "other",
  "some",
  "such",
  "only",
  "own",
  "same",
  "into",
  "onto",
  "upon",
  "after",
  "before",
  "between",
  "through",
  "during",
  "without",
  "within",
  "along",
  "around",
  "among",
  "because",
  "since",
  "until",
  "while",
  "like",
  "also",
  "well",
  "back",
  "still",
  "even",
  "much",
  "yet",
  "already",
  "any",
  "many",
  "else",
  "ever",
  "every",
  "get",
  "got",
  "make",
  "made",
  "way",
  "thing",
  "things",
]);

export class KeywordExtractor {
  extract(text: string, topN = 10): KeywordResult[] {
    const words: string[] =
      text.toLowerCase().match(/[a-zA-Z]+(?:['-][a-zA-Z]+)*/g) ?? [];
    const totalWords = words.length;

    const freq = new Map<string, number>();
    const bigrams = new Map<string, number>();

    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      if (!STOP_WORDS.has(word) && word.length > 2) {
        freq.set(word, (freq.get(word) ?? 0) + 1);
      }

      if (i < words.length - 1) {
        const bigram = `${words[i]} ${words[i + 1]}`;
        if (!STOP_WORDS.has(words[i]) && !STOP_WORDS.has(words[i + 1])) {
          bigrams.set(bigram, (bigrams.get(bigram) ?? 0) + 1);
        }
      }
    }

    const results: KeywordResult[] = [];

    for (const [word, count] of freq) {
      if (count < 2) continue;
      const density = totalWords > 0 ? count / totalWords : 0;
      const positionBonus = words.indexOf(word) < totalWords * 0.2 ? 1.2 : 1;
      const lengthBonus = word.length > 6 ? 1.1 : word.length > 4 ? 1 : 0.9;
      const score = Math.round(
        count * density * 1000 * positionBonus * lengthBonus,
      );

      results.push({
        word,
        count,
        density: Math.round(density * 10000) / 100,
        score,
      });
    }

    for (const [bigram, count] of bigrams) {
      if (count < 2) continue;
      const density = totalWords > 0 ? (count * 2) / totalWords : 0;
      const score = Math.round(count * density * 1000);
      results.push({
        word: bigram,
        count,
        density: Math.round(density * 10000) / 100,
        score,
      });
    }

    return results
      .sort((a, b) => b.score - a.score)
      .slice(0, topN)
      .map((r) => ({ ...r, score: Math.min(r.score, 100) }));
  }

  extractHashtags(text: string, maxTags = 8): string[] {
    const keywords = this.extract(text, maxTags);
    return keywords
      .filter((k) => k.word.split(" ").length <= 2)
      .slice(0, maxTags)
      .map((k) => k.word.replace(/\s+/g, "").toLowerCase());
  }
}

export const keywordExtractor = new KeywordExtractor();
