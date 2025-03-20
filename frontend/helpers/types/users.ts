import { IAppointment } from ".";

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  verified: boolean;
  isVerified: boolean;
}

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
