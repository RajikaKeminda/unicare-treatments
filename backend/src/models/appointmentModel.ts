import { Schema, model, Types } from "mongoose";

/******************************************************************************
                                Schemas
******************************************************************************/

const AppointmentSchema = new Schema(
  {
    patientId: {
      type: String, //! Temp: this is type.ObjectId until Stores the patient's _id
      ref: "Patient", // References the Patient model
      required: false, // Changed to false to make it optional
    },
    referenceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: false,
      trim: true,
    },
    dateOfBirth: {
      type: Date,
      required: false,
    },
    gender: {
      type: String,
      required: false,
      enum: ["male", "female", "other"],
    },
    maritalState: {
      type: String,
      required: false,
      enum: ["married", "single", "widowed"],
    },
    phoneNumber: {
      type: String,
      required: true,
      minlength: 10,
    },
    alternativePhoneNumber: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    address: {
      type: String,
      required: false,
      minlength: 5,
    },
    appointmentDate: {
      type: Date,
      required: true,
    },
    paymentStatus: {
      type: String,
      required: true,
      enum: ["pay now", "pay later"],
      default: "pay later",
    },
  },
  {
    timestamps: true,
  }
);

/******************************************************************************
                                Export default
******************************************************************************/

const AppointmentModel = model("appointment", AppointmentSchema);
export default AppointmentModel;
