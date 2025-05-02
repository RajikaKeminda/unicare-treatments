import { MdOutlineBlock, MdOutlineCircle } from "react-icons/md";
import { FiCheckCircle } from "react-icons/fi";
import { cn } from "@/libs/utils";
import { Sessions } from "@/types/channeling";

const SessionDetails = ({
  sessionName,
  selectedSession,
  sessions,
  setSessions,
}: {
  sessionName: string;
  selectedSession: boolean;
  sessions?: Sessions;
  setSessions: () => void;
}) => {
  return (
    <div className="flex items-center gap-2">
      {sessions ? (
        <div
          className={cn(
            "mb-2 relative cursor-pointer px-2 py-3 border-2 rounded-md",
            selectedSession && "border-green-600 bg-green-600/10"
          )}
          onClick={setSessions}
        >
          <div className="flex items-center gap-2 font-semibold">
            {selectedSession ? (
              <FiCheckCircle className="text-green-900" />
            ) : (
              <MdOutlineCircle />
            )}
            <span>{sessionName}</span>
          </div>
          <div className="pl-6 text-sm flex flex-col pointer-events-none">
            <div>
              Number: <span className="font-bold">{sessions?.number}</span>
            </div>
            <div>
              Time Slot:{" "}
              <span className="rounded-full py-1 px-2 bg-green-900 text-white font-bold">
                {sessions?.start} - {sessions?.end}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mb-2 opacity-40 px-2 py-3 border-2 rounded-md w-full">
          <div className="flex items-center gap-2 font-semibold">
            <MdOutlineBlock />
            <span>{sessionName}</span>
          </div>
          <div className="pl-6 text-sm">
            <div>Not available</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionDetails;
