/**
 * Content loading utilities for Knowledge Base
 * Reads content from generated JSON files
 */

import contentIndex from '@/content/index.json';

// Re-export KB categories from index
export const KB_CATEGORIES = contentIndex.categories;

export interface KBDocument {
  slug: string;
  title: string;
  description: string;
  date: string | null;
  tags: string[];
  category: string;
  categoryId: string;
  content: string;
  filePath: string;
}

export interface KBIndex {
  slug: string;
  title: string;
  description: string;
  date: string | null;
  tags: string[] | any[];
  category: string;
  categoryId: string;
}

/**
 * Get all documents index (no content)
 */
export function getAllDocumentsIndex(): KBIndex[] {
  return contentIndex.allDocuments;
}

/**
 * Get featured/recent documents for homepage
 */
export function getFeaturedDocuments(count: number = 6): KBIndex[] {
  return contentIndex.allDocuments.slice(0, count);
}

/**
 * Search documents by query
 */
export function searchDocuments(query: string): KBIndex[] {
  const lowercaseQuery = query.toLowerCase();
  return contentIndex.allDocuments.filter((doc: any) =>
    doc.title?.toLowerCase().includes(lowercaseQuery) ||
    doc.description?.toLowerCase().includes(lowercaseQuery) ||
    (doc.tags || []).some((tag: string) => tag.toLowerCase().includes(lowercaseQuery))
  );
}

/**
 * Get category config by ID
 */
export function getCategoryById(categoryId: string) {
  return KB_CATEGORIES.find(c => c.id === categoryId);
}

/**
 * Get documents by category (async for dynamic import)
 */
export async function getDocumentsByCategory(categoryId: string): Promise<KBDocument[]> {
  try {
    const module = await import(`@/content/${categoryId}.json`);
    // Return empty content for list view
    return module.documents.map((doc: KBIndex) => ({
      ...doc,
      content: '',
      filePath: '',
    }));
  } catch {
    return [];
  }
}

/**
 * Get a single document by category and slug
 */
export async function getDocument(categoryId: string, slug: string): Promise<KBDocument | null> {
  try {
    const module = await import(`@/content/${categoryId}/${slug}.json`);
    return module as KBDocument;
  } catch {
    return null;
  }
}

/**
 * Convert Obsidian WikiLinks to regular markdown links
 */
export function convertWikiLinks(content: string, currentCategoryId: string): string {
  return content.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, filename, display) => {
    const linkText = display || filename;
    const slug = filename
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '');
    return `[${linkText}](/kb/${currentCategoryId}/${slug})`;
  });
}

/**
 * Convert Obsidian image links
 */
export function convertImageLinks(content: string): string {
  return content.replace(/!\[\[([^\]]+)\]\]/g, (match, imageName) => {
    return `![${imageName}](/images/${imageName})`;
  });
}
