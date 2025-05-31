import express from 'express';
import Stripe from 'stripe';
import { prisma } from '../index';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

// Get user's subscription status
router.get('/status', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id },
      select: {
        stripeCustomerId: true,
        subscriptionStatus: true,
        subscriptionPlan: true,
        subscriptionEndsAt: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      hasActiveSubscription: user.subscriptionStatus === 'active',
      plan: user.subscriptionPlan,
      status: user.subscriptionStatus,
      endsAt: user.subscriptionEndsAt
    });
  } catch (error) {
    logger.error('Get subscription status error:', error);
    res.status(500).json({ error: 'Failed to get subscription status' });
  }
});

// Create checkout session
router.post('/create-checkout', async (req: AuthRequest, res) => {
  try {
    const { priceId, plan } = req.body;

    if (!priceId || !plan) {
      return res.status(400).json({ error: 'Price ID and plan are required' });
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    let customerId = user.stripeCustomerId;

    // Create Stripe customer if doesn't exist
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: {
          userId: user.id
        }
      });
      
      customerId = customer.id;
      
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customerId }
      });
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1
        }
      ],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        plan
      }
    });

    res.json({ checkoutUrl: session.url });
  } catch (error) {
    logger.error('Create checkout session error:', error);
    res.status(500).json({ error: 'Failed to create checkout session' });
  }
});

// Create customer portal session
router.post('/create-portal', async (req: AuthRequest, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user!.id }
    });

    if (!user?.stripeCustomerId) {
      return res.status(400).json({ error: 'No subscription found' });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard`
    });

    res.json({ portalUrl: session.url });
  } catch (error) {
    logger.error('Create portal session error:', error);
    res.status(500).json({ error: 'Failed to create portal session' });
  }
});

export default router;