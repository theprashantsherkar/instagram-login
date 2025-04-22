const INSTAGRAM_CLIENT_ID = process.env.CLIENT_ID;
const INSTAGRAM_CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;


let userAccessToken = "";

export const redirectAPI = async (req, res) => {
  const redirectUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  res.redirect(redirectUrl);
};


export const loginAccountAPI = async (req, res) => {
  const code = req.query.code;
  try {
    const response = await axios.post(`https://api.instagram.com/oauth/access_token`, null, {
      params: {
        client_id: INSTAGRAM_CLIENT_ID,
        client_secret: INSTAGRAM_CLIENT_SECRET,
        grant_type: 'authorization_code',
        redirect_uri: REDIRECT_URI,
        code
      }
    });
    userAccessToken = response.data.access_token;
    res.redirect(`http://localhost:5173/feed?token=${userAccessToken}`);
  } catch (err) {
    res.status(500).json({ error: 'Token exchange failed', details: err.response?.data || err.message });
  }
}
  





export const getPostsAPI = async (req, res) => {
  const token = req.query.token;
  try {
    const mediaRes = await axios.get(`https://graph.instagram.com/me/media`, {
      params: {
        fields: 'id,caption,media_url,permalink',
        access_token: token
      }
    });
    res.json(mediaRes.data);
  } catch (err) {
    res.status(500).json({ error: 'Fetching media failed', details: err.response?.data || err.message });
  }
}