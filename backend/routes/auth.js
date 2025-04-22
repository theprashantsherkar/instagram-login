import express from "express";
import { getPostsAPI, loginAccountAPI, redirectAPI } from "../controller/auth.js";

const router = express.Router()

router.get('/', redirectAPI);
router.get('/instagram/callback', loginAccountAPI);
router.get('/getPosts', getPostsAPI)

export default router;


