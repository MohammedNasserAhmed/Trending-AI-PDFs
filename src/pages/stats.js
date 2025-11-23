/**
 * Stats Page
 * Analytics dashboard
 */

import { createAnalyticsDashboard } from '../features/analytics/components/AnalyticsDashboard.js';

export async function renderStatsPage() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  const container = document.createElement('div');
  container.className = 'container page-content';
  
  const dashboard = await createAnalyticsDashboard();
  container.appendChild(dashboard);
  
  app.appendChild(container);
}

export default renderStatsPage;
