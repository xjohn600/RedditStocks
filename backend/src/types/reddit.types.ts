export interface RedditPost {
  id: string;
  title: string;
  content: string;
  author: string;
  score: number;
  numComments: number;
  url: string;
  permalink: string;
  createdAt: Date;
  subreddit: string;
}

export interface RedditConfig {
  clientId: string;
  clientSecret: string;
  username: string;
  password: string;
  userAgent: string;
}
