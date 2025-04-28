import express from 'express';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import colors from 'colors';
import cors from 'cors';
import axios from 'axios';

const INSTAGRAM_CLIENT_ID = 1659563081412659
const INSTAGRAM_CLIENT_SECRET = "63649d86d9738a407e3651a867b47640"
const REDIRECT_URI = "https://instagram-login-0ge0.onrender.com/instagram/callback"


let userAccessToken = "";

config({
    path: "./database/config.env"
});

const app = express();

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200
}))

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/', (req, res) => {
    const redirectUrl = `https://api.instagram.com/oauth/authorize?client_id=${INSTAGRAM_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=user_profile,user_media&response_type=code`;
    console.log(`redirecting to: ${redirectUrl}`)
    res.redirect(redirectUrl);
});


app.get('/instagram/callback', async (req, res) => {
    const code = req.query.code;

    try {
      const { data } = await axios.post('https://api.instagram.com/oauth/access_token', null, {
        params: {
          client_id: INSTAGRAM_CLIENT_ID,
          client_secret: INSTAGRAM_CLIENT_SECRET,
          grant_type: 'authorization_code',
          redirect_uri: REDIRECT_URI,
          code,
        },
      });
  
      const accessToken = data.access_token;
      const userId = data.user_id;
  
      // Fetch user profile
      const profile = await axios.get(`https://graph.instagram.com/${userId}`, {
        params: {
          fields: 'id,username',
          access_token: accessToken,
        },
      });
  
      res.json({ success: true, profile: profile.data });
    } catch (err) {
      console.error(err.response?.data || err.message);
      res.status(500).send("Instagram login failed.");
    }
  });
  
app.get('/getPosts', async (req, res) => {
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
})



app.listen(process.env.PORT, () => console.log(`server is running at port: ${process.env.PORT}`.bgMagenta.black.bold));

