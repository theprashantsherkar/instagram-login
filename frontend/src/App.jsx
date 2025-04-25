import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import axios from 'axios';

// Set axios base URL
axios.defaults.baseURL = 'https://instagram-login-0ge0.onrender.com';
axios.defaults.withCredentials = true;

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

const LoginPage = () => {
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for error in URL
    const urlParams = new URLSearchParams(window.location.search);
    const errorParam = urlParams.get('error');
    if (errorParam) {
      setError('Failed to authenticate with Instagram. Please try again.');
    }
  }, []);

  const handleLogin = async () => {
    try {
      const response = await axios.get('/instagram/auth');
      window.location.href = response.data.authUrl;
    } catch (err) {
      setError('Failed to initiate login. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Instagram Posts Commenter</h1>
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        <button
          onClick={handleLogin}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-md hover:opacity-90 transition"
        >
          Login with Instagram
        </button>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [activePost, setActivePost] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get('/instagram/posts');
        setPosts(response.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          navigate('/');
        } else {
          setError('Failed to load posts. Please try again later.');
          setLoading(false);
        }
      }
    };

    fetchPosts();
  }, [navigate]);

  const handleCommentSubmit = async (postId) => {
    if (!commentText.trim()) return;

    try {
      await axios.post(`/instagram/posts/${postId}/comments`, {
        comment: commentText
      });
      setCommentText('');
      setActivePost(null);
      alert('Comment added successfully!');
    } catch (err) {
      console.error('Error adding comment:', err);
      alert('Failed to add comment. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-md p-4 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8 text-center">Your Instagram Posts</h1>

        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts found.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4">
                  {post.media_type === 'IMAGE' ? (
                    <img
                      src={post.media_url}
                      alt={post.caption || 'Instagram post'}
                      className="w-full h-auto rounded"
                    />
                  ) : (
                    <video controls className="w-full rounded">
                      <source src={post.media_url} type="video/mp4" />
                    </video>
                  )}
                </div>
                <div className="p-4 border-t">
                  <p className="text-gray-600 mb-2">
                    {post.caption || 'No caption'}
                  </p>
                  <div className="flex items-center justify-between">
                    <a
                      href={post.permalink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-500 hover:underline"
                    >
                      View on Instagram
                    </a>
                    <button
                      onClick={() => setActivePost(activePost === post.id ? null : post.id)}
                      className="text-sm bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded"
                    >
                      {activePost === post.id ? 'Cancel' : 'Add Comment'}
                    </button>
                  </div>

                  {activePost === post.id && (
                    <div className="mt-4">
                      <textarea
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Write your comment..."
                        className="w-full p-2 border rounded mb-2"
                        rows="3"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
                      >
                        Post Comment
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;