import { IAppointment } from "@/types/appointment";
import { format } from "date-fns";

const getDateFormatted = (channelingDate: string) => {
  const formattedDate = format(new Date(`${channelingDate}`), "yyyy/MM/dd");
  return formattedDate;
};

export function generateReport(data: IAppointment[]) {
  // Define CSV headers based on appointment properties
  const headers = [
    "REF",
    "DATE",
    "TIME",
    "APPOINTMENT",
    "DOCTOR",
    "PAYMENT",
    "AMOUNT",
    "PAYMENT ID",
    "NAME",
    "EMAIL",
    "CONTACT",
    "PATIENT ID",
  ];

  // Convert appointment data to CSV rows
  const csvRows = data.map((appointment) => {
    return [
      appointment.referenceNumber,
      getDateFormatted(appointment.channelingDate),
      `Session : ${appointment.sessionNumber} ( ${appointment.startingTime} - ${appointment.endingTime} )`,
      appointment.appointmentStatus,
      appointment.doctorName,
      appointment.paymentStatus,
      `Rs. ${appointment.paymentAmount}`,
      appointment.paymentId,
      `${appointment.firstName} ${appointment.lastName}`,
      appointment.email,
      appointment.phoneNumber,
      appointment.patientId,
    ].join(",");
  });

  // Combine headers and rows
  const csvContent = [headers.join(","), ...csvRows].join("\n");

  // Create a Blob containing the CSV data
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });

  // Create a download URL
  const url = URL.createObjectURL(blob);
  return url;
}
