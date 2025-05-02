import { IUser } from "@/types/users";

export default function PatientCard({ user }: { user?: IUser }) {
  return (
    <div className="flex flex-col gap-2 p-4 rounded-lg border-black border-2 flex-none">
      <div className="flex items-center gap-2">
        <div className="flex-none bg-gray-200 w-[80px] h-[80px] text-4xl rounded-full font-bold border-black border-2 flex items-center justify-center ">
          {user?.firstName?.charAt(0).toUpperCase()}
        </div>
        <div className="flex flex-col gap-2">
          <div>
            <b>Name:</b> {user?.firstName} {user?.lastName}
          </div>
          <div>
            <b>Email:</b> {user?.email}
          </div>
        </div>
      </div>

      <div>
        <b>Phone Number:</b> {user?.phoneNumber}
      </div>
      <div>
        <b>Date Of Birth:</b> {`${user?.dateOfBirth}`}
      </div>
      <div>
        <b>Marital State:</b> {user?.maritalState}
      </div>
      <div>
        <b>Gender:</b> {user?.gender}
      </div>
      <div>
        <b>Address:</b> {user?.address}
      </div>
    </div>
  );
}
