const INSTAGRAM_CLIENT_ID = 1379400326423540
const INSTAGRAM_CLIENT_SECRET = "cf73ea8c7360add1175ea46e6c92af81"
const REDIRECT_URI = "http://localhost:8080/api/v1/auth/instagram/callback"


let userAccessToken = "";

export const redirectAPI = async (req, res) => {

  const redirectUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
  console.log('first api passed')
  console.log(redirectUrl)
  res.redirect(redirectUrl);
  
};


export const loginAccountAPI = async (req, res) => {
  const code = req.query.code;
  console.log(code);

  console.log({
    INSTAGRAM_CLIENT_ID,
    INSTAGRAM_CLIENT_SECRET,
    REDIRECT_URI
  })

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
    console.log('second api passed')
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