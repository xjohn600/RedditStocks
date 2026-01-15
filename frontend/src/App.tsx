import { useState, useEffect } from 'react';
import './App.css';

interface RedditPost {
  id: string;
  title: string;
  content: string;
  author: string;
  score: number;
  numComments: number;
  permalink: string;
  createdAt: string;
  subreddit: string;
}

function App() {
  const [posts, setPosts] = useState<RedditPost[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connected, setConnected] = useState<boolean | null>(null);

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

  // Test Reddit API connection on mount
  useEffect(() => {
    testConnection();
  }, []);

  const testConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/reddit/test`);
      const data = await response.json();
      setConnected(data.success);
    } catch (err) {
      setConnected(false);
      console.error('Failed to test connection:', err);
    }
  };

  const fetchPosts = async (subreddit: string = 'wallstreetbets') => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${API_BASE_URL}/reddit/posts/${subreddit}?limit=10&sort=hot`
      );
      const data = await response.json();

      if (data.success) {
        setPosts(data.data.posts);
      } else {
        setError(data.error || 'Failed to fetch posts');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch posts');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="app">
      <header className="header">
        <h1>RedditStocks - Reddit API Test</h1>
        <div className="connection-status">
          {connected === null && <span>Testing connection...</span>}
          {connected === true && <span className="status-success">✅ Connected to Reddit API</span>}
          {connected === false && <span className="status-error">❌ Not connected to Reddit API</span>}
        </div>
      </header>

      <main className="main">
        <div className="controls">
          <button onClick={() => fetchPosts('wallstreetbets')} disabled={loading || !connected}>
            Fetch r/wallstreetbets
          </button>
          <button onClick={() => fetchPosts('stocks')} disabled={loading || !connected}>
            Fetch r/stocks
          </button>
        </div>

        {loading && <div className="loading">Loading posts...</div>}
        {error && <div className="error">Error: {error}</div>}

        <div className="posts-container">
          {posts.length > 0 && (
            <>
              <h2>Recent Posts ({posts.length})</h2>
              <div className="posts-grid">
                {posts.map((post) => (
                  <div key={post.id} className="post-card">
                    <h3>{post.title}</h3>
                    <div className="post-meta">
                      <span>👤 {post.author}</span>
                      <span>⬆️ {post.score}</span>
                      <span>💬 {post.numComments}</span>
                      <span>🕒 {formatDate(post.createdAt)}</span>
                    </div>
                    {post.content && (
                      <p className="post-content">
                        {post.content.substring(0, 200)}
                        {post.content.length > 200 ? '...' : ''}
                      </p>
                    )}
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="post-link"
                    >
                      View on Reddit →
                    </a>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
