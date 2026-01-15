import { Router, Request, Response } from 'express';
import { getRedditService } from '../services/RedditService';

const router = Router();

/**
 * GET /api/reddit/test
 * Test Reddit API connection
 */
router.get('/test', async (req: Request, res: Response) => {
  try {
    const redditService = getRedditService();
    const isConnected = await redditService.testConnection();

    res.json({
      success: isConnected,
      message: isConnected
        ? 'Successfully connected to Reddit API'
        : 'Failed to connect to Reddit API',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/reddit/posts/:subreddit
 * Fetch posts from a specific subreddit
 */
router.get('/posts/:subreddit', async (req: Request, res: Response) => {
  try {
    const { subreddit } = req.params;
    const limit = parseInt(req.query.limit as string) || 25;
    const sort = (req.query.sort as 'hot' | 'new' | 'top') || 'hot';

    const redditService = getRedditService();
    const posts = await redditService.getSubredditPosts(subreddit, limit, sort);

    res.json({
      success: true,
      data: {
        subreddit,
        count: posts.length,
        posts,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

/**
 * GET /api/reddit/posts
 * Fetch posts from multiple subreddits
 */
router.get('/posts', async (req: Request, res: Response) => {
  try {
    const subredditsParam = req.query.subreddits as string;
    const limit = parseInt(req.query.limit as string) || 25;
    const sort = (req.query.sort as 'hot' | 'new' | 'top') || 'hot';

    if (!subredditsParam) {
      return res.status(400).json({
        success: false,
        error: 'Please provide subreddits as a comma-separated query parameter',
      });
    }

    const subreddits = subredditsParam.split(',').map(s => s.trim());
    const redditService = getRedditService();
    const posts = await redditService.getMultipleSubredditPosts(
      subreddits,
      limit,
      sort
    );

    res.json({
      success: true,
      data: {
        subreddits,
        count: posts.length,
        posts,
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
