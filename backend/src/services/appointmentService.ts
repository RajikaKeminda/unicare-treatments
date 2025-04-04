//! TODO: generate referance number
//! TODO: make createAppointmentByPatient function for the appointment booking page {this function used by patient to book}
//! TODO: make createAppointmentByAdmin function for appointment management page {this function used by admin to book}
//! TODO: make getAllByPatientId for the appointment view page {it returns all appointments for a  patient to the patient}
//! TODO: make getAllByDate returns all appointments for the particular date for the queue management panel
//! TODO: make getAll returns all the appointments may be for the
//! TODO: make findByRefNo function for the view my queue no page, may be for the admin
//! TODO: make getPatientIdByRefNo to get the patient id through ref no to give access to the vitals
//! TODO: make update/reschedule for view appoinment page
//! TODO: make delete for view appoinment page and appointment management page
//! TODO: make deleteAllByDate delete all appointment after a day

import {
  IPatientAppointment,
  IDoctorAppointment,
} from "../types/appointment.ts";
import AppointmentModel from "../models/appointmentModel.ts";

/******************************************************************************
                                Functions
******************************************************************************/

/**
 ** generate a custom appointment id. eg. 1203250001
 **/
const generateSequentialReference = async (
  appointmentDate: Date
): Promise<string> => {
  const day = String(appointmentDate.getDate()).padStart(2, "0");
  const month = String(appointmentDate.getMonth() + 1).padStart(2, "0");
  const year = String(appointmentDate.getFullYear()).slice(-2);

  // Note: fetch number of the records in the current date and increment it by one
  const count = await AppointmentModel.countDocuments({ appointmentDate });
  const sequentialNumber = String(count + 1).padStart(4, "0");

  return `${day}${month}${year}${sequentialNumber}`;
};

/**
 ** create appointment by patient.
 *! login is required
 **/
async function createAppointmentByPatient(appointment: IPatientAppointment) {
  try {
    // Note: reference number generation
    const appointmentDate = new Date(appointment.appointmentDate);
    const referenceNumber = await generateSequentialReference(appointmentDate);

    const newPatientAppointment = new AppointmentModel({
      referenceNumber,
      patientId: appointment.patientId,
      firstName: appointment.firstName,
      lastName: appointment.lastName,
      dateOfBirth: new Date(appointment.dateOfBirth),
      gender: appointment.gender,
      maritalState: appointment.maritalState,
      phoneNumber: appointment.phoneNumber,
      alternativePhoneNumber: appointment.alternativePhoneNumber,
      email: appointment.email,
      address: appointment.address,
      appointmentDate: appointmentDate,
      paymentStatus: appointment.paymentStatus,
    });

    await newPatientAppointment.save();
    return newPatientAppointment;
  } catch (error) {
    throw error;
  }
}

/**
 ** create appointment by admin.
 *! login is not required
 *! these records do not give the access to the vitals for the doctor
 **/
async function createAppointmentByDoctor(appointment: IDoctorAppointment) {
  try {
    // Note: reference number generation
    const appointmentDate = new Date(appointment.appointmentDate);
    const referenceNumber = await generateSequentialReference(appointmentDate);

    const newDoctorAppointment = new AppointmentModel({
      referenceNumber,
      firstName: appointment.firstName,
      phoneNumber: appointment.phoneNumber,
      appointmentDate: appointmentDate,
    });

    await newDoctorAppointment.save();
    return newDoctorAppointment;
  } catch (error) {
    throw error;
  }
}

/**
 ** returns list of all the appointments made by a particular patient
 *! login is required
 **/
async function getAllByPatientId(patientId: string) {
  const appointment = await AppointmentModel.find({ patientId });
  return appointment;
}

/**
 ** returns list of all the appointments made in a particular date
 *! login is not required
 **/
async function getAllByDate(date: string | Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0); // Start of the day

  const end = new Date(date);
  end.setHours(23, 59, 59, 999); // End of the day

  return await AppointmentModel.find({
    appointmentDate: { $gte: start, $lte: end },
  });
}

/**
 ** returns list of all the appointments
 *! login is not required
 **/
async function getAllAppointments() {
  const allAppointments = await AppointmentModel.find();
  return allAppointments;
}

/**
 ** returns a single appointment for view queue no page used by patient
 *! login is not required
 **/
async function findByRefNo(referenceNumber: string) {
  return await AppointmentModel.findOne({ referenceNumber });
}

/**
 ** returns the patient id for a appointment used by doctor to fetch date for vitals
 *! login is not required
 *! if patientId == null ? no access for the vitals
 **/
async function getPatientIdByRefNo(referenceNumber: string) {
  const appointment = await AppointmentModel.findOne({
    referenceNumber,
  }).select("patientId");
  return appointment?.patientId || "user not found";
}

async function rescheduleAppointmentById(id: string, appointmentDate: Date) {
  const updatedAppointment = await AppointmentModel.findOneAndUpdate(
    { _id: id },
    { appointmentDate: appointmentDate },
    { new: true }
  );
  return updatedAppointment;
}

/**
 ** /updatereschedule appointment by patient.
 *! login is not required
 *! date is the only thing that can be changed if the due date is one week ahead
 **/
async function rescheduleAppointmentByRefNo({
  referenceNumber,
  appointment,
}: {
  referenceNumber: string;
  appointment: IPatientAppointment;
}) {
  try {
    // Note: reference number generation
    const appointmentDate = new Date(appointment.appointmentDate);
    const referenceNumber = await generateSequentialReference(appointmentDate);

    const updatedAppointment = await AppointmentModel.findOneAndUpdate(
      { referenceNumber }, // Find appointment by refNo
      {
        firstName: appointment.firstName,
        lastName: appointment.lastName,
        dateOfBirth: new Date(appointment.dateOfBirth),
        gender: appointment.gender,
        maritalState: appointment.maritalState,
        phoneNumber: appointment.phoneNumber,
        alternativePhoneNumber: appointment.alternativePhoneNumber,
        email: appointment.email,
        address: appointment.address,
        appointmentDate: appointmentDate,
        paymentStatus: appointment.paymentStatus,
      },
      { new: true } // Return the updated document
    );

    if (!updatedAppointment) {
      throw new Error("Appointment not found for rescheduling.");
    }

    return updatedAppointment;
  } catch (error) {
    console.error("Error in createAppointmentByPatient:", error);
    throw error;
  }
}

/**
 ** deletes an appointment using referance no
 *! login is required
 **/
async function deleteByRefNo(referenceNumber: string) {
  const deletedAppointment = await AppointmentModel.findOneAndDelete({
    referenceNumber,
  });
  return deletedAppointment;
}

/**
 ** delete all the appointments related to a specific date
 *! login is not required
 *! at the end of the day all records should be deleted
 **/
async function deleteAllByDate(date: string | Date) {
  const start = new Date(date);
  start.setHours(0, 0, 0, 0); // Start of the day

  const end = new Date(date);
  end.setHours(23, 59, 59, 999); // End of the day

  return await AppointmentModel.deleteMany({
    appointmentDate: { $gte: start, $lte: end },
  });
}

/******************************************************************************
                                Export default
******************************************************************************/

export default {
  rescheduleAppointmentById,
  generateSequentialReference,
  createAppointmentByPatient,
  createAppointmentByDoctor,

  getAllByPatientId,
  getAllByDate,
  getAllAppointments,
  findByRefNo,
  getPatientIdByRefNo,

  rescheduleAppointmentByRefNo,

  deleteByRefNo,
  deleteAllByDate,
};
