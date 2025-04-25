import express from 'express';
import { config } from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import colors from 'colors';
import AuthRoutes from './routes/auth.js'
import CommentRoutes from './routes/comment.js'
import cors from 'cors';

config({
    path:"./database/config.env"
});

export const app = express();

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true,
    optionsSuccessStatus: 200
}))

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.urlencoded({extended:true}));


app.use('/api/v1/auth', AuthRoutes);
app.use('/api/v1/comment', CommentRoutes);



