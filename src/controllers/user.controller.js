import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import Picture from "../models/picture.model.js";
import Follower from "../models/follower.model.js";
import { API_RESPONSES } from "../constants/api.constants.js";

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management
 */

/**
 * @swagger
 * /api/users/search/{searchQuery}:
 *   get:
 *     summary: Search for users by query
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: searchQuery
 *         schema:
 *           type: string
 *         required: true
 *         description: The search query to filter users by first name, last name, or email
 *     responses:
 *       200:
 *         description: A list of users matching the search query
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Search successful"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while searching for users."
 */

const getUsersBySearch = async (req, res) => {
  const searchQuery = req?.params?.searchQuery;

  return await User?.find({
    $or: [
      {
        firstName: { $regex: searchQuery, $options: "i" },
      },
      {
        lastName: { $regex: searchQuery, $options: "i" },
      },
      {
        email: { $regex: searchQuery, $options: "i" },
      },
    ],
  })
    .then(async (users) => {
      const allUsers = await Promise.all(
        users?.map(async (userdoc) => {
          const { password, ...userWithoutPassword } = userdoc?.toObject();
          let currentUser;
          try {
            const [followings, followers, pictures] = await Promise.all([
              Follower?.find({ userId: userWithoutPassword?._id }),
              Follower?.find({ followerId: userWithoutPassword?._id }),
              Picture?.find({ userId: userWithoutPassword?._id }),
            ]);

            currentUser = {
              ...userWithoutPassword,
              profilePictures: pictures,
              followers: followers,
              followings: followings,
            };
          } catch (error) {
            currentUser = {};
          }

          return currentUser;
        })
      );

      return res?.status(200)?.json({
        users: allUsers,
        error: null,
        message: API_RESPONSES.SEARCH_USERS_SUCCESS,
      });
    })
    .catch((error) =>
      res?.status(500)?.json({
        users: null,
        error: error,
        message: API_RESPONSES.SEARCH_USERS_UNSUCCESS,
      })
    );
};

/**
 * @swagger
 * /api/users/:
 *   get:
 *     summary: Retrieve a list of users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: A list of users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Got users"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving users."
 */

const getAllUsers = async (req, res) => {
  return await User?.find({})
    .then(async (users) => {
      const allUsers = await Promise.all(
        users?.map(async (userdoc) => {
          const { password, ...userWithoutPassword } = userdoc?.toObject();
          let currentUser;
          try {
            const [followings, followers, pictures] = await Promise.all([
              Follower?.find({ userId: userWithoutPassword?._id }),
              Follower?.find({ followerId: userWithoutPassword?._id }),
              Picture?.find({ userId: userWithoutPassword?._id }),
            ]);

            currentUser = {
              ...userWithoutPassword,
              profilePictures: pictures,
              followers: followers,
              followings: followings,
            };
          } catch (error) {
            currentUser = {};
          }

          return currentUser;
        })
      );

      return res?.status(200)?.json({
        users: allUsers,
        error: null,
        message: API_RESPONSES.GET_USERS_SUCCESS,
      });
    })
    .catch((error) =>
      res?.status(500)?.json({
        users: null,
        error: error,
        message: API_RESPONSES.GET_USERS_UNSUCCESS,
      })
    );
};

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     summary: Get user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to retrieve
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving the user."
 */

const getUserById = async (req, res) => {
  const userId = req?.params?.userId;
  Promise.all([
    Follower?.find({ userId: userId }),
    Follower?.find({ followerId: userId }),
    Picture?.find({ userId: userId }),
    User?.findById({ _id: userId }),
  ])
    .then((result) => {
      const followings = result[0];
      const followers = result[1];
      const pictures = result[2];
      const { password, ...userWithoutPassword } = result[3]?.toObject();

      const currentUser = {
        ...userWithoutPassword,
        profilePictures: pictures,
        followers: followers,
        followings: followings,
      };

      return res?.status(200)?.json({
        user: currentUser,
        error: null,
        message: API_RESPONSES.GET_USER_SUCCESS,
      });
    })
    .catch((error) =>
      res?.status(500)?.json({
        user: null,
        error: error,
        message: API_RESPONSES.GET_USER_UNSUCCESS,
      })
    );
};

