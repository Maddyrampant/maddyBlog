export type ReadabilityScore = {
  score: number;
  fleschKincaid: number;
  avgSentenceLength: number;
  avgWordLength: number;
  complexWordRatio: number;
  suggestions: string[];
};

function countSyllables(word: string): number {
  word = word.toLowerCase().replace(/[^a-z]/g, "");
  if (word.length <= 3) return 1;

  let count = 0;
  const vowels = "aeiouy";
  let prevVowel = false;

  for (const ch of word) {
    const isVowel = vowels.includes(ch);
    if (isVowel && !prevVowel) count++;
    prevVowel = isVowel;
  }

  if (word.endsWith("e")) count--;
  if (
    word.endsWith("le") &&
    word.length > 2 &&
    !"aeiouy".includes(word[word.length - 3])
  )
    count++;
  if (count === 0) count = 1;

  return count;
}

function isComplexWord(word: string): boolean {
  return countSyllables(word) >= 3;
}

function countSentences(text: string): number {
  const matches = text.match(/[.!?]+/g);
  return matches ? matches.length : 1;
}

function countWords(text: string): string[] {
  return text.match(/[a-zA-Z]+(?:['-][a-zA-Z]+)*/g) ?? [];
}

export class ReadabilityAnalyzer {
  analyze(text: string): ReadabilityScore {
    const words = countWords(text);
    const sentenceCount = countSentences(text);
    const wordCount = words.length;

    if (wordCount === 0) {
      return {
        score: 0,
        fleschKincaid: 0,
        avgSentenceLength: 0,
        avgWordLength: 0,
        complexWordRatio: 0,
        suggestions: ["No content to analyze"],
      };
    }

    const totalSyllables = words.reduce((sum, w) => sum + countSyllables(w), 0);
    const complexWords = words.filter(isComplexWord).length;
    const avgSentenceLength = wordCount / sentenceCount;
    const avgWordLength =
      words.reduce((sum, w) => sum + w.length, 0) / wordCount;
    const complexWordRatio = complexWords / wordCount;

    const fleschKincaid =
      206.835 - 1.015 * avgSentenceLength - 84.6 * (totalSyllables / wordCount);
    const normalized = Math.max(0, Math.min(100, (fleschKincaid + 20) * 1.2));
    const score = Math.round(normalized);

    const suggestions: string[] = [];

    if (avgSentenceLength > 25) {
      suggestions.push(
        "Sentences are too long. Try breaking them into shorter sentences.",
      );
    }
    if (complexWordRatio > 0.15) {
      suggestions.push(
        "Too many complex words. Consider simpler alternatives.",
      );
    }
    if (fleschKincaid < 50) {
      suggestions.push(
        "Text is difficult to read. Aim for shorter sentences and simpler words.",
      );
    }
    if (avgWordLength > 5.5) {
      suggestions.push(
        "Average word length is high. Use shorter words where possible.",
      );
    }
    if (wordCount < 50) {
      suggestions.push(
        "Content is very short. Consider expanding your article.",
      );
    }
    if (!suggestions.length) {
      suggestions.push("Readability looks good!");
    }

    return {
      score,
      fleschKincaid: Math.round(fleschKincaid * 10) / 10,
      avgSentenceLength: Math.round(avgSentenceLength * 10) / 10,
      avgWordLength: Math.round(avgWordLength * 10) / 10,
      complexWordRatio: Math.round(complexWordRatio * 100) / 100,
      suggestions,
    };
  }
}

export const readabilityAnalyzer = new ReadabilityAnalyzer();
