import { Input } from "@/shadcn/ui/input";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";
import clsx from "clsx";

interface GenericFormProps<T extends FieldValues> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  form: UseFormReturn<T, any, undefined>;
  name: Path<T>;
  label: string;
  isHidden?: boolean;
}

export default function FormFieldWrapper<T extends FieldValues>({
  form,
  name,
  label,
  isHidden = false,
}: GenericFormProps<T>) {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <div className={clsx({ hidden: isHidden })}>
          <FormItem className="grid gap-4 grid-cols-4 space-y-0">
            <FormLabel className="col-span-1 flex items-center  justify-end text-black dark:text-white uppercase w-full">
              {label}:
            </FormLabel>
            <FormControl className="col-span-3">
              <Input {...field} type={isHidden ? "hidden" : "text"} />
            </FormControl>
          </FormItem>
          <FormMessage className="text-right" />
        </div>
      )}
    />
  );
}