/**
 * @swagger
 * /api/users/{userId}/followers:
 *   get:
 *     summary: Get followers of a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to get followers for
 *     responses:
 *       200:
 *         description: Followers retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followers:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Followers retrieved successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followers:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving followers."
 */

const getFollowers = async (req, res) => {
  const userId = req.params.userId;

  try {
    const followers = await Follower.find({ followerId: userId });

    const allFollowers = await Promise.all(
      followers.map(async (follower) => {
        const [pictures, user] = await Promise.all([
          Picture.findOne({ userId: follower.userId }),
          User.findById(follower.userId),
        ]);

        const { password, ...userWithoutPassword } = user.toObject();

        if (user) {
          return {
            ...userWithoutPassword,
            profilePicture: pictures,
          };
        }
        return null;
      })
    );

    const filteredFollowers = allFollowers.filter(
      (follower) => follower !== null
    );

    return res.status(200).json({
      followers: filteredFollowers,
      error: null,
      message: API_RESPONSES.GET_FOLLOWERS_SUCCESS,
    });
  } catch (error) {
    return res.status(500).json({
      user: null,
      error: error.message,
      message: API_RESPONSES.GET_FOLLOWERS_UNSUCCESS,
    });
  }
};

/**
 * @swagger
 * /api/users/{userId}/followings:
 *   get:
 *     summary: Get followings of a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to get followings for
 *     responses:
 *       200:
 *         description: Followings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followings:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Followings retrieved successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followings:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving followings."
 */

const getFollowings = async (req, res) => {
  const userId = req.params.userId;

  try {
    const followers = await Follower.find({ userId: userId });

    const allFollowers = await Promise.all(
      followers.map(async (follower) => {
        const [pictures, user] = await Promise.all([
          Picture.findOne({ userId: follower.followerId }),
          User.findById(follower.followerId),
        ]);

        const { password, ...userWithoutPassword } = user.toObject();

        if (user) {
          return {
            ...userWithoutPassword,
            profilePicture: pictures,
          };
        }
        return null;
      })
    );

    const filteredFollowers = allFollowers.filter(
      (follower) => follower !== null
    );

    return res.status(200).json({
      followings: filteredFollowers,
      error: null,
      message: API_RESPONSES.GET_FOLLOWINGS_SUCCESS,
    });
  } catch (error) {
    return res.status(500).json({
      user: null,
      error: error.message,
      message: API_RESPONSES.GET_FOLLOWINGS_UNSUCCESS,
    });
  }
};

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Add a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               profileImage:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while creating the user."
 */

const addUser = async (req, res) => {
  const body = req?.body;
  const profileImage = req?.file;
  const password = body?.password;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  return await User?.create({
    firstName: body?.firstName,
    lastName: body?.lastName,
    email: body?.email,
    gender: body?.gender?.toLowerCase(),
    password: hashedPassword,
  })
    .then((user) => {
      if (profileImage) {
        return Picture?.create({
          picture: profileImage,
          userId: user?._id,
        })
          .then((picture) => {
            const { password, ...userWithoutPassword } = user?.toObject();
            const createdUser = {
              ...userWithoutPassword,
              profilePictures: picture?.toObject(),
            };
            return res?.status(201)?.json({
              user: createdUser,
              error: null,
              message: API_RESPONSES.ADD_USER_SUCCESS,
            });
          })
          .catch((error) =>
            res?.status(500)?.json({
              user: null,
              error: error,
              message: API_RESPONSES.ADD_PROFILE_PICTURE_UNSUCCESS,
            })
          );
      }

      return res?.status(201)?.json({
        user: user,
        error: null,
        message: API_RESPONSES.ADD_USER_SUCCESS,
      });
    })
    .catch((error) =>
      res?.status(500)?.json({
        user: null,
        error: error,
        message: API_RESPONSES.ADD_USER_UNSUCCESS,
      })
    );
};

