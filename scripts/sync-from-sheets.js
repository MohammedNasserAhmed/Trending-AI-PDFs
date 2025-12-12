/**
 * Sync Catalog from Google Sheets
 *
 * This script fetches PDF catalog data from a Google Sheet
 * and updates the docs/catalog.json file automatically.
 *
 * Usage:
 *   node scripts/sync-from-sheets.js
 *
 * Environment Variables:
 *   GOOGLE_SHEETS_ID - The ID of your Google Sheet
 *   GOOGLE_API_KEY - Your Google API key
 */

import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const API_KEY = process.env.GOOGLE_API_KEY;
const SHEET_NAME = 'TrendingPdfsSHT'; // Name of the sheet tab
const OUTPUT_FILE = path.join(__dirname, '../docs/catalog.json');

/**
 * Fetch data from Google Sheets
 */
async function fetchSheetData() {
  if (!SHEET_ID || !API_KEY) {
    throw new Error('Missing required environment variables: GOOGLE_SHEETS_ID or GOOGLE_API_KEY');
  }

  // Add cache buster to prevent stale data
  const cacheBuster = new Date().getTime();
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}&t=${cacheBuster}`;

  console.log('📥 Fetching data from Google Sheets...');

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
  }

  const data = await response.json();
  return data.values;
}

/**
 * Map old sections to new modern sections
 */
function mapSectionName(oldSection, title = '') {
  const section = (oldSection || '').trim();
  const titleLower = (title || '').toLowerCase();

  // 1. Prompt Engineering (Specific)
  if (titleLower.includes('prompt') || titleLower.includes('jailbreak')) {
    return 'Prompt Engineering';
  }

  // 2. AI Agents (Specific)
  if (titleLower.includes('agent') || titleLower.includes('autogpt') || titleLower.includes('babyagi') || titleLower.includes('multi-agent')) {
    return 'AI Agents and Agentic Workflows';
  }

  // 3. Tools (Specific)
  if (titleLower.includes('tool') || titleLower.includes('productivity') || titleLower.includes('vs code') || titleLower.includes('cursor') || titleLower.includes('excel') || titleLower.includes('ide')) {
    return 'Tools and Productivity';
  }

  // 4. Engineering & MLOps (Specific)
  if (titleLower.includes('mlops') || titleLower.includes('engineering') || titleLower.includes('production') || titleLower.includes('deployment') || titleLower.includes('architecture') || titleLower.includes('system') || titleLower.includes('devops')) {
    return 'AI Engineering and MLOps';
  }

  // 5. Enterprise & Business (Contextual)
  if (titleLower.includes('business') || titleLower.includes('enterprise') || titleLower.includes('finance') || titleLower.includes('market') || titleLower.includes('report') || titleLower.includes('state of') || titleLower.includes('economics') || titleLower.includes('strategy') || titleLower.includes('adoption')) {
    return 'Enterprise and Business AI';
  }

  // 6. Data Science (Broad)
  if (titleLower.includes('data science') || titleLower.includes('fundamentals') || titleLower.includes('statistics') || titleLower.includes('math') || titleLower.includes('probability') || titleLower.includes('linear algebra') || titleLower.includes('python') || titleLower.includes('pandas') || titleLower.includes('numpy') || titleLower.includes('scikit') || titleLower.includes('machine learning') || titleLower.includes('deep learning')) {
    return 'Data Science and Fundamentals';
  }

  // 7. Generative AI (Catch-all for modern AI)
  if (titleLower.includes('llm') || titleLower.includes('generative') || titleLower.includes('transformer') || titleLower.includes('gpt') || titleLower.includes('diffusion') || titleLower.includes('language model') || titleLower.includes('rag') || titleLower.includes('retrieval') || titleLower.includes('text-to-image')) {
    return 'Generative AI and LLMs';
  }

  // Direct mappings for old section names if no keywords matched
  const mappings = {
    'Foundational_ML_Deep_Learning': 'Data Science and Fundamentals',
    'NLP_Transformers': 'Generative AI and LLMs',
    'Computer_Vision': 'Generative AI and LLMs',
    'Reinforcement_Learning': 'AI Agents and Agentic Workflows',
    'AI_Ethics': 'Enterprise and Business AI',
    'Time_Series_Analytics': 'Data Science and Fundamentals',
    'MLOps_Production_AI': 'AI Engineering and MLOps'
  };

  return mappings[section] || section || 'Generative AI and LLMs';
}

/**
 * Convert sheet rows to catalog objects
 */
function convertToCatalog(rows) {
  if (!rows || rows.length < 2) {
    throw new Error('Sheet is empty or missing header row');
  }

  const [headers, ...dataRows] = rows;

  // Normalize headers (lowercase, trim)
  const normalizedHeaders = headers.map((h) => h.toLowerCase().trim());

  const catalog = dataRows
    .filter((row) => row.length > 0 && row[0]) // Skip empty rows
    .map((row) => {
      const entry = {};

      normalizedHeaders.forEach((header, index) => {
        const value = row[index] || '';

        // Map sheet columns to catalog properties
        switch (header) {
          case 'title':
            entry.title = value;
            break;
          case 'summary':
          case 'description':
          case 'summary/description':
            entry.summary = value;
            break;
          case 'section':
            entry.section = mapSectionName(value, row[headers.indexOf('title')]);
            break;
          case 'link':
          case 'url':
          case 'pdf link':
            entry.link = value;
            break;
          case 'image':
          case 'preview':
          case 'image url':
            entry.image = value;
            break;
          case 'updated':
          case 'date':
          case 'last updated':
            entry.updated = value || new Date().toISOString();
            break;
          case 'authors':
          case 'author':
            entry.authors = value;
            break;
          case 'year':
            entry.year = value;
            break;
          case 'tags':
            entry.tags = value ? value.split(',').map((t) => t.trim()) : [];
            break;
        }
      });

      return entry;
    });

  return catalog;
}

/**
 * Validate catalog entries
 */
function validateCatalog(catalog) {
  const errors = [];

  catalog.forEach((entry, index) => {
    if (!entry.title) {
      errors.push(`Row ${index + 2}: Missing title`);
    }
    if (!entry.link) {
      errors.push(`Row ${index + 2}: Missing link`);
    }
  });

  if (errors.length > 0) {
    console.warn('⚠️  Validation warnings:');
    errors.forEach((err) => console.warn(`   ${err}`));
  }

  return errors.length === 0;
}

/**
 * Main sync function
 */
async function syncCatalog() {
  try {
    console.log('🚀 Starting Google Sheets sync...\n');

    // Fetch sheet data
    const rows = await fetchSheetData();
    console.log(`✅ Fetched ${rows.length - 1} rows from sheet\n`);

    // Convert to catalog format
    const catalog = convertToCatalog(rows);
    console.log(`📝 Processed ${catalog.length} catalog entries\n`);

    // Validate
    const valid = validateCatalog(catalog);
    if (!valid) {
      console.log('\n⚠️  Proceeding with warnings...\n');
    }

    // Write to docs/catalog.json (Original location)
    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(catalog, null, 2), 'utf-8');
    console.log(`✅ Updated ${OUTPUT_FILE}`);

    // Write to public/catalog.json (Frontend location)
    const publicOutputFile = path.join(__dirname, '../public/catalog.json');
    fs.writeFileSync(publicOutputFile, JSON.stringify(catalog, null, 2), 'utf-8');
    console.log(`✅ Updated ${publicOutputFile}`);

    console.log(`📊 Total PDFs: ${catalog.length}\n`);

    // Summary by section
    const sections = {};
    catalog.forEach((entry) => {
      const section = entry.section || 'Uncategorized';
      sections[section] = (sections[section] || 0) + 1;
    });

    console.log('📚 PDFs by section:');
    Object.entries(sections)
      .sort((a, b) => b[1] - a[1])
      .forEach(([section, count]) => {
        console.log(`   ${section}: ${count}`);
      });

    console.log('\n✨ Sync complete!');
  } catch (error) {
    console.error('❌ Sync failed:', error.message);
    // Do not exit process when running as a module
    // process.exit(1);
  }
}

// Export for use in server
export { syncCatalog };

// Run sync if executed directly
if (process.argv[1] === __filename) {
  syncCatalog();
}
