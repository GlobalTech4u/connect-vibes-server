import express from "express";

import {
  getAllUserPosts,
  getPostByPostId,
  addPost,
  deletePost,
  getLatestPostForFeeds,
  likePost,
  unlikePost,
  sharePost,
} from "../controllers/post.controller.js";
import { upload } from "../utils/multer.util.js";
import { POST_ATTACHMENTS_FIELD } from "../constants/common.constants.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllUserPosts)
  .post(
    upload.fields([{ name: POST_ATTACHMENTS_FIELD, maxCount: 12 }]),
    addPost
  );

router.route("/newsfeed").get(getLatestPostForFeeds);

router.route("/:postId").get(getPostByPostId).delete(deletePost);
router.route("/:postId/like").post(likePost);
router.route("/:postId/unlike").post(unlikePost);
router.route("/:postId/share").post(sharePost);

export default router;
