import { channel, channelKey } from "@/helpers/validation/channel-schema";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import {
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/shadcn/ui/select";
import { JSX } from "react";

export default function SelectElement({
  form,
  children,
  fieldName,
  label,
  icon,
}: {
  form: channel;
  children: React.ReactNode;
  fieldName: channelKey;
  label: string;
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
          <Select
            onValueChange={field.onChange}
            defaultValue={
              field.value instanceof Date
                ? field.value.toISOString()
                : field.value
            }
          >
            <FormControl>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>{children}</SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
