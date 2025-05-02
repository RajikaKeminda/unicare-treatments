"use client";

import { Button } from "@/shadcn/ui/button";
import { toast } from "sonner";
import { ClipboardCopy } from "lucide-react";

const CopyToClipboard = ({
  value,
  text = "Copy Reference",
}: {
  value: string;
  text?: string;
}) => {
  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success(`Your Reference Number: ${value}`);
      }}
    >
      <ClipboardCopy className="w-4 h-4" />
      {text}
    </Button>
  );
};

export default CopyToClipboard;
