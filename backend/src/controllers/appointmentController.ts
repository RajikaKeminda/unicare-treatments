import AppointmentModel from "../models/appointmentModel.ts";
import appointmentService from "../services/appointmentService.ts";
import createAppointmentByDoctor from "../services/appointmentService.ts";
import { Response, Request } from "express";
import HttpStatusCodes from "../util/statusCodes.ts";
import { handleError } from "../util/errorHandler.ts";

/******************************************************************************
                                POST
******************************************************************************/

export const createPatientAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  const data = req.body;
  try {
    const newAppointment = await appointmentService.createAppointmentByPatient({
      patientId: data.patientId,
      firstName: data.firstName,
      lastName: data.lastName,
      dateOfBirth: data.dateOfBirth,
      gender: data.gender,
      maritalState: data.maritalState,
      phoneNumber: data.phoneNumber,
      alternativePhoneNumber: data.alternativePhoneNumber,
      email: data.email,
      address: data.address,
      appointmentDate: data.appointmentDate,
      paymentStatus: data.paymentStatus,
    });

    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      appointment: newAppointment,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const createDoctorAppointment = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const newAppointment = await appointmentService.createAppointmentByDoctor({
      firstName: req.body.firstName,
      phoneNumber: req.body.phoneNumber,
      appointmentDate: req.body.appointmentDate,
    });

    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      appointment: newAppointment,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/******************************************************************************
                                GET_ALL
******************************************************************************/

// Get all appointments by patient ID
export const getAllByPatientId = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { patientId } = req.params;
    const appointments = await appointmentService.getAllByPatientId(patientId);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      appointments,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all appointments for a specific date
export const getAllByDate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { date } = req.params;
    const appointments = await appointmentService.getAllByDate(date);

    res.status(HttpStatusCodes.OK).json({
      success: true,
      appointments,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get all appointments
export const getAllAppointments = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const appointments = await appointmentService.getAllAppointments();

    res.status(HttpStatusCodes.OK).json({
      success: true,
      appointments,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/******************************************************************************
                                GET
******************************************************************************/

// Find an appointment by reference number
export const findByRefNo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refNo } = req.params;
    const appointment = await appointmentService.findByRefNo(refNo);

    if (!appointment) {
      res.status(HttpStatusCodes.NOT_FOUND).json({
        success: false,
        message: "Appointment not found.",
      });
      return;
    }

    res.status(HttpStatusCodes.OK).json({
      success: true,
      appointment,
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Get patient ID by reference number
export const getPatientIdByRefNo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refNo } = req.params;
    const patientId = await appointmentService.getPatientIdByRefNo(refNo);

    if (!patientId) {
      res.status(HttpStatusCodes.FORBIDDEN).json({
        success: false,
        message: "No access to vitals.",
      });
      return;
    }

    res.status(HttpStatusCodes.OK).json({
      success: true,
      patientId,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/******************************************************************************
                                UPDATE
******************************************************************************/

export const rescheduleAppointmentByRefNo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    //! Take patient Id from the session
    //const patientId = req.user.id;

    const { referenceNumber } = req.params;

    const updatedAppointment =
      await appointmentService.rescheduleAppointmentByRefNo({
        referenceNumber,
        appointment: {
          patientId: req.body.patientId,
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          dateOfBirth: req.body.dateOfBirth,
          gender: req.body.gender,
          maritalState: req.body.maritalState,
          phoneNumber: req.body.phoneNumber,
          alternativePhoneNumber: req.body.alternativePhoneNumber,
          email: req.body.email,
          address: req.body.address,
          appointmentDate: req.body.appointmentDate,
          paymentStatus: req.body.paymentStatus,
        },
      });

    if (!updatedAppointment) {
      res.status(HttpStatusCodes.NOT_FOUND).json({
        success: false,
        message: "Appointment not found or could not be rescheduled.",
      });
      return;
    }

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Appointment successfully rescheduled.",
      updatedAppointment,
    });
  } catch (error) {
    handleError(res, error);
  }
};

/******************************************************************************
                                DELETE
******************************************************************************/

// Delete appointment by reference number
export const deleteAppointmentByRefNo = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { refNo } = req.params;
    const deletedAppointment = await appointmentService.deleteByRefNo(refNo);
    if (!deletedAppointment) {
      res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ success: true, message: "Appointment not found." });
      return;
    }
    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Appointment deleted successfully.",
    });
  } catch (error) {
    handleError(res, error);
  }
};

// Delete all appointments by date
export const deleteAllAppointmentsByDate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { date } = req.params;
    const deletedAppointments = await appointmentService.deleteAllByDate(date);
    if (!deletedAppointments) {
      res.status(HttpStatusCodes.NOT_FOUND).json({
        success: true,
        message: "Appointments not found for the required date.",
      });
      return;
    }
    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Appointments deleted successfully.",
    });
  } catch (error) {
    handleError(res, error);
  }
};
