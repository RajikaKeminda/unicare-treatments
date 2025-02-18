"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Button from "@/components/ui/buttons/Button1";

const formSchema = z.object({
  emailAddress: z.string().email(),
  password: z.string().min(3),
  passwordConfirm: z.string().min(3),
}).refine((data) => {
  return data.password === data.passwordConfirm 
}, {
  message: "Password do not match",
  path: ["passwordConfirm"]
});

export default function ChannelAppointment() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { emailAddress: "" },
  });

  const handleSubmit = () => {};

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="emailAddress"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address:</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-300"
                      placeholder="email address"
                      type="email"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password:</FormLabel>
                  <FormControl>
                    <Input
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-300"
                      placeholder="password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField control={form.control} name="passwordConfirm" render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password:</FormLabel>
                <FormControl>
                  <Input className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring focus:ring-blue-300"
                    placeholder="confirm password" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )} />
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded">
              Submit
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
