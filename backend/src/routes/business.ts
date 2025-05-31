import express from 'express';
import { google } from 'googleapis';
import { prisma } from '../index';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get user's Google Business accounts
router.get('/accounts', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        googleBusinessAccounts: {
          include: {
            _count: {
              select: { reviews: true }
            }
          }
        }
      }
    });

    if (!user?.googleRefreshToken) {
      return res.status(400).json({ error: 'Google account not connected' });
    }

    // Set up Google API client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    oauth2Client.setCredentials({
      refresh_token: user.googleRefreshToken
    });

    // Get fresh Google Business accounts
    const mybusiness = google.mybusinessbusinessinformation({
      version: 'v1',
      auth: oauth2Client
    });

    try {
      const { data } = await mybusiness.accounts.list();
      
      // Sync accounts to database
      if (data.accounts) {
        for (const account of data.accounts) {
          if (account.name && account.accountName) {
            await prisma.googleBusinessAccount.upsert({
              where: { googleId: account.name },
              update: {
                name: account.accountName,
                // Add other fields as needed
              },
              create: {
                googleId: account.name,
                name: account.accountName,
                userId: user.id
              }
            });
          }
        }
      }
    } catch (googleError) {
      logger.error('Google API error:', googleError);
      // Still return local data if Google API fails
    }

    // Return updated accounts from database
    const updatedUser = await prisma.user.findUnique({
      where: { id: req.user!.id },
      include: {
        googleBusinessAccounts: {
          include: {
            _count: {
              select: { reviews: true }
            }
          }
        }
      }
    });

    res.json({
      accounts: updatedUser?.googleBusinessAccounts || []
    });
  } catch (error) {
    logger.error('Get business accounts error:', error);
    res.status(500).json({ error: 'Failed to fetch business accounts' });
  }
});

// Sync reviews for a specific account
router.post('/accounts/:accountId/sync-reviews', async (req: AuthRequest, res) => {
  try {
    const { accountId } = req.params;

    const account = await prisma.googleBusinessAccount.findFirst({
      where: {
        id: accountId,
        userId: req.user!.id
      },
      include: { user: true }
    });

    if (!account) {
      return res.status(404).json({ error: 'Business account not found' });
    }

    if (!account.user.googleRefreshToken) {
      return res.status(400).json({ error: 'Google account not connected' });
    }

    // Set up Google API client
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET
    );
    
    oauth2Client.setCredentials({
      refresh_token: account.user.googleRefreshToken
    });

    // This is a placeholder - Google Business Profile API structure may vary
    // You'll need to implement the actual review fetching logic based on the API docs
    
    res.json({ message: 'Review sync initiated', accountId });
  } catch (error) {
    logger.error('Sync reviews error:', error);
    res.status(500).json({ error: 'Failed to sync reviews' });
  }
});

export default router;