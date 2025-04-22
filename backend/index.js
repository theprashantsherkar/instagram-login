import express from 'express';
import { configDotenv } from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import colors from 'colors';
import AuthRoutes from './routes/auth.js'
import CommentRoutes from './routes/comment.js'
import cors from 'cors';


configDotenv({
    path:"./database/config.env"
})

export const app = express();

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true,
}))

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use('/api/v1', AuthRoutes);
app.use('/api/v1/comment', CommentRoutes);



