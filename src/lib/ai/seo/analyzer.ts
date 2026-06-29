import { readabilityAnalyzer } from "./readability";
import { keywordExtractor, type KeywordResult } from "./keywords";

export type SEOResult = {
  score: number;
  titleScore: number;
  descriptionScore: number;
  keywordScore: number;
  readabilityScore: number;
  structureScore: number;
  keywordDensity: number;
  wordCount: number;
  headings: { h1: number; h2: number; h3: number; total: number };
  suggestions: string[];
  keywords: KeywordResult[];
  suggestedTags: string[];
  readingTime: number;
};

export class SEOAnalyzer {
  analyze(title: string, content: string, metaDescription?: string): SEOResult {
    const text = this.stripHtml(content);
    const wordCount = text.split(/\s+/).filter(Boolean).length;
    const readingTime = Math.max(1, Math.ceil(wordCount / 200));
    const headings = this.countHeadings(content);

    const readability = readabilityAnalyzer.analyze(text);
    const keywords = keywordExtractor.extract(text, 10);
    const keywordDensity = keywords.length > 0 ? keywords[0].density : 0;
    const suggestedTags = keywordExtractor.extractHashtags(text);

    const titleScore = this.scoreTitle(title, text);
    const descriptionScore = this.scoreDescription(metaDescription);
    const keywordScore = this.scoreKeywords(keywords, keywordDensity);
    const readabilityScore = readability.score;
    const structureScore = this.scoreStructure(headings, wordCount);

    const totalScore = Math.round(
      titleScore * 0.2 +
        descriptionScore * 0.15 +
        keywordScore * 0.25 +
        readabilityScore * 0.25 +
        structureScore * 0.15,
    );

    const suggestions: string[] = [];

    if (titleScore < 70)
      suggestions.push(
        "Improve the title: make it descriptive and include primary keywords.",
      );
    if (!metaDescription || metaDescription.length < 120)
      suggestions.push("Add a meta description between 120-160 characters.");
    if (metaDescription && metaDescription.length > 160)
      suggestions.push(
        "Meta description is too long. Keep it under 160 characters.",
      );
    if (wordCount < 300)
      suggestions.push(
        "Content is too short for good SEO. Aim for at least 300 words.",
      );
    if (headings.h1 === 0)
      suggestions.push("Add an H1 heading (usually the title).");
    if (headings.h2 < 2)
      suggestions.push("Use more H2 subheadings to structure your content.");
    if (keywordDensity > 5)
      suggestions.push(
        "Keyword density is too high. Consider reducing keyword repetition.",
      );
    if (keywordDensity < 0.5 && wordCount > 200)
      suggestions.push(
        "Very low keyword density. Include more relevant keywords.",
      );
    if (readabilityScore < 50)
      suggestions.push(
        "Content is difficult to read. Simplify sentences and use shorter words.",
      );
    if (!suggestions.length) suggestions.push("Great SEO optimization!");

    return {
      score: Math.min(100, Math.max(0, totalScore)),
      titleScore: Math.min(100, titleScore),
      descriptionScore: Math.min(100, descriptionScore),
      keywordScore: Math.min(100, keywordScore),
      readabilityScore: Math.min(100, readabilityScore),
      structureScore: Math.min(100, structureScore),
      keywordDensity: Math.round(keywordDensity * 100) / 100,
      wordCount,
      headings,
      suggestions,
      keywords,
      suggestedTags,
      readingTime,
    };
  }

  private stripHtml(html: string): string {
    return html
      .replace(/<[^>]*>/g, " ")
      .replace(/&[^;]+;/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }

  private countHeadings(html: string): {
    h1: number;
    h2: number;
    h3: number;
    total: number;
  } {
    const h1 = (html.match(/<h1[^>]*>/gi) ?? []).length;
    const h2 = (html.match(/<h2[^>]*>/gi) ?? []).length;
    const h3 = (html.match(/<h3[^>]*>/gi) ?? []).length;
    return { h1, h2, h3, total: h1 + h2 + h3 };
  }

  private scoreTitle(title: string, text: string): number {
    if (!title) return 0;
    let score = 50;

    if (title.length >= 30 && title.length <= 60) score += 20;
    else if (title.length > 60) score -= 10;
    else score -= 5;

    const titleWords = title.toLowerCase().split(/\s+/);
    const textLower = text.toLowerCase();
    const matched = titleWords.filter(
      (w) => w.length > 3 && textLower.includes(w),
    ).length;
    score +=
      (matched / Math.max(1, titleWords.filter((w) => w.length > 3).length)) *
      20;

    return Math.min(100, score);
  }

  private scoreDescription(description?: string): number {
    if (!description) return 0;
    let score = 50;

    if (description.length >= 120 && description.length <= 160) score += 30;
    else if (description.length < 120) score -= 10;
    else score -= 5;

    return Math.min(100, score);
  }

  private scoreKeywords(keywords: KeywordResult[], density: number): number {
    if (!keywords.length) return 0;
    let score = 50;

    if (density >= 1 && density <= 3) score += 25;
    else if (density > 5) score -= 20;
    else if (density < 0.5) score -= 10;

    if (keywords.length >= 5) score += 15;
    if (keywords.some((k) => k.word.includes(" "))) score += 10;

    return Math.min(100, score);
  }

  private scoreStructure(
    headings: { h1: number; h2: number; h3: number; total: number },
    wordCount: number,
  ): number {
    let score = 50;

    if (headings.h1 === 1) score += 15;
    if (headings.h2 >= 2) score += 15;
    if (headings.h3 >= 1) score += 10;

    if (wordCount > 300 && headings.total < 3) score -= 15;
    if (wordCount > 1000 && headings.total < 5) score -= 10;

    return Math.min(100, score);
  }
}

export const seoAnalyzer = new SEOAnalyzer();
