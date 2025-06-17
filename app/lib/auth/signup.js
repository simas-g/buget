"use server";
import { cookies } from "next/headers";
import connect from "../connectToDB";
import User from "../models/user";
import bcrypt from "bcryptjs";
import { createUserSession } from "./session";
export async function signup({ password, email, name }) {
  await connect();

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error("vartotojas jau egzistuoja");
  }
  const saltLength = 10;
  const salt = await bcrypt.genSalt(saltLength);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    plan: "basic",
    userId: "none",
  });

  const savedUser = await newUser.save();
  console.log(savedUser)
  await createUserSession(
    { id: savedUser._id.toString(), plan: savedUser.plan }, await cookies()
  );

  return "Vartotojas sėkmingai sukurtas";
}
