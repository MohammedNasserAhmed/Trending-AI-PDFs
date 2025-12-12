/**
 * Catalog Service
 * Fetch and manage PDF catalog data
 */

/**
 * Fetch catalog data
 */
export async function fetchCatalog() {
  try {
    // Fetch from the new In-Memory API
    const catalogUrl = '/api/catalog';
    const response = await fetch(catalogUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch catalog: ${response.status}`);
    }

    const data = await response.json();
    console.log('Catalog loaded successfully:', data.length, 'items');
    return data;
  } catch (error) {
    console.error('Failed to fetch catalog:', error);
    // Return empty array on error so app doesn't break
    return [];
  }
}

/**
 * Get unique sections from catalog
 */
export function getSections(catalogData) {
  const sections = new Set();
  
  catalogData.forEach(item => {
    if (item.section) {
      sections.add(item.section);
    }
  });
  
  return Array.from(sections).sort();
}

/**
 * Filter catalog by search and section
 */
export function filterCatalog(catalogData, searchQuery = '', selectedSection = '') {
  let filtered = [...catalogData];
  
  // Filter by search query
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filtered = filtered.filter(item => 
      (item.title || '').toLowerCase().includes(query) ||
      (item.section || '').toLowerCase().includes(query)
    );
  }
  
  // Filter by section
  if (selectedSection) {
    filtered = filtered.filter(item => item.section === selectedSection);
  }
  
  return filtered;
}

/**
 * Get latest PDFs (sorted by updated date)
 */
export function getLatestPDFs(catalogData, limit = 10) {
  return [...catalogData]
    .filter(item => item.updated)
    .sort((a, b) => new Date(b.updated) - new Date(a.updated))
    .slice(0, limit);
}

/**
 * Group PDFs by section
 */
export function groupBySection(catalogData) {
  const grouped = {};
  
  catalogData.forEach(item => {
    const section = item.section || 'Uncategorized';
    if (!grouped[section]) {
      grouped[section] = [];
    }
    grouped[section].push(item);
  });
  
  return grouped;
}

export default {
  fetchCatalog,
  getSections,
  filterCatalog,
  getLatestPDFs,
  groupBySection
};
