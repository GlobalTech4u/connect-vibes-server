import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    content: { type: String },
    postId: { type: String },
  },
  { timestamps: true, collection: "comments" }
);

const Comment = mongoose.model("comment", commentSchema);

export default Comment;
