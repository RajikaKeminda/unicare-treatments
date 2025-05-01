import { IAppointment } from "./appointment";
import { TApiResponse } from "./common";

export type SelectedSession = "first" | "second" | "third";

export type Sessions = {
  start: string;
  end: string;
  number: string;
};

export type TimeSlot = {
  start: string;
  end: string;
  isActive: boolean;
  appointmentId?: string;
};

export interface ChannelingResponse extends TApiResponse {
  channeling: {
    channelingDate: string;
    channelingSlots: TimeSlot[][];
  };
  dates?: string[];
  appointment?: IAppointment;
}

export interface ChannelingWithDates extends TApiResponse {
  dates: string[];
}

export type AppointmentDetails = {
  session: number;
  channelingDate: string;
  start?: string;
  end?: string;
  patientId?: string | null;
};
