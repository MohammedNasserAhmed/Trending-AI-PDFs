# Trending AI PDFs - Modern Architecture Setup Guide

## 🚀 Quick Start

This project now features a modern, feature-based architecture with comprehensive tracking, analytics, and a professional UI.

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database (Neon recommended)
- GitHub account (for repo stats integration)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your credentials:
   - `DATABASE_URL`: Your Neon PostgreSQL connection string
   - `GITHUB_TOKEN`: GitHub personal access token (optional, for higher API limits)
   - `GITHUB_REPO_OWNER`: Your GitHub username
   - `GITHUB_REPO_NAME`: Repository name

3. **Initialize database:**
   
   The database schema will be automatically created when you first start the server. Alternatively, run the SQL script:
   ```bash
   # Connect to your Neon database and run:
   psql $DATABASE_URL < server/db/schema.sql
   ```

### Running the Application

#### Development Mode (Frontend + Backend)

Run both frontend and backend concurrently:
```bash
npm run dev:fullstack
```

This will start:
- 🎨 Frontend dev server at `http://localhost:5173`
- 🚀 Backend API server at `http://localhost:3000`

#### Frontend Only

```bash
npm run dev
```

#### Backend Only

```bash
npm run server
```

### Project Structure

```
Trending-AI-PDFs/
├── src/                      # Frontend source code
│   ├── features/             # Feature modules
│   │   ├── analytics/        # Analytics dashboard
│   │   ├── catalog/          # PDF catalog
│   │   ├── tracking/         # User tracking
│   │   └── github/           # GitHub integration
│   ├── shared/               # Shared components & utilities
│   │   ├── components/       # Navbar, etc.
│   │   ├── styles/           # Design system
│   │   └── api/              # API client
│   ├── pages/                # Page components
│   ├── router/               # Client-side routing
│   ├── state/                # State management
│   └── main.js               # App entry point
├── server/                   # Backend API
│   ├── api/                  # API routes
│   ├── db/                   # Database client & schema
│   ├── middleware/           # Express middleware
│   └── server.js             # Server entry point
├── docs/                     # Static assets (catalog.json, etc.)
├── PDFs/                     # PDF files
└── index.html                # Main HTML file
```

## 🎯 Features Implemented

### ✅ Backend Infrastructure
- Express.js API server with CORS
- Neon PostgreSQL database integration
- Privacy-compliant tracking (hashed IPs)
- Analytics aggregation endpoints
- GitHub API integration

### ✅ Frontend Features
- Modern design system with CSS variables
- Lightweight state management
- Client-side routing (SPA)
- Real-time GitHub stats widget
- Analytics dashboard with visualizations

### ✅ Pages
- `/` - Home (catalog with filters)
- `/latest` - Recently added PDFs
- `/categories` - Browse by category
- `/stats` - Analytics dashboard
- `/about` - Project information

### ✅ Tracking  
- Page view tracking
- PDF download tracking
- Link click tracking
- Visitor statistics

## 🔧 Configuration Options

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | Neon PostgreSQL connection string | ✅ Yes |
| `GITHUB_TOKEN` | GitHub personal access token | ❌ Optional |
| `GITHUB_REPO_OWNER` | GitHub username/org | ✅ Yes (for stats) |
| `GITHUB_REPO_NAME` | Repository name | ✅ Yes (for stats) |
| `PORT` | Backend server port | ❌ Default: 3000 |
| `ALLOWED_ORIGINS` | CORS allowed origins | ❌ Default: localhost |

### Database Setup (Neon)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy the connection string
4. Paste it in `.env` as `DATABASE_URL`

The database schema will auto-initialize on first run.

## 📊 Using the Analytics Dashboard

Navigate to `/stats` to see:
- **Visitor trends** (last 30 days)
- **Top downloaded PDFs**
- **Traffic sources breakdown**
- **Section popularity**

All charts are rendered in real-time from your tracking data.

## 🛠️ Development Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start frontend dev server |
| `npm run server` | Start backend API server |
| `npm run dev:fullstack` | Start both frontend & backend |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Lint code |
| `npm run format` | Format code with Prettier |

## 🚢 Deployment

### Frontend (Vite Build)

```bash
npm run build
```

Deploy the `dist/` folder to:
- GitHub Pages
- Vercel
- Netlify
- Cloudflare Pages

### Backend (Express API)

Deploy `server/` to:
- Railway
- Render
- Fly.io
- Heroku

Or convert to serverless functions for:
- Vercel Functions
- Netlify Functions
- Cloudflare Workers

## 🎨 Design System

The project uses a modern design system with:
- **Colors**: Dark theme with vibrant accents
- **Typography**: Inter font family
- **Spacing**: 8px base unit
- **Animations**: Smooth transitions and micro-interactions

All design tokens are in `src/shared/styles/design-tokens.css`.

## 🔒 Privacy & Compliance

- IP addresses are hashed (SHA-256) before storage
- No personally identifiable information is collected
- All tracking is anonymous
- Users can opt out via browser settings

## 📝 License

MIT License - see the original README for details.

## 💬 Support

For issues or questions, please open an issue on GitHub.

---

**Built with modern web technologies** 🚀  
Vanilla JS • Express • PostgreSQL • Vite
