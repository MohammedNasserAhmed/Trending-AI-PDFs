import { fetchSheetData, convertToCatalog } from '../scripts/sync-from-sheets.js';
import dotenv from 'dotenv';

dotenv.config();

// In-memory cache
let catalogCache = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds

async function getCatalogData() {
  const now = Date.now();
  
  if (catalogCache && (now - lastFetchTime < CACHE_TTL)) {
    return catalogCache;
  }

  try {
    console.log('🔄 Fetching fresh catalog data from Sheets...');
    const rows = await fetchSheetData();
    const catalog = convertToCatalog(rows);
    
    catalogCache = catalog;
    lastFetchTime = now;
    console.log(`✅ Cache updated with ${catalog.length} items`);
    
    return catalog;
  } catch (error) {
    console.error('❌ Failed to update catalog cache:', error);
    if (catalogCache) {
      console.warn('⚠️ Serving stale cache due to fetch error');
      return catalogCache;
    }
    throw error;
  }
}

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const catalog = await getCatalogData();
    res.status(200).json(catalog);
  } catch (error) {
    console.error('Catalog API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch catalog data',
      message: error.message 
    });
  }
}
