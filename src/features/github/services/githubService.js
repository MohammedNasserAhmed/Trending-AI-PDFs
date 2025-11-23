/**
 * GitHub Service
 * Fetch GitHub repository statistics
 */

import apiClient from '../../../shared/api/client.js';

/**
 * Get GitHub repository stats
 */
export async function getRepoStats() {
  try {
    const response = await apiClient.get('/api/github/repo-stats');
    return response.stats;
  } catch (error) {
    console.error('Failed to fetch GitHub stats:', error);
    return null;
  }
}

/**
 * Auto-refresh GitHub stats
 */
export function autoRefreshGitHubStats(callback, intervalMinutes = 5) {
  // Initial fetch
  getRepoStats().then(callback);
  
  // Set up interval
  const intervalId = setInterval(async () => {
    const stats = await getRepoStats();
    callback(stats);
  }, intervalMinutes * 60 * 1000);
  
  // Return cleanup function
  return () => clearInterval(intervalId);
}

export default {
  getRepoStats,
  autoRefreshGitHubStats
};
