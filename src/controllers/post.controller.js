import Post from "../models/post.model.js";
import User from "../models/user.model.js";
import Attachment from "../models/attachment.model.js";
import Follower from "../models/follower.model.js";
import Picture from "../models/picture.model.js";
import Like from "../models/like.model.js";
import { API_RESPONSES } from "../constants/api.constants.js";

/**
 * @swagger
 * /api/users/{userId}/posts:
 *   get:
 *     summary: Get all posts by a user
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to get posts for
 *     responses:
 *       200:
 *         description: Posts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Posts retrieved successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving posts."
 */

const getAllUserPosts = async (req, res) => {
  const userId = req.params.userId;

  try {
    const posts = await Post.find({ userId }).sort({ updatedAt: -1 });
    const userPosts = await Promise.all(
      posts.map(async (post) => {
        try {
          const attachments = await Attachment.find({ postId: post._id });
          const user = await User.findById({ _id: post?.userId });
          const pictures = await Picture.find({ userId: post?.userId });
          const likes = await Like.find({ postId: post?._id });

          return {
            ...post.toObject(),
            attachments: attachments.length ? attachments : [],
            firstName: user?.firstName,
            lastName: user?.lastName,
            profilePicture: pictures[0],
            likes: likes,
          };
        } catch (error) {
          console.error(`Error finding details for post ${post._id}:`, error);
          return null;
        }
      })
    );

    const filteredPosts = userPosts.filter((post) => post !== null);

    return res.status(200).json({
      posts: filteredPosts,
      error: null,
      message: API_RESPONSES.GET_POSTS_SUCCESS,
    });
  } catch (error) {
    return res.status(500).json({
      posts: null,
      error: error.message,
      message: API_RESPONSES.GET_POSTS_UNSUCCESS,
    });
  }
};

/**
 * @swagger
 * /api/users/{userId}/posts/{postId}/like:
 *   post:
 *     summary: Like a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user liking the post
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to like
 *     responses:
 *       201:
 *         description: Post liked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 like:
 *                   $ref: '#/components/schemas/Like'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Post liked successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while liking the post."
 */

const likePost = async (req, res) => {
  const { userId, postId } = req?.params;

  Like.create({
    postId,
    userId,
  })
    .then((like) =>
      res?.status(201)?.json({
        like: like,
        error: null,
        message: API_RESPONSES.LIKE_POST_SUCCESS,
      })
    )
    .catch((error) =>
      res?.status(500)?.json({
        post: null,
        error: error,
        message: API_RESPONSES.LIKE_POST_UNSUCCESS,
      })
    );
};

/**
 * @swagger
 * /api/users/{userId}/posts/{postId}/unlike:
 *   post:
 *     summary: Unlike a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user unliking the post
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to unlike
 *     responses:
 *       204:
 *         description: Post unliked successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 like:
 *                   $ref: '#/components/schemas/Like'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Post unliked successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while unliking the post."
 */

const unlikePost = async (req, res) => {
  const { userId, postId } = req?.params;

  Like.deleteOne({
    postId,
    userId,
  })
    .then((like) =>
      res?.status(204)?.json({
        like: like,
        error: null,
        message: API_RESPONSES.UNLIKE_POST_SUCCESS,
      })
    )
    .catch((error) =>
      res?.status(500)?.json({
        post: null,
        error: error,
        message: API_RESPONSES.UNLIKE_POST_UNSUCCESS,
      })
    );
};

/**
 * @swagger
 * /api/users/{userId}/posts/{postId}:
 *   get:
 *     summary: Get post by ID
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user who owns the post
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to retrieve
 *     responses:
 *       200:
 *         description: Post retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Post retrieved successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving the post."
 */

const getPostByPostId = async (req, res) => {
  const { userId, postId } = req?.params;

  try {
    const post = await Post?.find({ _id: postId });
    const attachments = await Attachment.find({ postId: postId });
    const user = await User.findById({ _id: post?.userId });
    const picture = await Picture.find({ userId: post?.userId });
    const likes = await Like.find({ postId: post?._id });

    const currentPost = {
      ...post.toObject(),
      attachments: attachments.length ? attachments : [],
      firstName: user?.firstName,
      lastName: user?.lastName,
      profilePicture: picture[0],
      likes: likes,
    };
    res?.status(200)?.json({
      post: currentPost,
      error: null,
      message: API_RESPONSES.GET_POST_SUCCESS,
    });
  } catch (error) {
    res?.status(500)?.json({
      post: null,
      error: error,
      message: API_RESPONSES.GET_POST_UNSUCCESS,
    });
  }
};

/**
 * @swagger
 * /api/users/{userId}/posts/newsfeed:
 *   get:
 *     summary: Get latest posts for feeds
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to get feeds for
 *     responses:
 *       200:
 *         description: Feeds retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Post'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Feeds retrieved successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 posts:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving feeds."
 */

