/**
 * Lightweight State Management
 * Simple observable pattern for managing application state
 */

class Store {
  constructor(initialState = {}) {
    this.state = initialState;
    this.listeners = new Set();
  }

  /**
   * Get current state
   */
  getState() {
    return { ...this.state };
  }

  /**
   * Update state
   */
  setState(updates) {
    this.state = { ...this.state, ...updates };
    this.notify();
  }

  /**
   * Subscribe to state changes
   */
  subscribe(listener) {
    this.listeners.add(listener);
    
    // Return unsubscribe function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all listeners of state changes
   */
  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

// Global application store
const appStore = new Store({
  // UI State
  isLoading: false,
  currentPage: 'home',
  
  // Catalog State
  searchQuery: '',
  selectedSection: '',
  catalogData: [],
  filteredCatalog: [],
  
  // Analytics State
  analyticsData: null,
  visitorStats: null,
  popularPDFs: null,
  trafficSources: null,
  
  // GitHub State
  githubStats: null,
  
  // Tracking State
  sessionStartTime: Date.now(),
  pageViews: 0
});

// Helper functions for common operations
export const getState = () => appStore.getState();

export const setState = (updates) => appStore.setState(updates);

export const subscribe = (listener) => appStore.subscribe(listener);

// Specific state updaters
export const setLoading = (isLoading) => setState({ isLoading });

export const setCurrentPage = (page) => {
  setState({ currentPage: page });
};

export const setSearchQuery = (query) => {
  setState({ searchQuery: query });
  filterCatalog();
};

export const setSelectedSection = (section) => {
  setState({ selectedSection: section });
  filterCatalog();
};

export const setCatalogData = (data) => {
  setState({ catalogData: data });
  filterCatalog();
};

export const setAnalyticsData = (data) => {
  setState({ analyticsData: data });
};

export const setGitHubStats = (stats) => {
  setState({ githubStats: stats });
};

// Catalog filtering logic
function filterCatalog() {
  const state = getState();
  const { catalogData, searchQuery, selectedSection } = state;
  
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
  
  setState({ filteredCatalog: filtered });
}

// Persist state to localStorage (optional)
export function persistState() {
  const state = getState();
  localStorage.setItem('app-state', JSON.stringify({
    searchQuery: state.searchQuery,
    selectedSection: state.selectedSection,
    currentPage: state.currentPage
  }));
}

// Restore state from localStorage (optional)
export function restoreState() {
  try {
    const saved = localStorage.getItem('app-state');
    if (saved) {
      const parsed = JSON.parse(saved);
      setState(parsed);
    }
  } catch (error) {
    console.error('Failed to restore state:', error);
  }
}

export default appStore;
