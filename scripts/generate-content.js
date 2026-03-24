#!/usr/bin/env node

/**
 * Generate static content from Obsidian notes
 * This script runs at build time to convert markdown files to JSON
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

// Paths
const NOTE_REPO_PATH = '/Users/jerryx/obsidian/note';
const CONTENT_OUTPUT_PATH = path.join(__dirname, '../src/content');

// Knowledge base configuration
const KB_CATEGORIES = [
  {
    id: 'aicad',
    name: 'AICAD',
    description: 'CAD Agent 系统设计与实现',
    sourcePath: 'AICAD/Knowledge Base',
    icon: 'Cpu',
    color: 'text-blue-400',
    bgColor: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/20',
  },
  {
    id: 'cloud',
    name: 'Cloud Computing',
    description: '云计算与云原生技术',
    sourcePath: 'Cloud Computing/Knowledge Base',
    icon: 'Cloud',
    color: 'text-sky-400',
    bgColor: 'from-sky-500/20 to-blue-500/20',
    borderColor: 'border-sky-500/20',
  },
  {
    id: 'llm',
    name: 'LLM',
    description: '大语言模型技术',
    sourcePath: 'LLM/Knowledge Base',
    icon: 'Brain',
    color: 'text-purple-400',
    bgColor: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/20',
  },
  {
    id: 'searchrec',
    name: 'SearchRec',
    description: '搜索与推荐系统',
    sourcePath: 'SearchRec/Knowledge Base',
    icon: 'Search',
    color: 'text-emerald-400',
    bgColor: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/20',
  },
];

function slugify(str) {
  // Create URL-friendly slug from Chinese filename
  // Use original filename without extension, replacing spaces with dashes
  // Keep original case and Chinese characters
  return str
    .replace(/\.md$/, '')
    .trim()
    .replace(/\s+/g, '-');
}

function convertWikiLinks(content, categoryId) {
  return content.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, filename, display) => {
    const linkText = display || filename;
    const slug = slugify(filename);
    return `[${linkText}](/kb/${categoryId}/${slug})`;
  });
}

function convertImageLinks(content) {
  return content.replace(/!\[\[([^\]]+)\]\]/g, (match, imageName) => {
    return `![${imageName}](/images/${imageName})`;
  });
}

function findMarkdownFiles(dir) {
  const files = [];

  if (!fs.existsSync(dir)) {
    return files;
  }

  const items = fs.readdirSync(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...findMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

function processDocument(filePath, categoryId, categoryName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);

  const filename = path.basename(filePath, '.md');

  // Process content
  let processedContent = convertWikiLinks(body, categoryId);
  processedContent = convertImageLinks(processedContent);

  return {
    slug: slugify(filename),
    title: data.title || filename,
    description: data.description || '',
    date: data.date || null,
    tags: data.tags || [],
    category: categoryName,
    categoryId,
    content: processedContent,
    filePath: path.relative(path.join(NOTE_REPO_PATH, KB_CATEGORIES.find(c => c.id === categoryId)?.sourcePath || ''), filePath),
  };
}

function generateContent() {
  console.log('Generating content from Obsidian notes...');
  console.log(`Note repo path: ${NOTE_REPO_PATH}`);

  // Ensure output directory exists
  if (!fs.existsSync(CONTENT_OUTPUT_PATH)) {
    fs.mkdirSync(CONTENT_OUTPUT_PATH, { recursive: true });
  }

  const allDocuments = [];
  const categoryDocuments = {};

  for (const category of KB_CATEGORIES) {
    console.log(`\nProcessing ${category.name}...`);

    const sourcePath = path.join(NOTE_REPO_PATH, category.sourcePath);
    const files = findMarkdownFiles(sourcePath);

    console.log(`  Found ${files.length} markdown files`);

    const documents = files
      .map(file => processDocument(file, category.id, category.name))
      .sort((a, b) => {
        if (a.date && b.date) {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
        return a.title.localeCompare(b.title);
      });

    // Save category documents
    const categoryOutput = {
      category: {
        id: category.id,
        name: category.name,
        description: category.description,
        icon: category.icon,
        color: category.color,
        bgColor: category.bgColor,
        borderColor: category.borderColor,
      },
      documents: documents.map(doc => ({
        slug: doc.slug,
        title: doc.title,
        description: doc.description,
        date: doc.date,
        tags: doc.tags,
        category: doc.category,
        categoryId: doc.categoryId,
      })),
    };

    fs.writeFileSync(
      path.join(CONTENT_OUTPUT_PATH, `${category.id}.json`),
      JSON.stringify(categoryOutput, null, 2)
    );

    // Save individual documents
    const categoryDocsPath = path.join(CONTENT_OUTPUT_PATH, category.id);
    if (!fs.existsSync(categoryDocsPath)) {
      fs.mkdirSync(categoryDocsPath, { recursive: true });
    }

    for (const doc of documents) {
      fs.writeFileSync(
        path.join(categoryDocsPath, `${doc.slug}.json`),
        JSON.stringify(doc, null, 2)
      );
    }

    categoryDocuments[category.id] = documents;
    allDocuments.push(...documents);

    console.log(`  Generated ${documents.length} documents`);
  }

  // Generate index
  const index = {
    generatedAt: new Date().toISOString(),
    totalDocuments: allDocuments.length,
    categories: KB_CATEGORIES.map(cat => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      color: cat.color,
      bgColor: cat.bgColor,
      borderColor: cat.borderColor,
      documentCount: categoryDocuments[cat.id]?.length || 0,
    })),
    allDocuments: allDocuments.map(doc => ({
      slug: doc.slug,
      title: doc.title,
      description: doc.description,
      date: doc.date,
      tags: doc.tags,
      category: doc.category,
      categoryId: doc.categoryId,
    })),
  };

  fs.writeFileSync(
    path.join(CONTENT_OUTPUT_PATH, 'index.json'),
    JSON.stringify(index, null, 2)
  );

  // Generate static params for all documents
  // Filter out empty slugs and remove duplicates
  const seen = new Set();
  const staticParams = [];
  for (const doc of allDocuments) {
    if (!doc.slug || doc.slug === '') {
      console.warn(`  Warning: Empty slug for document "${doc.title}", skipping`);
      continue;
    }
    const key = `${doc.categoryId}/${doc.slug}`;
    if (!seen.has(key)) {
      seen.add(key);
      staticParams.push({
        category: doc.categoryId,
        slug: doc.slug,
      });
    }
  }

  fs.writeFileSync(
    path.join(CONTENT_OUTPUT_PATH, 'static-params.json'),
    JSON.stringify(staticParams, null, 2)
  );

  console.log(`\nContent generation complete!`);
  console.log(`  Total documents: ${allDocuments.length}`);
  console.log(`  Output directory: ${CONTENT_OUTPUT_PATH}`);
}

generateContent();
