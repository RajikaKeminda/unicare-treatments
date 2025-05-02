"use client";

import { use, useEffect, useRef, useState } from "react";
import { useCompletion } from "@ai-sdk/react";
import AppointmentReports from "@/channeling/widgets/appointment-reports";
import { IUser, UserApiResponse } from "@/types/users";
import { apiService } from "@/libs/api";
import { Loader2 } from "lucide-react";
import { cn } from "@/libs/utils";
import { FaHandPointRight } from "react-icons/fa";

type Params = Promise<{ slug: string }>;
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default function Page(props: {
  params: Params;
  searchParams: SearchParams;
}) {
  const { completion, handleSubmit, stop, setInput, isLoading, input } =
    useCompletion();
  const searchParams = use(props.searchParams);
  const patientId = searchParams?.patientId as string;
  const isMounted = useRef(false);
  const [user, setUser] = useState<IUser>();

  const [selectedReport, setSelectedReport] = useState("");

  useEffect(() => {
    if (input !== "") {
      handleSubmit();
    }
  }, [input]);

  useEffect(() => {
    const fetchUserAppointments = async () => {
      if (!isMounted.current) {
        isMounted.current = true;
        const response = await apiService.get<UserApiResponse>(
          `/users/${patientId}`
        );
        setUser(response.user);
      }
    };
    if (patientId) {
      fetchUserAppointments();
    }
  }, [patientId]);

  const formatText = (str: string) => {
    // const boldTextRegex = /\*\*([^*]+):\*\*/g;
    // const formattedText = str.replace(boldTextRegex, `<b>$1:</b>`);
    const boldTextRegex = /\*\*([^*]+)\*\*/g;
    const formattedText = str.replace(boldTextRegex, `<b>$1</b>`);

    if (formattedText.startsWith("- ")) {
      return (
        <div className="flex items-center gap-2">
          <FaHandPointRight className="text-black/90" />{" "}
          <span
            dangerouslySetInnerHTML={{
              __html: formattedText.replace(/^- /, ""),
            }}
          />
        </div>
      );
    }
    if (formattedText.startsWith("* ")) {
      return (
        <div className="flex gap-2">
          <FaHandPointRight className="text-black/90 flex-none mt-1" />{" "}
          <span
            dangerouslySetInnerHTML={{
              __html: formattedText.replace(/^\* /, ""),
            }}
          />
        </div>
      );
    }
    return <span dangerouslySetInnerHTML={{ __html: formattedText }} />;
  };

  const generateContent = (message: string) => {
    const messageContent = message.split("\n");
    return (
      <>
        {messageContent.map((line, i) => (
          <div
            key={`lines-${i + 1}`}
            className={cn(
              (line.includes("Important Note") ||
                line.includes("In summary") ||
                line.includes("It is important to note that")) &&
                "p-5 border-2 border-green-900 bg-green-900/5 text-green-900 rounded-xl"
            )}
          >
            {formatText(line)}
          </div>
        ))}
      </>
    );
  };

  return (
    <form className="flex flex-col gap-4 p-10 w-full" onSubmit={handleSubmit}>
      <AppointmentReports
        user={user}
        setReportImage={async (selectedReport) => {
          stop();
          setInput(selectedReport);
          setSelectedReport(selectedReport);
        }}
        selectedReport={selectedReport}
      />
      <div className="flex flex-col gap-2 p-10 border-2 border-dashed border-black leading-relaxed relative">
        <div className="ribbon bg-gray-300 text-black">Summary</div>
        {isLoading && (
          <div className="flex gap-2 w-full items-center justify-center">
            <Loader2 className="animate-spin" />
            AI is analyzing the report...
          </div>
        )}
        <div
          className={cn("whitespace-pre-wrap max-w-none flex flex-col gap-2")}
        >
          {generateContent(completion)}
        </div>

        {!isLoading && completion.length === 0 && (
          <div className="text-center text-gray-500">
            Create a new summary by clicking on the report
          </div>
        )}
      </div>
    </form>
  );
}
