import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema(
  {
    attachment: {},
    postId: { type: String },
  },
  { timestamps: true, collection: "attachments" }
);

const Attachment = mongoose.model("attachment", attachmentSchema);

export default Attachment;
