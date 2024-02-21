"use server"

import * as z from "zod";
import bcrypt from "bcryptjs";
import sanityClient from "@/lib/sanityClient";
import { RegisterSchema } from "@/form-schemas";
import { getUserByEmail } from "@/data/user";
import { UserRole } from "@/models/typings";
import { uuid } from '@sanity/uuid';
import { generateVerificationToken } from "@/lib/tokens";
import { sendVerificationEmail } from "@/lib/mail";

export const register = async (values: z.infer<typeof RegisterSchema>) => {
    const validatedFields = RegisterSchema.safeParse(values);

    if(!validatedFields.success) {
        return {error: "Invalid Fields!"};
    }

    const {email, password, name} = validatedFields.data;
    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await getUserByEmail(email);

    if(existingUser) {
        return {error: "Email already being used"}
    }

    await sanityClient.create({
        _type: 'user',
        _id: `user.${uuid()}`,
        name,
        email,
        role: UserRole.USER,
        isTwoFactorEnabled: false,
        password: hashedPassword,
    });

    const verificationToken = await generateVerificationToken(email);

    //SEND EMAIL VERIFICATION TOKEN
    await sendVerificationEmail(
        verificationToken.identifier,
        verificationToken.token
    )


    return {success: "Confirmation email sent"};
}