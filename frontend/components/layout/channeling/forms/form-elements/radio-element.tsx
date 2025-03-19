import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shadcn/ui/form";
import { channel } from "@/helpers/validation/channel-schema";
import { RadioGroup, RadioGroupItem } from "@/shadcn/ui/radio-group";

export default function RadioElement({ form }: { form: channel }) {
  return (
    <FormField
      control={form.control}
      name="maritalState"
      render={({ field }) => (
        <FormItem className="space-y-3">
          <FormLabel className="flex text-gray-700 font-medium">
            Marital State
          </FormLabel>
          <FormControl>
            <RadioGroup
              onValueChange={field.onChange}
              defaultValue={field.value}
              className="flex flex-row space-x-4" // Changed to row layout
            >
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="married" />
                </FormControl>
                <FormLabel className="font-normal">Married</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="single" />
                </FormControl>
                <FormLabel className="font-normal">Single</FormLabel>
              </FormItem>
              <FormItem className="flex items-center space-x-2">
                <FormControl>
                  <RadioGroupItem value="widowed" />
                </FormControl>
                <FormLabel className="font-normal">Widowed</FormLabel>
              </FormItem>
            </RadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
