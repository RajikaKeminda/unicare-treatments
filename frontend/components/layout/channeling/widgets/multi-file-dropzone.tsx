"use client";

import { formatFileSize } from "@edgestore/react/utils";
import {
  CheckCircleIcon,
  LucideFileWarning,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import * as React from "react";
import { useDropzone, type DropzoneOptions } from "react-dropzone";
import { twMerge } from "tailwind-merge";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import Image from "next/image";

const variants = {
  base: "relative rounded-md p-4 w-full flex justify-center items-center flex-col cursor-pointer border border-dashed border-blue-600 dark:border-gray-300 transition-colors duration-200 ease-in-out bg-blue-100/5",
  active: "border-2",
  disabled:
    "bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700 dark:border-gray-600",
  accept: "border border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border border-red-700 bg-red-700 bg-opacity-10",
};

export type FileState = {
  file: File;
  key: string; // used to identify the file in the progress callback
  progress: "PENDING" | "COMPLETE" | "ERROR" | number;
  abortController?: AbortController;
};

type InputProps = {
  className?: string;
  value?: FileState[];
  onChange?: (files: FileState[]) => void | Promise<void>;
  onFilesAdded?: (addedFiles: FileState[]) => void | Promise<void>;
  disabled?: boolean;
  dropzoneOptions?: Omit<DropzoneOptions, "disabled">;
};

const formatAcceptedFileTypes = (
  accept?: DropzoneOptions["accept"]
): string => {
  if (!accept) return "";
  // Extract and format all extensions from the accept object
  const extensions = Object.entries(accept)
    .flatMap(([exts]) => {
      if (Array.isArray(exts)) return exts;
      return [];
    })
    .join(", ");
  return extensions || Object.keys(accept).join(", ");
};

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return "Invalid file type.";
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return "The file is not supported.";
  },
  acceptedFileTypes(types: string) {
    return `Accepted file types: ${types}`;
  },
};

