import bcrypt from "bcrypt";

import User from "../models/user.model.js";
import Follower from "../models/follower.model.js";
import Picture from "../models/picture.model.js";
import { generateToken } from "../helpers/jwt.helper.js";
import { API_RESPONSES } from "../constants/api.constants.js";

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The user's email
 *               password:
 *                 type: string
 *                 description: The user's password
 *     responses:
 *       200:
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   allOf:
 *                     - $ref: '#/components/schemas/User'
 *                   type: object
 *                   properties:
 *                     profilePictures:
 *                       type: array
 *                       items:
 *                         type: object
 *                     followers:
 *                       type: array
 *                       items:
 *                         type: object
 *                     followings:
 *                       type: array
 *                       items:
 *                         type: object
 *                     token:
 *                       type: string
 *                     refreshToken:
 *                       type: string
 *                 error:
 *                   type: string
 *                   example: null
 *                 message:
 *                   type: string
 *                   example: "Login successful"
 *       400:
 *         description: Invalid credentials or internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: null
 *                   example: null
 *                 error:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Invalid credentials"
 */

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

  const { accessToken, refreshToken } = generateToken(user?.id);

  Promise.all([
    Follower?.find({ userId: user?._id }),
    Follower?.find({ followerId: user?._id }),
    Picture?.find({ userId: user?._id }),
  ])
    .then((result) => {
      const followings = result[0];
      const followers = result[1];
      const pictures = result[2];

      const { password, ...userWithoutPassword } = user.toObject();

      const currentUser = {
        ...userWithoutPassword,
        profilePictures: pictures,
        followers: followers,
        followings: followings,
        token: accessToken,
        refreshToken: refreshToken,
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
