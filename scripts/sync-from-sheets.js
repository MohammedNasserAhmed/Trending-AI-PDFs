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

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${API_KEY}`;

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

  // Direct mappings
  const mappings = {
    Foundational_ML_Deep_Learning: 'Data Science and Fundamentals',
    NLP_Transformers: 'Generative AI and LLMs',
    Computer_Vision: 'Generative AI and LLMs', // Most CV is now GenAI
    Reinforcement_Learning: 'AI Agents and Agentic Workflows',
    AI_Ethics: 'Enterprise and Business AI', // Often business reports
    Time_Series_Analytics: 'Data Science and Fundamentals',
    MLOps_Production_AI: 'AI Engineering and MLOps'
  };

  // Check for specific keywords to override mapping
  if (titleLower.includes('agent') || titleLower.includes('autogpt')) {
    return 'AI Agents and Agentic Workflows';
  }
  if (titleLower.includes('prompt') || titleLower.includes('prompting')) {
    return 'Prompt Engineering';
  }
  if (titleLower.includes('tool') || titleLower.includes('encyclopedia')) {
    return 'Tools and Productivity';
  }
  if (titleLower.includes('roadmap') || titleLower.includes('engineer')) {
    return 'AI Engineering and MLOps';
  }

  // Return mapped section or original if no map found
  return mappings[section] || section || 'Uncategorized';
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
    process.exit(1);
  }
}

// Run sync
syncCatalog();
