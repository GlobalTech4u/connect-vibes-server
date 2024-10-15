import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import Follower from "../models/follower.model.js";
import Picture from "../models/picture.model.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { API_RESPONSES } from "../constants/api.constants.js";

const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res?.status(400)?.json({
      user: null,
      error: true,
      message: API_RESPONSES.INVALID_CREDENTIALS,
    });

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword)
    return res?.status(400)?.json({
      user: null,
      error: true,
      message: API_RESPONSES.INVALID_CREDENTIALS,
    });

  const token = generateToken(user?.id);

  Promise.all([
    Follower?.find({ userId: user?._id }),
    Follower?.find({ followerId: user?._id }),
    Picture?.find({ userId: user?._id }),
  ])
    .then((result) => {
      const followings = result[0];
      const followers = result[1];
      const pictures = result[2];

      const currentUser = {
        ...user.toObject(),
        profilePictures: pictures,
        followers: followers,
        followings: followings,
        token: token,
      };

      return res?.status(200)?.json({
        user: currentUser,
        error: null,
        message: API_RESPONSES.LOGIN_SUCCESS,
      });
    })
    .catch((error) =>
      res?.status(400)?.json({
        user: null,
        error: error,
        message: API_RESPONSES.LOGIN_UNSUCCESS,
      })
    );
};

export { loginUser };
