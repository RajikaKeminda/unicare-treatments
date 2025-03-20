import userModel from "../models/userModel.ts";

async function getPatientReport(patientId: string) {
  const data = await userModel
    .find({
      _id: patientId,
    })
    .select("reports");
  return data.length > 0 ? data[0].reports : [];
}

async function addReportToPatient(patientId: string, images: string) {
  const updatedUser = await userModel.findOneAndUpdate(
    { _id: patientId }, // Filter to find the user by patientId
    { $push: { reports: images } }, // Push the new report into the 'reports' array
    { new: true } // Return the updated document
  );
  return updatedUser ? updatedUser.reports : [];
}

async function removeReportFromPatient(patientId: string, images: string) {
  const updatedUser = await userModel.findOneAndUpdate(
    { _id: patientId }, // Filter to find the user by patientId
    { $pull: { reports: images } }, // Pull the report from the 'reports' array
    { new: true } // Return the updated document
  );
  return updatedUser ? updatedUser.reports : [];
}

export default {
  getPatientReport,
  addReportToPatient,
  removeReportFromPatient,
};