/**
 * @swagger
 * /api/users/{userId}:
 *   put:
 *     summary: Update user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               gender:
 *                 type: string
 *               jobTitle:
 *                 type: string
 *               relationshipStatus:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               country:
 *                 type: string
 *               phone:
 *                 type: object
 *                 properties:
 *                   areaCode:
 *                     type: string
 *                   number:
 *                     type: string
 *               aboutMe:
 *                 type: string
 *     responses:
 *       201:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the user."
 */

const updateUserById = async (req, res) => {
  const { userId } = req?.params;
  const body = req?.body;

  const user = {
    firstName: body?.firstName,
    lastName: body?.lastName,
    email: body?.email,
    gender: body?.gender,
    jobTitle: body?.jobTitle,
    relationshipStatus: body?.relationshipStatus,
    city: body?.city,
    state: body?.state,
    country: body?.country,
    phone: { areaCode: body?.phone?.areaCode, number: body?.phone?.number },
    aboutMe: body?.aboutMe,
  };

  User?.findByIdAndUpdate({ _id: userId }, user)
    .then((updatedUser) => {
      const { password, ...userWithoutPassword } = updatedUser?.toObject();
      return res?.status(201)?.json({
        user: userWithoutPassword,
        error: null,
        message: API_RESPONSES.UPDATE_USER_SUCCESS,
      });
    })
    .catch((error) =>
      res?.status(500)?.json({
        user: null,
        error: error,
        message: API_RESPONSES.UPDATE_USER_UNSUCCESS,
      })
    );
};

/**
 * @swagger
 * /api/users/{userId}/follow:
 *   put:
 *     summary: Follow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user who is following
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to follow
 *     responses:
 *       200:
 *         description: User followed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 follower:
 *                   $ref: '#/components/schemas/Follower'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "User followed successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while following the user."
 */

const followUser = async (req, res) => {
  const userId = req?.params?.userId;
  const userIdToFollow = req?.body?.userId;

  Follower.create({
    userId: userId,
    followerId: userIdToFollow,
  })
    .then((follower) =>
      res?.status(200)?.json({
        follower: follower,
        error: null,
        message: API_RESPONSES.FOLLOW_USER_SUCCESS,
      })
    )
    .catch((error) =>
      res?.status(500)?.json({
        user: null,
        error: error,
        message: API_RESPONSES.FOLLOW_USER_UNSUCCESS,
      })
    );
};

/**
 * @swagger
 * /api/users/{userId}/unfollow:
 *   put:
 *     summary: Unfollow a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the user who is unfollowing
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user to unfollow
 *     responses:
 *       200:
 *         description: User unfollowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "User unfollowed successfully"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 message:
 *                   type: string
 *                   example: "An error occurred while unfollowing the user."
 */

const unfollowUser = async (req, res) => {
  const userId = req?.params?.userId;
  const userIdToUnfollow = req?.body?.userId;

  Follower.deleteOne({ followerId: userIdToUnfollow, userId: userId })
    .then((user) =>
      res?.status(200)?.json({
        user: user,
        error: null,
        message: API_RESPONSES.UNFOLLOW_USER_SUCCESS,
      })
    )
    .catch((error) =>
      res?.status(500)?.json({
        user: null,
        error: error,
        message: API_RESPONSES.UNFOLLOW_USER_UNSUCCESS,
      })
    );
};

export {
  getAllUsers,
  getUserById,
  getFollowers,
  getFollowings,
  addUser,
  getUsersBySearch,
  updateUserById,
  followUser,
  unfollowUser,
};
