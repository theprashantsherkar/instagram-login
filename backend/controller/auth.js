const INSTAGRAM_CLIENT_ID = process.env.CLIENT_ID;
const INSTAGRAM_CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;

let userAccessToken = "";

export const redirectAPI = async (req, res) => {
    res.send(`<a href="https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code">Login with Instagram</a>`);
};


export const loginAccountAPI = async (req, res) => {
    const code = req.query.code;

    try {
      const tokenRes = await axios.post(
        "https://api.instagram.com/oauth/access_token",
        new URLSearchParams({
          client_id: INSTAGRAM_CLIENT_ID,
          client_secret: INSTAGRAM_CLIENT_SECRET,
          grant_type: "authorization_code",
          redirect_uri: REDIRECT_URI,
          code: code,
        })
      );
  
      const access_token = tokenRes.data.access_token;
      const user_id = tokenRes.data.user_id;
  
      const mediaRes = await axios.get(
        `https://graph.instagram.com/me/media?fields=id,caption,media_url,media_type,timestamp&access_token=${access_token}`
      );
  
      const media = mediaRes.data.data;
  
      res.json({ user_id, media });
    } catch (err) {
      console.error(err.response?.data || err.message);
      res.status(500).send("Error during Instagram Auth");
    }
}
  





export const getPostsAPI = async (req, res, next) => {
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
        res.status(500).json({ error: 'Fetching media failed' });
    }
}