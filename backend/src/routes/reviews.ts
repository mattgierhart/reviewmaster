import express from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { prisma } from '../index';
import { logger } from '../utils/logger';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Get reviews for user's accounts
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { accountId, page = 1, limit = 20 } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: any = {
      account: {
        userId: req.user!.id
      }
    };

    if (accountId) {
      where.accountId = accountId;
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        include: {
          account: true,
          responses: true
        },
        orderBy: { reviewDate: 'desc' },
        skip,
        take: Number(limit)
      }),
      prisma.review.count({ where })
    ]);

    res.json({
      reviews,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    logger.error('Get reviews error:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Analyze review with AI
router.post('/:reviewId/analyze', async (req: AuthRequest, res) => {
  try {
    const { reviewId } = req.params;

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        account: {
          userId: req.user!.id
        }
      }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    // Skip if already analyzed
    if (review.sentiment && review.suggestedResponse) {
      return res.json({
        sentiment: review.sentiment,
        keyTopics: review.keyTopics,
        urgencyScore: review.urgencyScore,
        suggestedResponse: review.suggestedResponse
      });
    }

    // Analyze with Gemini
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    const prompt = `
Analyze this restaurant review and provide:
1. Sentiment (positive, negative, neutral)
2. Key topics (as array of strings)
3. Urgency score (0-1, where 1 is most urgent to respond)
4. A professional, empathetic response suggestion

Review: "${review.reviewText}"
Rating: ${review.rating}/5 stars
Reviewer: ${review.reviewerName}

Respond in JSON format:
{
  "sentiment": "positive|negative|neutral",
  "keyTopics": ["topic1", "topic2"],
  "urgencyScore": 0.0-1.0,
  "suggestedResponse": "Professional response text"
}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const analysis = JSON.parse(text);
      
      // Update review with analysis
      const updatedReview = await prisma.review.update({
        where: { id: reviewId },
        data: {
          sentiment: analysis.sentiment,
          keyTopics: analysis.keyTopics,
          urgencyScore: analysis.urgencyScore,
          suggestedResponse: analysis.suggestedResponse
        }
      });

      res.json({
        sentiment: updatedReview.sentiment,
        keyTopics: updatedReview.keyTopics,
        urgencyScore: updatedReview.urgencyScore,
        suggestedResponse: updatedReview.suggestedResponse
      });
    } catch (parseError) {
      logger.error('Failed to parse AI response:', parseError);
      res.status(500).json({ error: 'Failed to analyze review' });
    }
  } catch (error) {
    logger.error('Review analysis error:', error);
    res.status(500).json({ error: 'Failed to analyze review' });
  }
});

// Create response to review
router.post('/:reviewId/respond', async (req: AuthRequest, res) => {
  try {
    const { reviewId } = req.params;
    const { responseText, isPublished = false } = req.body;

    const review = await prisma.review.findFirst({
      where: {
        id: reviewId,
        account: {
          userId: req.user!.id
        }
      }
    });

    if (!review) {
      return res.status(404).json({ error: 'Review not found' });
    }

    const response = await prisma.reviewResponse.create({
      data: {
        reviewId,
        userId: req.user!.id,
        responseText,
        isPublished,
        publishedAt: isPublished ? new Date() : null
      }
    });

    res.json(response);
  } catch (error) {
    logger.error('Create response error:', error);
    res.status(500).json({ error: 'Failed to create response' });
  }
});

export default router;