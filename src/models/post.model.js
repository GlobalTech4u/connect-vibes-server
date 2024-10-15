import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    content: { type: String },
    userId: { type: String },
  },
  { timestamps: true, collection: "posts" }
);

const Post = mongoose.model("post", postSchema);

export default Post;
