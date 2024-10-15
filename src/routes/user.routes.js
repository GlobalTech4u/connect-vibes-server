import express from "express";

import {
  getAllUsers,
  getUserById,
  addUser,
  getUsersBySearch,
  updateUserById,
  followUser,
  unfollowUser,
  getFollowers,
  getFollowings,
} from "../controllers/user.controller.js";
import { upload } from "../utils/multer.util.js";
import { PROFILE_PICTURE_FIELD } from "../constants/common.constants.js";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(getAllUsers)
  .post(upload.single(PROFILE_PICTURE_FIELD), addUser);

router.route("/:userId").get(getUserById).put(updateUserById);
router.route("/:userId/followers").get(getFollowers);
router.route("/:userId/followings").get(getFollowings);
router.route("/:userId/follow").put(followUser);
router.route("/:userId/unfollow").put(unfollowUser);
router.route("/search/:searchQuery").get(getUsersBySearch);

export default router;
