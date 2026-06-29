export type PromptTemplate = {
  name: string;
  system: string;
  userPrompt: string;
  temperature: number;
  maxTokens: number;
};

const templates: Record<string, PromptTemplate> = {
  generate_title: {
    name: "generate_title",
    system:
      "You are an expert blog title generator. Generate catchy, SEO-optimized titles based on the article content. Return ONLY the title, no quotes or extra text.",
    userPrompt:
      "Based on the following blog post content, generate a compelling and SEO-friendly title:\n\n{content}",
    temperature: 0.8,
    maxTokens: 100,
  },
  generate_summary: {
    name: "generate_summary",
    system:
      "You are an expert at writing concise blog post summaries. Generate a 2-3 sentence summary that captures the key points.",
    userPrompt:
      "Write a brief summary (2-3 sentences) for the following blog content:\n\n{content}",
    temperature: 0.5,
    maxTokens: 200,
  },
  expand_paragraph: {
    name: "expand_paragraph",
    system:
      "You are an expert writing assistant. Expand the given paragraph with more detail, examples, and depth while maintaining the same tone and style.",
    userPrompt:
      "Expand and enrich the following paragraph, keeping the same voice and tone:\n\n{content}",
    temperature: 0.7,
    maxTokens: 1024,
  },
  rewrite_text: {
    name: "rewrite_text",
    system:
      "You are an expert editor. Rewrite the given text to be clearer, more engaging, and better structured while preserving the original meaning.",
    userPrompt:
      "Rewrite the following text to improve clarity and engagement:\n\n{content}",
    temperature: 0.6,
    maxTokens: 1024,
  },
  improve_readability: {
    name: "improve_readability",
    system:
      "You are a readability expert. Improve the following text by simplifying sentences, improving flow, and making it easier to read. Maintain the original meaning and tone.",
    userPrompt: "Improve the readability of this text:\n\n{content}",
    temperature: 0.4,
    maxTokens: 1024,
  },
  seo_keywords: {
    name: "seo_keywords",
    system:
      "You are an SEO specialist. Extract the most relevant keywords and key phrases from the content. Return a comma-separated list of 5-10 keywords ranked by importance.",
    userPrompt:
      "Extract SEO keywords from the following content. Return only a comma-separated list:\n\n{content}",
    temperature: 0.3,
    maxTokens: 150,
  },
  generate_tags: {
    name: "generate_tags",
    system:
      "You are a content categorization expert. Generate 3-8 relevant tags for the given content. Return only comma-separated tags, no numbering or extra text.",
    userPrompt: "Generate relevant tags for this content:\n\n{content}",
    temperature: 0.5,
    maxTokens: 100,
  },
  seo_description: {
    name: "seo_description",
    system:
      "You are an SEO meta description writer. Write a compelling meta description between 120-160 characters that includes key keywords and encourages clicks.",
    userPrompt:
      "Write an SEO-optimized meta description (120-160 characters) for:\n\n{content}",
    temperature: 0.5,
    maxTokens: 100,
  },
};

export class PromptTemplates {
  static get(name: string): PromptTemplate | undefined {
    return templates[name];
  }

  static getAll(): PromptTemplate[] {
    return Object.values(templates);
  }

  static render(
    name: string,
    vars: Record<string, string>,
  ): { system: string; userPrompt: string } | null {
    const tpl = templates[name];
    if (!tpl) return null;

    let userPrompt = tpl.userPrompt;
    for (const [key, val] of Object.entries(vars)) {
      userPrompt = userPrompt.replace(new RegExp(`\\{${key}\\}`, "g"), val);
    }

    return { system: tpl.system, userPrompt };
  }

  static registerCustom(name: string, tpl: PromptTemplate): void {
    templates[name] = tpl;
  }
}
