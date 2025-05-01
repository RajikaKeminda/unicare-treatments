import { Schema, model, Types } from "mongoose";

const AppointmentSchema = new Schema(
  {
    patientId: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
    channelingDate: {
      type: String,
      required: true,
    },
    sessionNumber: {
      type: Number,
      required: true,
    },
    startingTime: {
      type: String,
      required: true,
    },
    endingTime: {
      type: String,
      required: true,
    },
    paymentId: {
      type: String,
      default: "",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "confirmed"],
      default: "pending",
    },
    paymentAmount: {
      type: Number,
    },
    doctorName: {
      type: String,
      default: "Dumitha Govindapala",
    },
    appointmentStatus: {
      type: String,
      enum: ["waiting", "attending", "completed", "canceled", "no-show"],
      default: "waiting",
    },
  },
  {
    timestamps: true,
  }
);

const AppointmentModel = model("appointment", AppointmentSchema);
export default AppointmentModel;
