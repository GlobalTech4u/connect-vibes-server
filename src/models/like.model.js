import mongoose from "mongoose";

const likeSchema = new mongoose.Schema(
  {
    postId: { type: String },
    userId: { type: String },
  },
  { timestamps: true, collection: "likes" }
);

const Like = mongoose.model("like", likeSchema);

export default Like;
