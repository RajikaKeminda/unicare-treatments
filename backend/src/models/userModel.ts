import { Schema, model } from "mongoose";

const UserSchema = new Schema(
  {
    id: {
      type: String,
      required: true,
      trim: true,
      index: true, // Adding index
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      min: 0,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
    collection: "user"
  }
);

const UserModel = model("user", UserSchema);
export default UserModel;
