import { Dispatch, SetStateAction } from "react";
import { format } from "date-fns";
import { IoTime } from "react-icons/io5";
import type { Sessions } from "@/types/channeling";
import SessionDetails from "@/channeling/widgets/session-details";

type SessionType = "first" | "second" | "third" | undefined;
type SetSessionActions = Dispatch<SetStateAction<SessionType>>;

const PatientCalender = ({
  date,
  sessions,
  selectedSession,
  setSelectedSession,
}: {
  date: Date | null;
  selectedSession?: SessionType;
  setSelectedSession: SetSessionActions;
  sessions: {
    firstSession?: Sessions;
    secondSession?: Sessions;
    thirdSession?: Sessions;
  };
}) => {
  return (
    <div className="flex flex-col rounded-xl border-2 border-black bg-black flex-none min-w-[250px] min-h-[330px]">
      {date && (
        <div className="flex justify-center items-center gap-1 px-1.5 py-0.5 uppercase text-white text-center">
          <span>{date && format(date, "do")}</span>
          <span>{date && format(date, "LLLL")}</span>
          <span>{date && format(date, "yyyy")}</span>
        </div>
      )}
      {date ? (
        <div className="bg-white py-2 px-4 text-black rounded-xl flex-auto">
          <div className="font-bold flex items-center gap-2 pb-1 mb-1">
            <IoTime />
            Available Times
          </div>
          {SessionDetails({
            sessionName: "First Session",
            selectedSession: selectedSession === "first",
            sessions: sessions?.firstSession,
            setSessions: () => {
              setSelectedSession("first");
            },
          })}
          {SessionDetails({
            sessionName: "Second Session",
            selectedSession: selectedSession === "second",
            sessions: sessions?.secondSession,
            setSessions: () => {
              setSelectedSession("second");
            },
          })}
          {SessionDetails({
            sessionName: "Third Session",
            selectedSession: selectedSession === "third",
            sessions: sessions?.thirdSession,
            setSessions: () => {
              setSelectedSession("third");
            },
          })}
        </div>
      ) : (
        <div className="bg-white p-5 text-black rounded-xl flex-auto flex items-center justify-center">
          Please Select a Date First
        </div>
      )}
    </div>
  );
};

export default PatientCalender;
