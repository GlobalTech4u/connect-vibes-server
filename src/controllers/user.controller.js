import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import Picture from "../models/picture.model.js";
import Follower from "../models/follower.model.js";
import { API_RESPONSES } from "../constants/api.constants.js";

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
          const user = userdoc?.toObject();
          let currentUser;
          try {
            const [followings, followers, pictures] = await Promise.all([
              Follower?.find({ userId: user?._id }),
              Follower?.find({ followerId: user?._id }),
              Picture?.find({ userId: user?._id }),
            ]);

            currentUser = {
              ...user,
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
      res?.status(400)?.json({
        users: null,
        error: error,
        message: API_RESPONSES.SEARCH_USERS_UNSUCCESS,
      })
    );
};

const getAllUsers = async (req, res) => {
  return await User?.find({})
    .then(async (users) => {
      const allUsers = await Promise.all(
        users?.map(async (userdoc) => {
          const user = userdoc?.toObject();
          let currentUser;
          try {
            const [followings, followers, pictures] = await Promise.all([
              Follower?.find({ userId: user?._id }),
              Follower?.find({ followerId: user?._id }),
              Picture?.find({ userId: user?._id }),
            ]);

            currentUser = {
              ...user,
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
      res?.status(400)?.json({
        users: null,
        error: error,
        message: API_RESPONSES.GET_USERS_UNSUCCESS,
      })
    );
};

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
      const user = result[3]?.toObject();

      const currentUser = {
        ...user,
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
      res?.status(400)?.json({
        user: null,
        error: error,
        message: API_RESPONSES.GET_USER_UNSUCCESS,
      })
    );
};

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

        if (user) {
          return {
            ...user.toObject(),
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
    return res.status(400).json({
      user: null,
      error: error.message,
      message: API_RESPONSES.GET_FOLLOWERS_UNSUCCESS,
    });
  }
};

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

        if (user) {
          return {
            ...user.toObject(),
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
    return res.status(400).json({
      user: null,
      error: error.message,
      message: API_RESPONSES.GET_FOLLOWINGS_UNSUCCESS,
    });
  }
};

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
            const createdUser = {
              ...user?.toObject(),
              profilePictures: picture?.toObject(),
            };
            return res?.status(201)?.json({
              user: createdUser,
              error: null,
              message: API_RESPONSES.ADD_USER_SUCCESS,
            });
          })
          .catch((error) =>
            res?.status(400)?.json({
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
      res?.status(400)?.json({
        user: null,
        error: error,
        message: API_RESPONSES.ADD_USER_UNSUCCESS,
      })
    );
};

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
      return res?.status(201)?.json({
        user: updatedUser,
        error: null,
        message: API_RESPONSES.UPDATE_USER_SUCCESS,
      });
    })
    .catch((error) =>
      res?.status(400)?.json({
        user: null,
        error: error,
        message: API_RESPONSES.UPDATE_USER_UNSUCCESS,
      })
    );
};

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
      res?.status(400)?.json({
        user: null,
        error: error,
        message: API_RESPONSES.FOLLOW_USER_UNSUCCESS,
      })
    );
};

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
      res?.status(400)?.json({
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
