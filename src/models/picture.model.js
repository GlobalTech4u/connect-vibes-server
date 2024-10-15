import mongoose from "mongoose";

const pictureSchema = new mongoose.Schema(
  {
    picture: {},
    userId: { type: String },
  },
  { timestamps: true, collection: "pictures" }
);

const Picture = mongoose.model("picture", pictureSchema);

export default Picture;