const getLatestPostForFeeds = async (req, res) => {
  const userId = req?.params?.userId;

  try {
    const following = await Follower.find({ userId: userId });
    const followingUsersIds = following?.map((follow) => follow?.followerId);
    const posts = await Post?.find({ userId: { $in: followingUsersIds } }).sort(
      { updatedAt: -1 }
    );

    const userPosts = await Promise.all(
      posts.map(async (post) => {
        try {
          const attachments = await Attachment.find({ postId: post._id });
          const user = await User.findById({ _id: post?.userId });
          const picture = await Picture.find({ userId: post?.userId });
          const likes = await Like.find({ postId: post?._id });

          return {
            ...post.toObject(),
            attachments: attachments.length ? attachments : [],
            firstName: user?.firstName,
            lastName: user?.lastName,
            profilePicture: picture[0],
            likes: likes,
          };
        } catch (error) {
          console.error(`Error finding details for post ${post._id}:`, error);
          return null;
        }
      })
    );

    const filteredPosts = userPosts.filter((post) => post !== null);

    return res.status(200).json({
      posts: filteredPosts,
      error: null,
      message: API_RESPONSES.GET_FEEDS_SUCCESS,
    });
  } catch (error) {
    return res.status(500).json({
      posts: null,
      error: error.message,
      message: API_RESPONSES.GET_FEEDS_UNSUCCESS,
    });
  }
};

/**
 * @swagger
 * /api/users/{userId}/posts/{postId}/share:
 *   post:
 *     summary: Share a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user sharing the post
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to share
 *     responses:
 *       201:
 *         description: Post shared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Post shared successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while sharing the post."
 */

const sharePost = async (req, res) => {
  const { userId, postId } = req.params;

  const session = await Post.startSession();
  session.startTransaction();

  try {
    // Find the post to share
    const postToShare = await Post.findById(postId).session(session);
    if (!postToShare) {
      throw new Error("Post not found");
    }

    // Create a new post with the same content except _id
    const newPost = await Post.create(
      [
        {
          content: postToShare.content,
          userId: userId,
        },
      ],
      { session }
    );

    // Find all attachments related to the original post
    const attachmentsToCopy = await Attachment.find({ postId: postId }).session(
      session
    );

    // Create new attachments for the new post
    const newAttachments = await Promise.all(
      attachmentsToCopy.map((attachment) =>
        Attachment.create(
          [
            {
              ...attachment.toObject(),
              _id: undefined, // Remove _id to let MongoDB generate a new one
              postId: newPost[0]._id,
            },
          ],
          { session }
        )
      )
    );

    // Commit the transaction
    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      post: { ...newPost[0].toObject(), attachments: newAttachments.flat() },
      error: null,
      msg: API_RESPONSES.ADD_POST_SUCCESS,
    });
  } catch (error) {
    // Rollback the transaction in case of error
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      post: null,
      error: error.message,
      msg: API_RESPONSES.ADD_POST_UNSUCCESS,
    });
  }
};

/**
 * @swagger
 * /api/users/{userId}/posts:
 *   post:
 *     summary: Add a new post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user adding the post
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               content:
 *                 type: string
 *               postAttachments:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Post created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   $ref: '#/components/schemas/Post'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Post created successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while creating the post."
 */

const addPost = async (req, res) => {
  const { content } = req.body;
  const { userId } = req.params;
  const postAttachments = req.files?.["postAttachments[]"] || [];

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        post: null,
        error: { status: true, message: API_RESPONSES.USER_NOT_FOUND },
        msg: API_RESPONSES.USER_NOT_FOUND,
      });
    }

    const session = await Post.startSession();
    session.startTransaction();

    try {
      const post = await Post.create(
        [
          {
            content,
            userId,
          },
        ],
        { session }
      );

      const attachments = await Promise.all(
        postAttachments.map((attachment) =>
          Attachment.create([{ attachment, postId: post[0]._id }], { session })
        )
      );

      await session.commitTransaction();
      session.endSession();

      return res.status(201).json({
        post: { ...post[0].toObject(), attachments: attachments.flat() },
        error: null,
        msg: API_RESPONSES.ADD_POST_SUCCESS,
      });
    } catch (error) {
      await session.abortTransaction();
      session.endSession();
      return res.status(500).json({
        post: null,
        error: error.message,
        msg: API_RESPONSES.UPLOAD_ATTACHMENTS_UNSUCCESS,
      });
    }
  } catch (error) {
    return res.status(500).json({
      post: null,
      error: error.message,
      msg: API_RESPONSES.ADD_POST_UNSUCCESS,
    });
  }
};

/**
 * @swagger
 * /api/users/{userId}/posts/{postId}:
 *   delete:
 *     summary: Delete a post
 *     tags: [Posts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user who owns the post
 *       - in: path
 *         name: postId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the post to delete
 *     responses:
 *       204:
 *         description: Post deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: string
 *                   example: "Post ID"
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Post deleted successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 post:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while deleting the post."
 */

const deletePost = async (req, res) => {
  const { userId, postId } = req.params;

  const session = await Post.startSession();
  session.startTransaction();

  try {
    const deletedPost = await Post.deleteOne({ _id: postId }, { session });
    const deletedAttachments = await Attachment.deleteMany(
      { postId: postId },
      { session }
    );
    const deletedLikes = await Like.deleteMany({ postId: postId }, { session });

    if (
      deletedPost?.acknowledged &&
      deletedAttachments?.acknowledged &&
      deletedLikes?.acknowledged
    ) {
      await session.commitTransaction();
      session.endSession();
      return res.status(204).json();
    } else {
      throw new Error(API_RESPONSES.DELETE_POST_UNSUCCESS);
    }
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    return res.status(500).json({
      post: null,
      error: error.message,
      msg: API_RESPONSES.DELETE_POST_UNSUCCESS,
    });
  }
};

export {
  getAllUserPosts,
  getPostByPostId,
  addPost,
  deletePost,
  getLatestPostForFeeds,
  likePost,
  unlikePost,
  sharePost,
};
