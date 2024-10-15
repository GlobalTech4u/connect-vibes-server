import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, require: true },
    lastName: { type: String },
    email: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not supported",
      },
    },
    jobTitle: { type: String },
    relationshipStatus: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    phone: { areaCode: { type: String }, number: { type: String } },
    aboutMe: { type: String, maxLength: 500 },
  },
  { timestamps: true, collection: "users" }
);

const User = mongoose.model("user", userSchema);

export default User;
