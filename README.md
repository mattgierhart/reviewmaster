# ReviewMaster 🌟

**AI-powered Google Business review management platform for restaurants and local businesses**

[![Deploy Status](https://github.com/mattgierhart/reviewmaster/actions/workflows/deploy.yml/badge.svg)](https://github.com/mattgierhart/reviewmaster/actions)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google Business Profile API access
- Gemini AI API key
- Stripe account (for payments)

### Local Development Setup

1. **Clone the repository**
```bash
git clone https://github.com/mattgierhart/reviewmaster.git
cd reviewmaster
```

2. **Install dependencies**
```bash
npm install
cd frontend && npm install
cd ../backend && npm install
```

3. **Set up environment variables**
```bash
cp .env.example .env
# Edit .env with your actual API keys and database URL
```

4. **Set up the database**
```bash
cd backend
npx prisma migrate dev
npx prisma generate
```

5. **Start development servers**
```bash
# From root directory
npm run dev
```

This starts both frontend (localhost:3000) and backend (localhost:3001) servers.

## 🏗️ Architecture

### Technology Stack
- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Node.js + Express + Prisma + PostgreSQL
- **AI**: Google Gemini for review analysis
- **Authentication**: Google OAuth 2.0
- **Payments**: Stripe
- **Hosting**: Vercel (frontend) + Railway (backend)

### Project Structure
```
reviewmaster/
├── frontend/           # Next.js frontend application
│   ├── src/
│   │   ├── app/        # App router pages
│   │   ├── components/ # Reusable UI components
│   │   └── contexts/   # React contexts
│   └── package.json
├── backend/            # Node.js API server
│   ├── src/
│   │   ├── routes/     # API endpoints
│   │   ├── middleware/ # Express middleware
│   │   └── utils/      # Utility functions
│   ├── prisma/         # Database schema & migrations
│   └── package.json
├── .github/workflows/  # CI/CD automation
└── docs/              # Documentation
```

## 🔧 API Documentation

### Authentication Endpoints
- `GET /auth/google` - Get Google OAuth URL
- `POST /auth/google/callback` - Handle OAuth callback
- `POST /auth/refresh` - Refresh JWT token

### Business Endpoints
- `GET /api/business/accounts` - Get user's business accounts
- `POST /api/business/accounts/:id/sync-reviews` - Sync reviews

### Review Endpoints
- `GET /api/reviews` - Get reviews with pagination
- `POST /api/reviews/:id/analyze` - AI analysis of review
- `POST /api/reviews/:id/respond` - Create response to review

### Subscription Endpoints
- `GET /api/subscriptions/status` - Get subscription status
- `POST /api/subscriptions/create-checkout` - Create Stripe checkout
- `POST /api/subscriptions/create-portal` - Create customer portal

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

### Backend
```env
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GEMINI_API_KEY=...
STRIPE_SECRET_KEY=...
JWT_SECRET=...
```

### Frontend
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=...
```

## 🚢 Deployment

### Automatic Deployment
Push to `main` branch triggers automatic deployment:
- Frontend → Vercel
- Backend → Railway

### Manual Deployment
```bash
# Frontend
cd frontend
vercel --prod

# Backend
cd backend
railway up
```

## 🧪 Testing

```bash
# Run type checking
npm run type-check

# Future: Unit tests
npm test
```

## 📊 Features

### Core Features
- ✅ Google Business Profile integration
- ✅ AI-powered review sentiment analysis
- ✅ Suggested response generation
- ✅ Real-time review monitoring
- ✅ Professional response management
- ✅ Subscription billing with Stripe

### Planned Features
- 📈 Analytics dashboard
- 📱 Mobile app
- 🔔 Email/SMS notifications
- 🏷️ Custom response templates
- 📊 Competitor analysis
- 🤖 Auto-response workflows

## 🏃‍♂️ Development Workflow

### Day 1-3: Backend Foundation
- [x] Database schema
- [x] Authentication system
- [x] Google Business Profile API
- [x] Gemini AI integration
- [ ] Review sync functionality

### Day 4-7: Frontend Dashboard
- [x] Landing page
- [x] Authentication flow
- [ ] Dashboard UI
- [ ] Review management interface
- [ ] Response editor

### Day 8-10: Payment Integration
- [x] Stripe setup
- [ ] Subscription plans
- [ ] Billing dashboard
- [ ] Usage limits

### Day 11-14: Production Launch
- [ ] Performance optimization
- [ ] Security audit
- [ ] Error monitoring
- [ ] Customer onboarding

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@reviewmaster.dev or create an issue in this repository.

---

**Built with ❤️ for restaurant owners who care about their online reputation**