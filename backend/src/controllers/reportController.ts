import HttpStatusCodes from "../util/statusCodes.ts";
import reportService from "../services/reportService.ts";
import { handleError } from "../util/errorHandler.ts";
import { Response, Request } from "express";

export const getAllReports = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { patientId } = req.params;
    const reports = await reportService.getPatientReport(patientId);
    res.status(HttpStatusCodes.OK).json({
      success: true,
      reports,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const createReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { patientId } = req.params;
    const { images } = req.body;
    const reports = await reportService.addReportToPatient(patientId, images);
    res.status(HttpStatusCodes.OK).json({
      success: true,
      reports,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const removeReport = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { patientId } = req.params;
    const { images } = req.body;
    const reports = await reportService.removeReportFromPatient(
      patientId,
      images
    );
    res.status(HttpStatusCodes.OK).json({
      success: true,
      reports,
    });
  } catch (error) {
    handleError(res, error);
  }
};
