"use client";

import { Form } from "@/shadcn/ui/form";

import InputElement from "@/channeling/elements/form-elements/input-element";
import SelectElement from "@/channeling/elements/form-elements/select-element";

import { TChannelSchema } from "@/helpers/validation/channel-schema";
import { SelectItem } from "@/shadcn/ui/select";
import {
  Calendar,
  ContactRound,
  MailIcon,
  Phone,
  MapPin,
  CircleUser,
  UsersRound,
} from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { FaUserEdit } from "react-icons/fa";

export default function StepPersonalDetails({
  updateUser,
  form,
}: {
  updateUser: (values: TChannelSchema) => void;
  form: UseFormReturn<TChannelSchema>;
}) {
  return (
    <>
      <h1 className="text-2xl font-bold text-gray-800 text-center">
        Update Your Details
      </h1>
      <div className="relative w-full max-w-2xl shadow-lg rounded-lg p-6 bg-white">
        <div className="absolute bg-cover bg-scope w-[150px] h-[150px] right-0 top-0 z-50 translate-x-1/4 -translate-y-2/4"></div>
        <Form {...form}>
          <div className="flex flex-col gap-5 ">
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <div className="flex flex-col gap-5">
                <InputElement
                  form={form}
                  fieldName="firstName"
                  fieldType="text"
                  label="First Name"
                  placeholder="First Name"
                  icon={<ContactRound className="h-5 w-5 text-gray-600" />}
                />
                <InputElement
                  form={form}
                  fieldName="dateOfBirth"
                  fieldType="date"
                  label="Date of Birth"
                  placeholder="Date of Birth"
                  icon={<Calendar className="h-5 w-5 text-gray-600" />}
                />
                <InputElement
                  form={form}
                  fieldName="phoneNumber"
                  fieldType="tel"
                  label="Phone Number"
                  placeholder="Phone Number"
                  icon={<Phone className="h-5 w-5 text-gray-600" />}
                />

                <SelectElement
                  form={form}
                  fieldName="maritalState"
                  label="Marital State"
                  icon={<UsersRound className="h-5 w-5 text-gray-600" />}
                >
                  <SelectItem value="married">Married</SelectItem>
                  <SelectItem value="single">Single</SelectItem>
                  <SelectItem value="widowed">Widowed</SelectItem>
                </SelectElement>
              </div>
              <div className="flex flex-col gap-5">
                <InputElement
                  form={form}
                  fieldName="lastName"
                  fieldType="text"
                  label="Last Name"
                  placeholder="Last Name"
                  icon={<ContactRound className="h-5 w-5 text-gray-600" />}
                />
                <InputElement
                  disabled={true}
                  form={form}
                  fieldName="email"
                  fieldType="email"
                  label="Email"
                  placeholder="Email"
                  icon={<MailIcon className="h-5 w-5 text-gray-600" />}
                />
                <InputElement
                  form={form}
                  fieldName="address"
                  fieldType="text"
                  label="Address"
                  placeholder="Address"
                  icon={<MapPin className="h-5 w-5 text-gray-600" />}
                />
                <SelectElement
                  form={form}
                  fieldName="gender"
                  label="Gender Status"
                  icon={<CircleUser className="h-5 w-5 text-gray-600" />}
                >
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Prefer not to state</SelectItem>
                </SelectElement>
              </div>
            </div>

            <button
              className="cursor-pointer px-4 py-2 rounded bg-black text-white flex items-center gap-2 justify-center"
              onClick={async (e) => {
                e.preventDefault();
                const isValid = await form.trigger();
                if (isValid) {
                  updateUser(form.getValues());
                }
              }}
            >
              <FaUserEdit />
              Save and Continue {form.formState.isSubmitting && "..."}
            </button>
          </div>
        </Form>
      </div>
    </>
  );
}
