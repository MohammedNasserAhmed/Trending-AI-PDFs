/**
 * Analytics Dashboard Component
 * Main dashboard showing all analytics visualizations
 */

import { getAllAnalytics } from '../services/analyticsService.js';
import { getTrackingStats } from '../../tracking/services/trackingService.js';
import './AnalyticsDashboard.css';

export async function createAnalyticsDashboard() {
  const dashboard = document.createElement('div');
  dashboard.className = 'analytics-dashboard';
  
  // Show loading state
  dashboard.innerHTML = `
    <div class="dashboard-loading">
      <div class="spinner"></div>
      <p>Loading analytics...</p>
    </div>
  `;
  
  try {
    // Fetch all analytics data
    const [analytics, trackingStats] = await Promise.all([
      getAllAnalytics(),
      getTrackingStats()
    ]);
    
    // Build dashboard
    dashboard.innerHTML = `
      <div class="dashboard-header">
        <h1>📊 Analytics Dashboard</h1>
        <p>Real-time insights into your PDF repository</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-content">
            <div class="stat-value">${trackingStats?.uniqueVisitors30Days || 0}</div>
            <div class="stat-label">Unique Visitors (30 days)</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">📄</div>
          <div class="stat-content">
            <div class="stat-value">${trackingStats?.totalPageviews || 0}</div>
            <div class="stat-label">Total Pageviews</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">⬇️</div>
          <div class="stat-content">
            <div class="stat-value">${trackingStats?.totalDownloads || 0}</div>
            <div class="stat-label">PDF Downloads</div>
          </div>
        </div>
        
        <div class="stat-card">
          <div class="stat-icon">🔗</div>
          <div class="stat-content">
            <div class="stat-value">${trackingStats?.totalClicks || 0}</div>
            <div class="stat-label">Link Clicks</div>
          </div>
        </div>
      </div>
      
      <div class="charts-grid">
        <div class="chart-card">
          <h3>📈 Visitor Trends</h3>
          <canvas id="visitors-chart" width="400" height="200"></canvas>
        </div>
        
        <div class="chart-card">
          <h3>⭐ Top PDFs</h3>
          <div id="popular-pdfs-list"></div>
        </div>
        
        <div class="chart-card">
          <h3>🌍 Traffic Sources</h3>
          <canvas id="traffic-chart" width="400" height="200"></canvas>
        </div>
        
        <div class="chart-card">
          <h3>📚 Section Popularity</h3>
          <canvas id="sections-chart" width="400" height="200"></canvas>
        </div>
      </div>
    `;
    
    // Render charts
    if (analytics) {
      renderVisitorsChart(dashboard, analytics.visitors);
      renderPopularPDFsList(dashboard, analytics.popularPDFs);
      renderTrafficChart(dashboard, analytics.trafficSources);
      renderSectionsChart(dashboard, analytics.sectionPopularity);
    }
    
  } catch (error) {
    console.error('Failed to load analytics:', error);
    dashboard.innerHTML = `
      <div class="dashboard-error">
        <span class="error-icon">⚠️</span>
        <h3>Failed to load analytics</h3>
        <p>${error.message}</p>
      </div>
    `;
  }
  
  return dashboard;
}

function renderVisitorsChart(container, data) {
  const canvas = container.querySelector('#visitors-chart');
  if (!canvas || !data || data.length === 0) return;
  
  const ctx = canvas.getContext('2d');
  
  // Simple line chart rendering
  const labels = data.map(d => d.date);
  const values = data.map(d => d.uniqueVisitors);
  
  drawLineChart(ctx, canvas.width, canvas.height, labels, values, '#ff6b35');
}

function renderPopularPDFsList(container, data) {
  const list = container.querySelector('#popular-pdfs-list');
  if (!list || !data || data.length === 0) {
    list.innerHTML = '<p class="no-data">No download data available</p>';
    return;
  }
  
  list.innerHTML = data.slice(0, 5).map((pdf, index) => `
    <div class="pdf-item">
      <span class="pdf-rank">#${index + 1}</span>
      <div class="pdf-info">
        <div class="pdf-title">${pdf.title || 'Untitled'}</div>
        <div class="pdf-stats">${pdf.downloadCount} downloads</div>
      </div>
    </div>
  `).join('');
}

function renderTrafficChart(container, data) {
  const canvas = container.querySelector('#traffic-chart');
  if (!canvas || !data || data.length === 0) return;
  
  const ctx = canvas.getContext('2d');
  const labels = data.map(d => d.source);
  const values = data.map(d => d.visitCount);
  
  drawBarChart(ctx, canvas.width, canvas.height, labels, values, '#4ecdc4');
}

function renderSectionsChart(container, data) {
  const canvas = container.querySelector('#sections-chart');
  if (!canvas || !data || data.length === 0) return;
  
  const ctx = canvas.getContext('2d');
  const labels = data.map(d => d.section.replace(/_/g, ' '));
  const values = data.map(d => d.downloadCount);
  
  drawBarChart(ctx, canvas.width, canvas.height, labels, values, '#a855f7');
}

// Simple chart drawing functions
function drawLineChart(ctx, width, height, labels, values, color) {
  ctx.clearRect(0, 0, width, height);
  
  const padding = 40;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;
  
  const maxValue = Math.max(...values, 1);
  const step = chartWidth / (labels.length - 1 || 1);
  
  // Draw axes
  ctx.strokeStyle = '#2a2a2e';
  ctx.beginPath();
  ctx.moveTo(padding, padding);
  ctx.lineTo(padding, height - padding);
  ctx.lineTo(width - padding, height - padding);
  ctx.stroke();
  
  // Draw line
  ctx.strokeStyle = color;
  ctx.lineWidth = 3;
  ctx.beginPath();
  
  values.forEach((value, index) => {
    const x = padding + index * step;
    const y = height - padding - (value / maxValue) * chartHeight;
    
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  
  ctx.stroke();
  
  // Draw points
  ctx.fillStyle = color;
  values.forEach((value, index) => {
    const x = padding + index * step;
    const y = height - padding - (value / maxValue) * chartHeight;
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fill();
  });
}

function drawBarChart(ctx, width, height, labels, values, color) {
  ctx.clearRect(0, 0, width, height);
  
  const padding = 40;
  const chartHeight = height - padding * 2;
  const barWidth = (width - padding * 2) / labels.length - 10;
const maxValue = Math.max(...values, 1);
  
  // Draw bars
  values.forEach((value, index) => {
    const x = padding + index * (barWidth + 10);
    const barHeight = (value / maxValue) * chartHeight;
    const y = height - padding - barHeight;
    
    ctx.fillStyle = color;
    ctx.fillRect(x, y, barWidth, barHeight);
    
    // Value label
    ctx.fillStyle = '#f5f5f7';
    ctx.font = '12px Inter';
    ctx.textAlign = 'center';
    ctx.fillText(value, x + barWidth / 2, y - 5);
  });
}

export default createAnalyticsDashboard;
