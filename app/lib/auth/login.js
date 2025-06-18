"use server";
import { cookies } from "next/headers";
import connect from "../connectToDB";
import User from "../models/user";
import bcrypt from "bcryptjs";
import { createUserSession } from "./session";
export async function login({ password, email }) {
  await connect();

  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    throw new Error("Paskyra neegzistuoja");
  }
  const isCorrectPass = await bcrypt.compare(password, existingUser.password)
  if(!isCorrectPass) {
    throw new Error("Neteisingas slaptažodis")
  }
  await createUserSession(
    { id: existingUser._id.toString(), plan: existingUser.plan }, await cookies()
  );
  
  return "Vartotojas sėkmingai prijungtas";
}