const MultiFileDropzone = React.forwardRef<HTMLInputElement, InputProps>(
  (
    { dropzoneOptions, value, className, disabled, onFilesAdded, onChange },
    ref
  ) => {
    const [customError, setCustomError] = React.useState<string>();
    if (dropzoneOptions?.maxFiles && value?.length) {
      disabled = disabled ?? value.length >= dropzoneOptions.maxFiles;
    }
    // dropzone configuration
    const {
      getRootProps,
      getInputProps,
      fileRejections,
      isFocused,
      isDragAccept,
      isDragReject,
    } = useDropzone({
      disabled,
      onDrop: (acceptedFiles) => {
        const files = acceptedFiles;
        setCustomError(undefined);
        if (
          dropzoneOptions?.maxFiles &&
          (value?.length ?? 0) + files.length > dropzoneOptions.maxFiles
        ) {
          setCustomError(ERROR_MESSAGES.tooManyFiles(dropzoneOptions.maxFiles));
          return;
        }
        if (files) {
          const addedFiles = files.map<FileState>((file) => ({
            file,
            key: Math.random().toString(36).slice(2),
            progress: "PENDING",
          }));
          void onFilesAdded?.(addedFiles);
          void onChange?.([...(value ?? []), ...addedFiles]);
        }
      },
      ...dropzoneOptions,
    });

    // styling
    const dropZoneClassName = React.useMemo(
      () =>
        twMerge(
          variants.base,
          isFocused && variants.active,
          disabled && variants.disabled,
          (isDragReject ?? fileRejections[0]) && variants.reject,
          isDragAccept && variants.accept,
          className
        ).trim(),
      [
        isFocused,
        fileRejections,
        isDragAccept,
        isDragReject,
        disabled,
        className,
      ]
    );

    // error validation messages
    const errorMessage = React.useMemo(() => {
      if (fileRejections[0]) {
        const { errors } = fileRejections[0];
        if (errors[0]?.code === "file-too-large") {
          return ERROR_MESSAGES.fileTooLarge(dropzoneOptions?.maxSize ?? 0);
        } else if (errors[0]?.code === "file-invalid-type") {
          return ERROR_MESSAGES.fileInvalidType();
        } else if (errors[0]?.code === "too-many-files") {
          return ERROR_MESSAGES.tooManyFiles(dropzoneOptions?.maxFiles ?? 0);
        } else {
          return ERROR_MESSAGES.fileNotSupported();
        }
      }
      return undefined;
    }, [fileRejections, dropzoneOptions]);

    return (
      <div className="w-full">
        <div className="flex w-full flex-col gap-2">
          <div className="w-[80%] md:w-3/4 m-auto">
            {/* Main File Input */}
            <div
              {...getRootProps({
                className: dropZoneClassName,
              })}
            >
              <input ref={ref} {...getInputProps()} />
              <div className="flex flex-col items-center justify-center text-blue-600 min-h-[300px]">
                <div className="md:h-auto lg:h-[150px] md:w-auto lg:w-auto mb-2">
                  <DotLottieReact
                    src="/assets/images/download-icon.lottie"
                    loop
                    autoplay
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  Drop your file(s) here, or
                  <br />
                  <span className="font-semibold bg-teal-600 text-white rounded-md px-2 py-1">
                    Browse
                  </span>
                </div>
              </div>
              <div className="absolute bottom-3 right-0 translate-x-[61px] ">
                <Image
                  width={100}
                  height={10}
                  src="/assets/images/bear.png"
                  alt="drag-drop"
                  className="shrink-0"
                />
              </div>
            </div>

            {/* Error Text */}
            <div className="mt-1 text-xs text-red-500">
              {customError ?? errorMessage}
            </div>
            {/* Accepted File Types */}
            {dropzoneOptions?.accept && (
              <div className="mt-1 text-xs text-gray-500 text-center">
                {ERROR_MESSAGES.acceptedFileTypes(
                  formatAcceptedFileTypes(dropzoneOptions.accept)
                )}
              </div>
            )}
          </div>

          {/* Selected Files */}
          {value?.map(({ file, abortController, progress }, i) => (
            <div
              key={i}
              className="flex h-16 w-1/2 m-auto flex-col justify-center rounded border-2 border-dashed border-black/30  px-4 py-2"
            >
              <div className="flex items-center gap-2 text-gray-500 dark:text-white">
                <Image
                  width={30}
                  height={30}
                  src="/assets/images/file.png"
                  alt="file"
                  className="shrink-0"
                />
                <div className="min-w-0 text-sm">
                  <div className="overflow-hidden overflow-ellipsis whitespace-nowrap">
                    {file.name}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-400">
                    {formatFileSize(file.size)}
                  </div>
                </div>
                <div className="grow" />
                <div className="flex w-12 justify-end text-xs">
                  {progress === "PENDING" ? (
                    <button
                      type="button"
                      className="rounded-md p-1 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                      onClick={() => {
                        void onChange?.(
                          value.filter((_, index) => index !== i)
                        );
                      }}
                    >
                      <Trash2Icon className="shrink-0" />
                    </button>
                  ) : progress === "ERROR" ? (
                    <LucideFileWarning className="shrink-0 text-red-600 dark:text-red-400" />
                  ) : progress !== "COMPLETE" ? (
                    <div className="flex flex-col items-end gap-0.5">
                      {abortController && (
                        <button
                          type="button"
                          className="rounded-md p-0.5 transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-700"
                          disabled={progress === 100}
                          onClick={() => {
                            abortController.abort();
                          }}
                        >
                          <XIcon className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-400" />
                        </button>
                      )}
                      <div>{Math.round(progress)}%</div>
                    </div>
                  ) : (
                    <CheckCircleIcon className="shrink-0 text-green-700 dark:text-gray-400" />
                  )}
                </div>
              </div>
              {/* Progress Bar */}
              {typeof progress === "number" && (
                <div className="relative h-0">
                  <div className="absolute top-1 h-1 w-full overflow-clip rounded-full bg-gray-200 dark:bg-gray-700">
                    <div
                      className="h-full bg-green-600 transition-all duration-300 ease-in-out dark:bg-white"
                      style={{
                        width: progress ? `${progress}%` : "0%",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);
MultiFileDropzone.displayName = "MultiFileDropzone";

export { MultiFileDropzone };
