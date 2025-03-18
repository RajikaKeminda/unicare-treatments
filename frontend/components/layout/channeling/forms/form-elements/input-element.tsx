"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { channel, channelKey } from "@/helpers/validation/channel-schema";
import { HTMLInputTypeAttribute, JSX } from "react";

export default function InputElement({
  form,
  fieldName,
  fieldType,
  placeholder,
  label,
  icon,
}: {
  form: channel;
  fieldName: channelKey;
  fieldType: HTMLInputTypeAttribute;
  label: string;
  placeholder: string;
  icon?: JSX.Element;
}) {
  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-700 font-medium flex items-center gap-2 min-h-[20px]">
            {icon && icon} {label}
          </FormLabel>
          <FormControl>
            <Input
              type={fieldType}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-300"
              placeholder={placeholder}
              {...field}
              value={
                field.value instanceof Date
                  ? field.value.toISOString()
                  : field.value
              }
              {...(fieldType === "date" && {
                min: "1900-01-01",
                max: new Date().toISOString().split("T")[0],
              })}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
