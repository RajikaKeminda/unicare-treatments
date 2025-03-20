"use client";

import {
  MultiFileDropzone,
  type FileState,
} from "@/channeling/uploads/multi-file-dropzone";
import { apiService } from "@/libs/api";
import { useEdgeStore } from "@/libs/edgestore";
import { ReportResponse } from "@/types/users";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IoDocumentsOutline } from "react-icons/io5";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { toast } from "sonner";
import { IoMdCloseCircle } from "react-icons/io";
import { ImImages } from "react-icons/im";

export default function UploadLabReports() {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();
  const { data: session } = useSession();
  const user = session?.user;
  const [reportList, setReportList] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [isDeleting, setIsDeleting] = useState(false);

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  const updateReport = async (url: string) => {
    try {
      if (user?.id) {
        const response = await apiService.post<ReportResponse>(
          `/reports/${user?.id}`,
          {
            images: url,
          }
        );
        if (response.success) {
          setReportList(response.reports);
          toast.success("Report uploaded successfully");
        } else {
          toast.error("Something went wrong,try again later");
        }
      }
    } catch {
      toast.error("Something went wrong,try again later");
    }
  };

  const deleteReport = async (url: string) => {
    try {
      setIsDeleting(true);
      if (user?.id) {
        const response = await apiService.put<ReportResponse>(
          `/reports/${user?.id}`,
          {
            images: url,
          }
        );
        if (response.success) {
          setReportList(response.reports);
          setSelectedImage("");
          toast.success("Report successfully deleted");
        } else {
          toast.error("Something went wrong,try again later");
        }
      }
    } catch {
      toast.error("Something went wrong,try again later");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      const getUserImages = async () => {
        const response = await apiService.get<ReportResponse>(
          `/reports/${user?.id}`
        );
        setReportList(response.reports);
      };
      getUserImages();
    }
  }, [user?.id]);

  return (
    <>
      <div className="bg-white py-5 px-10 min-h-svh">
        <div className="w-full">
          <Link href="/channeling" className="flex items-center gap-2">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
            Appointment Center
          </Link>
        </div>
        <div className="flex flex-col gap-4 justify-center items-center">
          <h1 className="text-2xl font-bold text-teal-900 text-center underline underline-offset-8 mt-8 flex items-center gap-2">
            Upload Your Lab Reports <IoDocumentsOutline />
          </h1>

          <p className="text-gray-600 text-center text-balance">
            Upload your lab reports here. <br />
            <b>JPG</b>, <b>PNG</b> or <b>Webp</b> upto <b>1MB</b> size accepted.
            If your image size is bigger, please compress it <br />
          </p>
          <MultiFileDropzone
            value={fileStates}
            onChange={(files) => {
              setFileStates(files);
            }}
            onFilesAdded={async (addedFiles) => {
              setFileStates([...fileStates, ...addedFiles]);
              await Promise.all(
                addedFiles.map(async (addedFileState) => {
                  try {
                    const res = await edgestore.publicFiles.upload({
                      file: addedFileState.file,
                      onProgressChange: async (progress) => {
                        updateFileProgress(addedFileState.key, progress);
                        if (progress === 100) {
                          // wait 1 second to set it to complete
                          // so that the user can see the progress bar at 100%
                          await new Promise((resolve) =>
                            setTimeout(resolve, 1000)
                          );
                          updateFileProgress(addedFileState.key, "COMPLETE");
                        }
                      },
                    });
                    updateReport(res.url);
                  } catch {
                    updateFileProgress(addedFileState.key, "ERROR");
                  }
                })
              );
            }}
          />
          <h1 className="text-2xl font-bold text-teal-900 text-center underline underline-offset-8 mt-2 mb-2 flex items-center gap-2">
            Recently Uploaded Lab Reports <ImImages />
          </h1>
          <div className="flex flex-wrap gap-2 justify-center mb-2">
            {reportList.map((report, index) => (
              <div
                key={`new-reports-${index + 1}`}
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
            ))}
            {reportList.length < 6 &&
              Array.from({ length: 6 - reportList.length }).map((_, index) => (
                <div
                  key={`empty-report-${index}`}
                  className="relative min-h-[120px] w-[100px] border-2 border-dashed border-gray-300 rounded-lg p-2 flex items-center justify-center"
                ></div>
              ))}
          </div>
        </div>
      </div>
      {selectedImage.trim().length > 0 && (
        <div className="fixed z-50 inset-0 flex items-center justify-center bg-white/50 backdrop-blur-sm">
          <div className="relative w-[60%] h-[80%] max-w-[800px] max-h-[800px] rounded-lg flex items-center justify-center border-black border-2 border-dashed">
            <button
              className="absolute top-2 right-2 text-black"
              onClick={() => setSelectedImage("")}
            >
              <IoMdCloseCircle className="w-[30px] h-[30px]" />
            </button>
            <div className="relative w-[90%] h-[90%]">
              <Image
                src={selectedImage}
                alt={`Report Image`}
                fill
                objectFit="contain"
              />
              <button
                className="absolute bottom-2 right-2 bg-red-500 text-white px-4 py-2 rounded-md flex items-center justify-center gap-2 min-w-[120px]"
                onClick={() => deleteReport(selectedImage)}
              >
                {isDeleting && <Loader2 className="animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
