import { resend } from "../util/resend.ts";
import AppointmentModel from "../models/appointmentModel.ts";
import ChannelingModel from "../models/channelingModel.ts";
import { IChanneling } from "../types/channeling.ts";

const getAll = async () => {
  const channeling = await ChannelingModel.find();
  return channeling;
};

const getActive = async (currentDate: string) => {
  const channeling = await ChannelingModel.find({
    channelingDate: { $gte: currentDate },
  }).select({
    channelingDate: 1,
    _id: 0,
  });
  return channeling;
};

const getByDate = async (channelingDate: string) => {
  const channeling = await ChannelingModel.findOne({
    channelingDate: channelingDate,
  });
  return channeling;
};

const create = async (channelingDate: string, channelingSlots: string[][]) => {
  const existingChanneling = await ChannelingModel.findOne({
    channelingDate: channelingDate,
  });
  if (existingChanneling) {
    const updatedChanneling = await ChannelingModel.findOneAndUpdate(
      { channelingDate: channelingDate },
      {
        $set: { channelingSlots: channelingSlots },
      },
      { new: true } // Return the updated document
    );
    return updatedChanneling;
  }
  const channeling = await ChannelingModel.create({
    channelingDate: channelingDate,
    channelingSlots: channelingSlots,
  });
  return channeling;
};

const updateChanneling = async (
  channelingDate: string,
  session: number,
  start: string,
  end: string,
  appointmentId: string,
  email: string
) => {
  const previousItem = await AppointmentModel.findOne({
    _id: appointmentId,
  });

  if (!previousItem) {
    throw new Error("Appointment not found");
  }

  const previousNr = +previousItem?.sessionNumber - 1;

  await ChannelingModel.findOneAndUpdate(
    {
      channelingDate: previousItem?.channelingDate,
      [`channelingSlots.${previousNr}.start`]: previousItem?.startingTime,
    },
    {
      $set: {
        [`channelingSlots.${previousNr}.$.appointmentId`]: "",
      },
    }
  );

  const newChanneling = await AppointmentModel.findOneAndUpdate(
    {
      _id: appointmentId,
    },
    {
      $set: {
        channelingDate: channelingDate,
        sessionNumber: session,
        startingTime: start,
        endingTime: end,
      },
    },
    {
      new: true,
    }
  );

  await ChannelingModel.findOneAndUpdate(
    {
      channelingDate: channelingDate,
      [`channelingSlots.${session - 1}.start`]: start,
    },
    {
      $set: {
        [`channelingSlots.${session - 1}.$.appointmentId`]: appointmentId,
      },
    }
  );
  if (email) {
    await resend.emails.send({
      from: "contact@duminda.net",
      to: email,
      subject: "Rescheduling Appointment",
      html: `
      <h1>Unicare Treatments</h1>
      <p>Your Appointment Is Rescheduled</p>
      <p><strong>Ref:</strong> ${appointmentId}</p>
      <p><strong>Date:</strong> ${channelingDate}</p>
      <p><strong>Time:</strong> Session ${session} (${start} - ${end})</p>
      <p><strong>Doctor:</strong> ${newChanneling?.doctorName}</p>
      `,
    });
  }

  return newChanneling;
};

const makeChanneling = async (channel: IChanneling) => {
  const newAppointment = new AppointmentModel({
    patientId: channel.patientId,
    channelingDate: channel.channelingDate,
    sessionNumber: channel.session,
    startingTime: channel.starting,
    endingTime: channel.ending,
    paymentAmount: channel.paymentAmount,
  });
  await newAppointment.save();
  const newChanneling = await ChannelingModel.findOneAndUpdate(
    {
      channelingDate: channel.channelingDate,
      [`channelingSlots.${channel.session - 1}.start`]: channel.starting,
    },
    {
      $set: {
        [`channelingSlots.${channel.session - 1}.$[elem].appointmentId`]:
          newAppointment._id,
      },
    },
    {
      arrayFilters: [{ "elem.start": channel.starting }],
      new: true, // Return the updated document
    }
  );

  return {
    appointment: newAppointment,
    channeling: newChanneling,
  };
};

export default {
  getAll,
  getActive,
  getByDate,
  create,
  makeChanneling,
  updateChanneling,
};
