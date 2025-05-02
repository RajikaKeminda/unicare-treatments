import { TApiResponse } from "./common";

export type TAppointmentStatus =
  | "waiting"
  | "attending"
  | "completed"
  | "canceled"
  | "no-show";

export type TPaymentStatus = "pending" | "completed" | "cancelled";

export interface IAppointment {
  _id: string;
  patientId: string;
  channelingDate: string;
  sessionNumber: number;
  startingTime: string;
  endingTime: string;
  paymentId: string;
  paymentStatus: TPaymentStatus;
  doctorName: string;
  appointmentStatus: TAppointmentStatus;
  paymentAmount: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  referenceNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AppointmentResponse extends TApiResponse {
  appointments?: IAppointment[];
  appointment?: IAppointment;
}
