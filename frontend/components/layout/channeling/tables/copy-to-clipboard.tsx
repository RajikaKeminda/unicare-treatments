"use client";

import { Button } from "@/shadcn/ui/button";
import { toast } from "sonner";
import { ClipboardCopy } from "lucide-react";

const CopyToClipboard = ({ value }: { value: string }) => {
  return (
    <Button
      onClick={() => {
        navigator.clipboard.writeText(value);
        toast.success(`Your Reference Number: ${value}`);
      }}
      className="bg-green-600 hover:bg-green-800"
    >
      <ClipboardCopy className="w-4 h-4" />
      Copy Reference
    </Button>
  );
};

export default CopyToClipboard;
