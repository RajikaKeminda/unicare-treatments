import { IUser } from "../types/user.ts";
import User from "../models/userModel.ts";

async function getAll(): Promise<any> {
  const allUsers = await User.find();
  return allUsers;
}

async function findById(id: string): Promise<any> {
  const user = await User.findById(id);
  return user;
}

async function create(user: IUser): Promise<any> {
  const newUser = new User({
    name: user.name,
    email: user.email,
  });
  await newUser.save();
  return newUser;
}

async function update({ id, user }: { id: string; user: IUser }): Promise<any> {
  const updatedUser = await User.findByIdAndUpdate(
    id,
    {
      name: user.name,
      email: user.email,
    },
    { new: true }
  );
  return updatedUser;
}

async function findAndDelete(id: string): Promise<any> {
  const deletedUser = await User.findByIdAndDelete(id);
  return deletedUser;
}

export default {
  getAll,
  findById,
  create,
  update,
  findAndDelete,
};
