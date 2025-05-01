"use client";
import { useState } from "react";
import Image from "next/image";
import { IUser } from "@/types/users";
import PatientCard from "./patient-card";
import { IoMdCloseCircle } from "react-icons/io";
import { cn } from "@/libs/utils";

export default function AppointmentReports({
  user,
  setReportImage,
  selectedReport,
}: {
  user?: IUser;
  setReportImage: (image: string) => void;
  selectedReport: string;
}) {
  const [selectedImage, setSelectedImage] = useState<string>("");

  const reportList = user?.reports || [];
  const MAX_COUNT = 6;
  return (
    <>
      <div className="flex flex-wrap lg:flex-nowrap gap-4">
        <PatientCard user={user} />
        <div className="flex flex-col gap-4">
          <div>
            <div className="font-bold text-xl mb-2">Patients Lab Reports</div>
            <p className="text-balance">
              Click on the report to open an enlarged view for easier reading
              and analysis. When you&apos;re ready to create a new report, just
              click the &apos;<b>Generate Report</b>&apos; button.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 mb-2">
            {reportList.map((report, index) => (
              <div
                key={`new-reports-${index + 1}`}
                className="flex flex-col gap-2"
              >
                <div
                  className="w-[100px] relative border-2 border-dashed border-gray-300 rounded-lg p-2 flex items-center justify-center cursor-pointer"
                  onClick={() => {
                    setSelectedImage(report);
                  }}
                >
                  <Image
                    src={report}
                    alt={`Report ${index + 1}`}
                    width={100}
                    height={10}
                  />
                </div>
                <div
                  className={cn(
                    "py-0 px-4 rounded-full  cursor-pointer",
                    selectedReport === report
                      ? "bg-red-900 text-white"
                      : "bg-black text-white"
                  )}
                  onClick={() => {
                    setReportImage(report);
                  }}
                >
                  Report {index + 1}
                </div>
              </div>
            ))}
            {reportList.length < MAX_COUNT &&
              Array.from({ length: MAX_COUNT - reportList.length }).map(
                (_, index) => (
                  <div
                    key={`empty-report-${index}`}
                    className="relative min-h-[120px] w-[100px] border-2 border-dashed border-gray-300 rounded-lg p-2 flex items-center justify-center"
                  ></div>
                )
              )}
          </div>
        </div>
      </div>
      {selectedImage.trim().length > 0 && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="relative w-full h-full rounded-lg flex items-center justify-center ">
            <button
              className="absolute top-2 right-2 text-black z-10"
              onClick={() => setSelectedImage("")}
            >
              <IoMdCloseCircle className="w-[30px] h-[30px]" />
            </button>
            <div className="relative w-[99%] h-[99%]">
              <Image
                src={selectedImage}
                alt={`Report Image`}
                fill
                objectFit="contain"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
