import { Schema, model, Types } from "mongoose";

const SlotSchema = new Schema(
  {
    start: {
      type: String,
      required: true,
    },
    end: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    appointmentId: {
      type: String,
      default: "",
    },
  },
  { _id: false }
);

const ChannelingSchema = new Schema(
  {
    channelingDate: {
      type: String,
      required: true,
      unique: true,
    },
    channelingSlots: {
      type: [[SlotSchema]],
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ChannelingModel = model("channeling", ChannelingSchema);

export default ChannelingModel;
