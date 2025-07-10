import fs from 'fs';
import path from 'path';

/**
 * Simple frontmatter parser (without external dependency)
 * @param {string} content - The markdown content
 * @returns {{content: string, data: object}} Parsed content and frontmatter
 */
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\s*\n(.*?)\n---\s*\n/s;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { content, data: {} };
  }
  
  const frontmatter = match[1];
  const markdownContent = content.replace(frontmatterRegex, '');
  
  // Simple YAML parsing for basic key-value pairs
  const data = {};
  frontmatter.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split(':');
    if (key && valueParts.length > 0) {
      data[key.trim()] = valueParts.join(':').trim().replace(/['"]/g, '');
    }
  });
  
  return { content: markdownContent, data };
}

/**
 * Simple markdown to HTML converter
 * @param {string} markdown - Raw markdown content
 * @returns {string} HTML string
 */
function markdownToHtml(markdown) {
  return markdown
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
    .replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/gim, '<em>$1</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" className="text-black/70 hover:text-black">$1</a>')
    .replace(/\n\n/gim, '</p><p>')
    .replace(/^(.+)$/gim, '<p>$1</p>')
    .replace(/<p><h/gim, '<h')
    .replace(/<\/h([1-6])><\/p>/gim, '</h$1>');
}

/**
 * Reads and processes markdown files from the legal directory
 * @param {string} filename - The markdown filename (without extension)
 * @returns {{content: string, frontmatter: object}} Raw HTML content and frontmatter
 */
export function getMarkdownContent(filename) {
  try {
    const filePath = path.join(process.cwd(), 'legal', `${filename}.md`);
    const fileContent = fs.readFileSync(filePath, 'utf8');
    
    // Parse frontmatter and content
    const { content, data: frontmatter } = parseFrontmatter(fileContent);
    
    // Convert markdown to HTML
    const htmlContent = markdownToHtml(content);
    
    return {
      content: htmlContent,
      frontmatter,
    };
  } catch (error) {
    console.error(`Error processing markdown file ${filename}:`, error);
    throw new Error(`Failed to process markdown file: ${filename}`);
  }
}

/**
 * Gets a list of all available legal documents
 * @returns {string[]} Array of legal document filenames (without extensions)
 */
export function getAvailableLegalDocs() {
  try {
    const legalDir = path.join(process.cwd(), 'legal');
    const files = fs.readdirSync(legalDir);
    return files
      .filter(file => file.endsWith('.md'))
      .map(file => file.replace('.md', ''));
  } catch (error) {
    console.error('Error reading legal directory:', error);
    return [];
  }
}

/**
 * Validates that a legal document exists
 * @param {string} filename - The filename to check
 * @returns {boolean} True if the file exists
 */
export function legalDocExists(filename) {
  const filePath = path.join(process.cwd(), 'legal', `${filename}.md`);
  return fs.existsSync(filePath);
}