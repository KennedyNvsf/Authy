"use server";

import * as z from "zod";
import bcrypt from "bcryptjs";

import { NewPasswordSchema } from "@/form-schemas";
import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import sanityClient from "@/lib/sanityClient";

export const newPassword = async (
  values: z.infer<typeof NewPasswordSchema> ,
  token?: string | null,
) => {

  if (!token) {
    return { error: "Missing token!" };
  }

  const validatedFields = NewPasswordSchema.safeParse(values);

  if (!validatedFields.success) {
    return { error: "Invalid fields!" };
  }

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) {
    return { error: "Invalid token!" };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: "Token has expired!" };
  }

  const existingUser = await getUserByEmail(existingToken.identifier);

  if (!existingUser) {
    return { error: "Email does not exist!" }
  }

  const hashedPassword = await bcrypt.hash(password, 10);


  await sanityClient.patch(existingUser._id).set({
    password: hashedPassword,
  }).commit();

  await sanityClient.delete(existingToken._id);;

  return { success: "Password updated!" };
};