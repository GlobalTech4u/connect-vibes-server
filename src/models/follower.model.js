import mongoose from "mongoose";

const followerSchema = new mongoose.Schema(
  {
    userId: { type: String },
    followerId: { type: String },
  },
  { timestamps: true, collection: "followers" }
);

const Follower = mongoose.model("follower", followerSchema);

export default Follower;
