import mongoose from "mongoose";

const followingSchema = new mongoose.Schema(
  {
    userId: { type: String },
    followingUserId: { type: String },
  },
  { timestamps: true, collection: "followings" }
);

const Following = mongoose.model("following", followingSchema);

export default Following;
