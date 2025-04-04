import { Router } from "express";

import {
  createDoctorAppointment,
  createPatientAppointment,
  getAllByPatientId,
  getAllByDate,
  getAllAppointments,
  findByRefNo,
  getPatientIdByRefNo,
  rescheduleAppointmentByRefNo,
  deleteAppointmentByRefNo,
  deleteAllAppointmentsByDate,
  rescheduleAppointmentById,
} from "../controllers/appointmentController.ts";

const router = Router();

// /api/appointments/doctorAppointments
// /api/appointments/patientAppointments
// /api/appointments/patient/5678
// /api/appointments/date/2023-12-25
// /api/appointments/refNo/1504250001
// /api/appointments/patientIdByRefNo/1504250001
router.route("/reschedule/:id").post(rescheduleAppointmentById);
router
  .route("/doctorAppointments")
  .post(createDoctorAppointment)
  .get(getAllAppointments);

router.route("/patientAppointments").post(createPatientAppointment);

router.route("/patient/:patientId").get(getAllByPatientId);

router
  .route("/date/:date")
  .get(getAllByDate)
  .delete(deleteAllAppointmentsByDate);

router
  .route("/refNo/:refNo")
  .get(findByRefNo)
  .delete(deleteAppointmentByRefNo)
  .put(rescheduleAppointmentByRefNo);

router.route("/patientIdByRefNo/:refNo").get(getPatientIdByRefNo);

export default router;
