import channelingService from "../services/channelingService.ts";
import { handleError } from "../util/errorHandler.ts";
import HttpStatusCodes from "../util/statusCodes.ts";
import { Response, Request } from "express";

export const getChanneling = async (
  _: Request,
  res: Response
): Promise<void> => {
  try {
    const channeling = await channelingService.getAll();
    res.status(HttpStatusCodes.OK).json({
      success: true,
      channeling,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getActiveChanneling = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { currentDate } = req.params;
    const channeling = await channelingService.getActive(currentDate);
    let dates: string[] = [];
    if (channeling) {
      dates = channeling.map((date) => date.channelingDate);
    }
    res.status(HttpStatusCodes.OK).json({
      success: true,
      dates,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const getChannelingByDate = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { channelingDate } = req.params;
    const channeling = await channelingService.getByDate(channelingDate);
    res.status(HttpStatusCodes.OK).json({
      success: true,
      channeling,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const createChanneling = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;
    const channeling = await channelingService.create(
      data.channelingDate,
      data.channelingSlots
    );
    const allActive = await channelingService.getActive(data.currentDate);
    let dates: string[] = [];
    if (allActive) {
      dates = allActive.map((date) => date.channelingDate);
    }
    res.status(HttpStatusCodes.OK).json({
      success: true,
      channeling,
      dates,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const makeChanneling = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;
    const newData = await channelingService.makeChanneling({
      session: data.session,
      channelingDate: data.channelingDate,
      starting: data.start,
      ending: data.end,
      patientId: data.patientId,
      paymentAmount: data.paymentAmount,
    });
    res.status(HttpStatusCodes.OK).json({
      success: true,
      channeling: newData.channeling,
      appointment: newData.appointment,
    });
  } catch (error) {
    handleError(res, error);
  }
};

export const updateChanneling = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = req.body;
    const channeling = await channelingService.updateChanneling(
      data.channelingDate,
      data.session,
      data.start,
      data.end,
      data.appointmentId,
      data.email
    );
    res.status(HttpStatusCodes.OK).json({
      success: true,
      channeling,
    });
  } catch (error) {
    handleError(res, error);
  }
};
