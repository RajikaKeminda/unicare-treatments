import { IAppointment } from ".";

export interface IUser {
  id?: string;
  name?: string;
  username?: string;
  email?: string;
  profile_img?: string;
  isVerified?: boolean;
  role?: string;
}

export type userTypes = "doctor" | "admin" | "supplier" | "patient";

export interface TApiResponse {
  success: boolean;
  message: string;
  code?: number;
}

export interface UserApiResponse extends TApiResponse {
  user?: IUser;
}

export interface AppointmentResponse extends TApiResponse {
  appointments?: IAppointment[];
  appointment?: IAppointment;
}

export interface ReportResponse extends TApiResponse {
  reports: string[];
}
