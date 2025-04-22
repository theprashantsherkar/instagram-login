import express from "express";
import { getComments } from "../controller/comment.js";

const router = express.Router();

router.get('/allComments', getComments);

export default router;
