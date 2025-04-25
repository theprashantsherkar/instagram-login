require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');
const session = require('express-session');

const app = express();

// Environment variables
const INSTAGRAM_CLIENT_ID = "1659563081412659"
const INSTAGRAM_CLIENT_SECRET = "63649d86d9738a407e3651a867b47640"
const SESSION_SECRET = "tbjanerfmksjnarokfrmkfvrnr"
const REDIRECT_URI = "https://instagram-login-0ge0.onrender.com/instagram/callback"

// Middleware
app.use(cors({
  origin: 'http://localhost:3000', // Update for production
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Set to true in production with HTTPS
}));

// Instagram OAuth endpoints
app.get('/instagram/auth', (req, res) => {
  const authUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.json({ authUrl });
});

app.get('/instagram/callback', async (req, res) => {
  const { code } = req.query;

  try {
    // Exchange code for access token
    const tokenResponse = await axios.post('https://api.instagram.com/oauth/access_token', {
      client_id: INSTAGRAM_CLIENT_ID,
      client_secret: INSTAGRAM_CLIENT_SECRET,
      grant_type: 'authorization_code',
      redirect_uri: REDIRECT_URI,
      code
    });

    const { access_token, user_id } = tokenResponse.data;

    // Store in session
    req.session.instagram = { access_token, user_id };

    // Redirect to frontend with success
    res.redirect('http://localhost:3000/dashboard');
  } catch (error) {
    console.error('Instagram OAuth error:', error.response.data);
    res.redirect('http://localhost:3000?error=oauth_failed');
  }
});

// Get user posts
app.get('/instagram/posts', async (req, res) => {
  if (!req.session.instagram) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    const response = await axios.get(`https://graph.instagram.com/me/media`, {
      params: {
        fields: 'id,caption,media_type,media_url,thumbnail_url,permalink,timestamp',
        access_token: req.session.instagram.access_token
      }
    });

    res.json(response.data.data);
  } catch (error) {
    console.error('Error fetching posts:', error.response.data);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
});

// Add comment to post
app.post('/instagram/posts/:id/comments', async (req, res) => {
  if (!req.session.instagram) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    // Note: Instagram Graph API requires special permissions for commenting
    // This might need to go through the Instagram Basic Display API differently
    const response = await axios.post(`https://graph.instagram.com/${req.params.id}/comments`, {
      message: req.body.comment,
      access_token: req.session.instagram.access_token
    });

    res.json({ success: true, data: response.data });
  } catch (error) {
    console.error('Error adding comment:', error.response.data);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});