const express = require('express');
const Instagram = require('instagram-web-api');
const session = require('express-session');

const app = express();

const INSTAGRAM_CLIENT_ID = "1659563081412659"
const INSTAGRAM_CLIENT_SECRET = "63649d86d9738a407e3651a867b47640"
const SESSION_SECRET = "tbjanerfmksjnarokfrmkfvrnr"
const REDIRECT_URI = "https://instagram-login-0ge0.onrender.com/instagram/callback"
// Session setup
app.use(session({
  secret: 'tbjanerfmksjnarokfrmkfvrnr',
  resave: false,
  saveUninitialized: true
}));

// Instagram OAuth setup
const instagram = new Instagram({
  clientId: '1659563081412659',
  clientSecret: '63649d86d9738a407e3651a867b47640',
  redirectUri: 'https://instagram-login-0ge0.onrender.com/instagram/callback'
});

// Login route
app.get('/auth/instagram', (req, res) => {
  res.redirect(instagram.getAuthorizationUrl());
});

// Callback route
app.get('/auth/instagram/callback', async (req, res) => {
  try {
    const { code } = req.query;
    const data = await instagram.authorizeUser(code);
    req.session.instagram = data;
    res.redirect('/posts');
  } catch (err) {
    res.redirect('/');
  }
});

// Get user posts
app.get('/posts', async (req, res) => {
  if (!req.session.instagram) return res.redirect('/');

  const client = new Instagram({
    username: req.session.instagram.username,
    password: req.session.instagram.password
  });

  await client.login();
  const posts = await client.getUserMedia({ userId: req.session.instagram.userId });

  res.json(posts); // In real app, render a view
});

// Add comment
app.post('/posts/:id/comments', async (req, res) => {
  if (!req.session.instagram) return res.status(401).send();

  const client = new Instagram({
    username: req.session.instagram.username,
    password: req.session.instagram.password
  });

  await client.login();
  await client.addComment({
    mediaId: req.params.id,
    text: req.body.comment
  });

  res.json({ success: true });
});

const port = process.env.PORT | 8080;

app.listen(port, ()=>console.log(`server running at port: ${port}`))