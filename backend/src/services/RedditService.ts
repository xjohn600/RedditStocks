import Snoowrap from 'snoowrap';
import { RedditPost, RedditConfig } from '../types/reddit.types';

export class RedditService {
  private client: Snoowrap;

  constructor(config: RedditConfig) {
    this.client = new Snoowrap({
      userAgent: config.userAgent,
      clientId: config.clientId,
      clientSecret: config.clientSecret,
      username: config.username,
      password: config.password,
    });

    // Configure Snoowrap settings
    this.client.config({
      requestDelay: 1000, // 1 second between requests to avoid rate limiting
      warnings: true,
      debug: process.env.NODE_ENV === 'development',
    });
  }

  /**
   * Fetch recent posts from a subreddit
   */
  async getSubredditPosts(
    subreddit: string,
    limit: number = 25,
    sort: 'hot' | 'new' | 'top' = 'hot'
  ): Promise<RedditPost[]> {
    try {
      const sub = this.client.getSubreddit(subreddit);
      let posts;

      switch (sort) {
        case 'hot':
          posts = await sub.getHot({ limit });
          break;
        case 'new':
          posts = await sub.getNew({ limit });
          break;
        case 'top':
          posts = await sub.getTop({ limit, time: 'day' });
          break;
        default:
          posts = await sub.getHot({ limit });
      }

      return posts.map((post: any) => this.mapRedditPost(post, subreddit));
    } catch (error: any) {
      console.error(`Error fetching posts from r/${subreddit}:`, error.message);
      throw new Error(`Failed to fetch posts from r/${subreddit}: ${error.message}`);
    }
  }

  /**
   * Fetch posts from multiple subreddits
   */
  async getMultipleSubredditPosts(
    subreddits: string[],
    limit: number = 25,
    sort: 'hot' | 'new' | 'top' = 'hot'
  ): Promise<RedditPost[]> {
    try {
      const promises = subreddits.map(sub =>
        this.getSubredditPosts(sub, limit, sort)
      );

      const results = await Promise.all(promises);
      return results.flat();
    } catch (error: any) {
      console.error('Error fetching posts from multiple subreddits:', error.message);
      throw error;
    }
  }

  /**
   * Test Reddit API connection
   */
  async testConnection() {
    try {
      // Simple test - try to fetch from a subreddit
      await this.client.getSubreddit('test').getHot({ limit: 1 });
      console.log(`✅ Successfully connected to Reddit API`);
      return true;
    } catch (error) {
      const err = error as Error;
      console.error('❌ Failed to connect to Reddit:', err.message);
      return false;
    }
  }

  /**
   * Map Snoowrap post object to our RedditPost type
   */
  private mapRedditPost(post: any, subreddit: string): RedditPost {
    return {
      id: post.id,
      title: post.title,
      content: post.selftext || '',
      author: post.author.name,
      score: post.score,
      numComments: post.num_comments,
      url: post.url,
      permalink: `https://reddit.com${post.permalink}`,
      createdAt: new Date(post.created_utc * 1000),
      subreddit: subreddit,
    };
  }
}

// Export singleton instance
let redditService: RedditService | null = null;

export const getRedditService = (): RedditService => {
  if (!redditService) {
    const config: RedditConfig = {
      clientId: process.env.REDDIT_CLIENT_ID || '',
      clientSecret: process.env.REDDIT_CLIENT_SECRET || '',
      username: process.env.REDDIT_USERNAME || '',
      password: process.env.REDDIT_PASSWORD || '',
      userAgent: process.env.REDDIT_USER_AGENT || 'RedditStocks/1.0',
    };

    // Validate configuration
    if (!config.clientId || !config.clientSecret || !config.username || !config.password) {
      throw new Error(
        'Missing Reddit API credentials. Please check your .env file.'
      );
    }

    redditService = new RedditService(config);
  }

  return redditService;
};
