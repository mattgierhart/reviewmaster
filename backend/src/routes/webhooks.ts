import express from 'express';
import Stripe from 'stripe';
import { prisma } from '../index';
import { logger } from '../utils/logger';

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16'
});

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

// Stripe webhook handler
router.post('/stripe', async (req, res) => {
  const sig = req.headers['stripe-signature']!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    logger.error('Webhook signature verification failed:', err);
    return res.status(400).send(`Webhook Error: ${err}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        
        if (session.metadata?.userId && session.metadata?.plan) {
          await prisma.user.update({
            where: { id: session.metadata.userId },
            data: {
              subscriptionStatus: 'active',
              subscriptionPlan: session.metadata.plan
            }
          });
          
          logger.info('Subscription activated for user:', session.metadata.userId);
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (customer && !customer.deleted && customer.metadata?.userId) {
          await prisma.user.update({
            where: { id: customer.metadata.userId },
            data: {
              subscriptionStatus: subscription.status,
              subscriptionEndsAt: subscription.current_period_end ? 
                new Date(subscription.current_period_end * 1000) : null
            }
          });
          
          logger.info('Subscription updated for user:', customer.metadata.userId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        
        const customer = await stripe.customers.retrieve(subscription.customer as string);
        
        if (customer && !customer.deleted && customer.metadata?.userId) {
          await prisma.user.update({
            where: { id: customer.metadata.userId },
            data: {
              subscriptionStatus: 'canceled',
              subscriptionEndsAt: new Date()
            }
          });
          
          logger.info('Subscription canceled for user:', customer.metadata.userId);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        
        if (invoice.customer) {
          const customer = await stripe.customers.retrieve(invoice.customer as string);
          
          if (customer && !customer.deleted && customer.metadata?.userId) {
            await prisma.user.update({
              where: { id: customer.metadata.userId },
              data: {
                subscriptionStatus: 'past_due'
              }
            });
            
            logger.info('Payment failed for user:', customer.metadata.userId);
          }
        }
        break;
      }

      default:
        logger.info('Unhandled webhook event type:', event.type);
    }

    res.json({ received: true });
  } catch (error) {
    logger.error('Webhook processing error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
});

export default router;