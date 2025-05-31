# API Setup Guide

## Google Business Profile API Setup

1. **Create Google Cloud Project**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create new project or select existing
   - Enable Google Business Profile API

2. **Create OAuth 2.0 Credentials**
   - Go to APIs & Services → Credentials
   - Create OAuth 2.0 Client ID
   - Add authorized redirect URI: `https://reviewmastermanagement.com/auth/google/callback`
   - Download credentials JSON

3. **Environment Variables**
   ```env
   GOOGLE_CLIENT_ID=your_client_id
   GOOGLE_CLIENT_SECRET=your_client_secret
   GOOGLE_REDIRECT_URI=https://reviewmastermanagement.com/auth/google/callback
   ```

## Gemini AI API Setup

1. **Get API Key**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create new API key
   - Copy the key

2. **Environment Variables**
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

## Stripe Setup

1. **Create Stripe Account**
   - Sign up at [Stripe](https://stripe.com)
   - Get test API keys from dashboard

2. **Create Products**
   - Basic Plan: $29/month
   - Pro Plan: $79/month
   - Enterprise Plan: $199/month

3. **Environment Variables**
   ```env
   STRIPE_SECRET_KEY=sk_test_...
   STRIPE_PUBLISHABLE_KEY=pk_test_...
   STRIPE_WEBHOOK_SECRET=whsec_...
   ```

4. **Webhook Setup**
   - Add webhook endpoint: `https://api.reviewmastermanagement.com/webhooks/stripe`
   - Listen for: `checkout.session.completed`, `customer.subscription.updated`, etc.

## Database Setup

1. **Local Development**
   ```bash
   # Using Docker
   docker run --name reviewmaster-db -e POSTGRES_PASSWORD=password -p 5432:5432 -d postgres:15
   
   # Environment variable
   DATABASE_URL="postgresql://postgres:password@localhost:5432/reviewmaster"
   ```

2. **Production (Railway)**
   - Railway automatically provides PostgreSQL
   - Use the provided DATABASE_URL

## JWT Setup

```env
JWT_SECRET=your_super_secret_jwt_key_minimum_32_characters
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```