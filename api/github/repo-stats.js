import dotenv from 'dotenv';

dotenv.config();

async function getGitHubStats() {
  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  
  if (!owner || !repo) {
    throw new Error('GitHub repository not configured');
  }

  const url = `https://api.github.com/repos/${owner}/${repo}`;
  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'Trending-AI-PDFs'
  };
  
  if (process.env.GITHUB_TOKEN) {
    headers['Authorization'] = `token ${process.env.GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });
  
  if (!response.ok) {
    throw new Error(`GitHub API responded with ${response.status}`);
  }

  const data = await response.json();
  
  return {
    success: true,
    data: {
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
      owner: data.owner.login,
      repo: data.name
    },
    stats: {
      stars: data.stargazers_count,
      forks: data.forks_count,
      watchers: data.watchers_count,
      owner: data.owner.login,
      repo: data.name
    }
  };
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

  // Handle /api/github/repo-stats
  if (req.url === '/api/github/repo-stats' || req.url === '/repo-stats') {
    try {
      const stats = await getGitHubStats();
      res.status(200).json(stats);
    } catch (error) {
      console.error('GitHub API Error:', error);
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
    return;
  }

  res.status(404).json({ error: 'Not found' });
}
