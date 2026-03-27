#!/usr/bin/env node

/**
 * Sync Obsidian notes to website content
 *
 * This script:
 * 1. Reads markdown files from the note repository
 * 2. Extracts frontmatter (title, date, tags, etc.)
 * 3. Converts Obsidian WikiLinks [[filename]] to relative links
 * 4. Copies files to website/content/ directory
 * 5. Generates content-index.json for the website
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const NOTE_REPO_PATH = path.join(__dirname, '../note-repo');
const CONTENT_OUTPUT_PATH = path.join(__dirname, '../content');

// Knowledge base mapping
const KB_MAPPING = [
  { source: 'Quant/Knowledge Base', target: 'kb/quant', category: 'Quant' },
  { source: 'Quant/Research', target: 'research/quant', category: 'Quant Research' },
  { source: 'Cloud Computing/Knowledge Base', target: 'kb/cloud', category: 'Cloud Computing' },
  { source: 'LLM/Knowledge Base', target: 'kb/llm', category: 'LLM' },
  { source: 'SearchRec/Knowledge Base', target: 'kb/searchrec', category: 'SearchRec' },
  { source: 'News', target: 'news', category: 'News' },
];

function slugify(str) {
  return str
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function convertWikiLinks(content, fileDir) {
  // Convert [[filename]] to [filename](/kb/category/filename)
  // Convert [[filename|display]] to [display](/kb/category/filename)
  return content.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (match, filename, display) => {
    const linkText = display || filename;
    const slug = slugify(filename);
    // For now, use a generic link - in practice, you'd need to track which KB each file belongs to
    return `[${linkText}](/kb/${slug})`;
  });
}

function convertImageLinks(content, fileDir) {
  // Convert ![[image.png]] to ![image](/images/image.png)
  return content.replace(/!\[\[([^\]]+)\]\]/g, (match, imageName) => {
    return `![${imageName}](/images/${slugify(imageName)})`;
  });
}

function processMarkdownFile(filePath, category) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data, content: body } = matter(content);

  // Convert Obsidian-specific syntax
  let processedContent = convertWikiLinks(body, path.dirname(filePath));
  processedContent = convertImageLinks(processedContent, path.dirname(filePath));

  // Extract title from filename or frontmatter
  const filename = path.basename(filePath, '.md');
  const title = data.title || filename;

  return {
    title,
    description: data.description || '',
    date: data.date || null,
    tags: data.tags || [],
    category,
    content: processedContent,
    slug: slugify(filename),
    originalPath: filePath,
  };
}

function syncKnowledgeBase(mapping) {
  const sourcePath = path.join(NOTE_REPO_PATH, mapping.source);
  const targetPath = path.join(CONTENT_OUTPUT_PATH, mapping.target);

  if (!fs.existsSync(sourcePath)) {
    console.log(`Source path not found: ${sourcePath}`);
    return [];
  }

  // Ensure target directory exists
  if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath, { recursive: true });
  }

  const files = fs.readdirSync(sourcePath, { recursive: true });
  const processed = [];

  for (const file of files) {
    if (typeof file === 'string' && file.endsWith('.md')) {
      const filePath = path.join(sourcePath, file);
      const stat = fs.statSync(filePath);

      if (stat.isFile()) {
        try {
          const processedFile = processMarkdownFile(filePath, mapping.category);
          const outputFileName = `${processedFile.slug}.md`;
          const outputPath = path.join(targetPath, outputFileName);

          // Write processed markdown
          const outputContent = matter.stringify(processedFile.content, {
            title: processedFile.title,
            description: processedFile.description,
            date: processedFile.date,
            tags: processedFile.tags,
            category: processedFile.category,
          });

          fs.writeFileSync(outputPath, outputContent);

          processed.push({
            ...processedFile,
            path: `${mapping.target}/${outputFileName}`,
          });

          console.log(`Synced: ${filePath} -> ${outputPath}`);
        } catch (error) {
          console.error(`Error processing ${filePath}:`, error);
        }
      }
    }
  }

  return processed;
}

function generateContentIndex(allContent) {
  const index = {
    generatedAt: new Date().toISOString(),
    totalFiles: allContent.length,
    categories: {},
    files: allContent.map(file => ({
      title: file.title,
      description: file.description,
      date: file.date,
      tags: file.tags,
      category: file.category,
      slug: file.slug,
      path: file.path,
    })),
  };

  // Group by category
  for (const file of allContent) {
    if (!index.categories[file.category]) {
      index.categories[file.category] = [];
    }
    index.categories[file.category].push(file.slug);
  }

  const indexPath = path.join(CONTENT_OUTPUT_PATH, 'content-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  console.log(`Generated content index: ${indexPath}`);
}

function main() {
  console.log('Starting note sync...');
  console.log(`Note repo path: ${NOTE_REPO_PATH}`);
  console.log(`Content output path: ${CONTENT_OUTPUT_PATH}`);

  // Ensure content directory exists
  if (!fs.existsSync(CONTENT_OUTPUT_PATH)) {
    fs.mkdirSync(CONTENT_OUTPUT_PATH, { recursive: true });
  }

  const allContent = [];

  // Sync each knowledge base
  for (const mapping of KB_MAPPING) {
    console.log(`\nSyncing ${mapping.source}...`);
    const content = syncKnowledgeBase(mapping);
    allContent.push(...content);
  }

  // Generate content index
  generateContentIndex(allContent);

  console.log(`\nSync complete! Processed ${allContent.length} files.`);
}

main();
