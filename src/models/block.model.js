import mongoose from "mongoose";

const blockSchema = new mongoose.Schema(
  {
    userId: { type: String },
    blockedUserId: { type: String },
  },
  { timestamps: true, collection: "blocks" }
);

const Block = mongoose.model("block", blockSchema);

export default Block;
