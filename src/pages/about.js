/**
 * About Page
 * Information about the project
 */

export function renderAboutPage() {
  const app = document.getElementById('app');
  app.innerHTML = '';
  
  const container = document.createElement('div');
  container.className = 'container page-content';
  
  container.innerHTML = `
    <div class="about-page">
      <header class="page-header">
        <h1>ℹ️ About Trending AI PDFs</h1>
      </header>
      
      <div class="about-content card">
        <section>
          <h2>📖 Mission</h2>
          <p>
            Trending AI PDFs is a curated collection of high-quality AI research papers,
            cookbooks, and educational resources. Our mission is to democratize access to
            cutting-edge AI knowledge and make it easily accessible to researchers,
            practitioners, and enthusiasts worldwide.
          </p>
        </section>
        
        <section>
          <h2>✨ Features</h2>
          <ul>
            <li>Comprehensive catalog of AI PDFs across multiple domains</li>
            <li>Real-time tracking of downloads and popular resources</li>
            <li>Analytics dashboard for insights into usage patterns</li>
            <li>Organized by categories: ML/DL, NLP, CV, RL, Ethics, MLOps, and more</li>
            <li>Regular updates with the latest research and materials</li>
          </ul>
        </section>
        
        <section>
          <h2>🛠️ Technology Stack</h2>
          <ul>
            <li><strong>Frontend:</strong> Vanilla JavaScript with modern ES6+ features</li>
            <li><strong>Backend:</strong> Express.js API server</li>
            <li><strong>Database:</strong> Neon PostgreSQL for tracking and analytics</li>
            <li><strong>Styling:</strong> Modern CSS with design tokens</li>
            <li><strong>Architecture:</strong> Feature-based modular structure</li>
          </ul>
        </section>
        
        <section>
          <h2>📊 Analytics</h2>
          <p>
            We track anonymous usage statistics to understand which resources are most
            valuable to our community. This helps us prioritize additions and improvements.
            All tracking is privacy-compliant and doesn't collect personal information.
          </p>
        </section>
        
        <section>
          <h2>🤝 Contributing</h2>
          <p>
            Want to contribute? We welcome suggestions for new PDFs, improvements to the
            platform, and bug reports. Visit our GitHub repository to get started.
          </p>
        </section>
        
        <section>
          <h2>📜 License</h2>
          <p>
            This project is open source under the MIT License. Individual PDFs retain
            their original licenses. Please check each resource before redistribution or
            commercial use.
          </p>
        </section>
      </div>
    </div>
  `;
  
  app.appendChild(container);
}

export default renderAboutPage;
