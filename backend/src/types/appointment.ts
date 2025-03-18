
/******************************************************************************
                                Types
******************************************************************************/

export interface IPatientAppointment {
  patientId?: string;
  firstName: string;
  lastName?: string;
  dateOfBirth: string;
  gender?: "male" | "female" | "prefer not to state";
  maritalState?: "married" | "single" | "widowed";
  phoneNumber: string;
  alternativePhoneNumber?: string;
  email?: string;
  address?: string;
  appointmentDate: string;
  paymentStatus?: "pay now" | "pay later";
}

export interface IDoctorAppointment {
  firstName: string;
  phoneNumber: string;
  appointmentDate: string;
}