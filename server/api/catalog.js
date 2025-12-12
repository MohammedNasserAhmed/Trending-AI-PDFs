/**
 * Catalog API Route
 * Serves catalog data from in-memory cache, refreshed from Google Sheets
 */

import express from 'express';
import { fetchSheetData, convertToCatalog } from '../../scripts/sync-from-sheets.js';

const router = express.Router();

// In-memory cache
let catalogCache = null;
let lastFetchTime = 0;
const CACHE_TTL = 60 * 1000; // 60 seconds

/**
 * Fetch catalog data from cache or source
 */
async function getCatalogData() {
  const now = Date.now();
  
  // Return cached data if valid
  if (catalogCache && (now - lastFetchTime < CACHE_TTL)) {
    return catalogCache;
  }

  try {
    console.log('🔄 Fetching fresh catalog data from Sheets...');
    const rows = await fetchSheetData();
    const catalog = convertToCatalog(rows);
    
    // Update cache
    catalogCache = catalog;
    lastFetchTime = now;
    console.log(`✅ Cache updated with ${catalog.length} items`);
    
    return catalog;
  } catch (error) {
    console.error('❌ Failed to update catalog cache:', error);
    // Return stale cache if available, otherwise throw
    if (catalogCache) {
      console.warn('⚠️ Serving stale cache due to fetch error');
      return catalogCache;
    }
    throw error;
  }
}

/**
 * GET /api/catalog
 */
router.get('/', async (req, res) => {
  try {
    const catalog = await getCatalogData();
    res.json(catalog);
  } catch (error) {
    console.error('Catalog API Error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch catalog data',
      message: error.message 
    });
  }
});

// Force refresh endpoint (optional, protected or internal use)
router.post('/refresh', async (req, res) => {
  try {
    catalogCache = null; // Clear cache
    const catalog = await getCatalogData();
    res.json({ success: true, count: catalog.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
