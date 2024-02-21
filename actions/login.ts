"use server"

import * as z from "zod";
import { LoginSchema } from "@/form-schemas";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { AuthError } from "next-auth";

import { getUserByEmail } from "@/data/user";
import { getTwoFactorTokenByEmail } from "@/data/two-factor-token";
import { getTwoFactorConfirmationByUserId } from "@/data/two-factor-confirmation";

import { 
    sendVerificationEmail,
    sendTwoFactorTokenEmail 
} from "@/lib/mail";

import { 
    generateVerificationToken,
    generateTwoFactorToken 
} from "@/lib/tokens";
import sanityClient from "@/lib/sanityClient";

export const login = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values);

    if(!validatedFields.success) {
        return {error: "Invalid Fields!"};
    }

    const {email, password, code} = validatedFields.data;

    const existingUser = await getUserByEmail(email);

    if (!existingUser || !existingUser.email || !existingUser.password) {
        return {error: "Account does not exist!"}
    }

    if (!existingUser.emailVerified) {

        const verificationToken = await generateVerificationToken(existingUser.email);
        //SEND EMAIL VERIFICATION TOKEN
        await sendVerificationEmail(
            verificationToken.identifier,
            verificationToken.token
        );

        return {success: "Confirmation email sent!"}
    }

    if(existingUser.isTwoFactorEnabled && existingUser.email) {

        if( code ) {

            const twoFactorToken = await getTwoFactorTokenByEmail(existingUser.email);

            if(!twoFactorToken) {
                return {error: "Invalid Code!"}
            }

            if(twoFactorToken.token !== code) {
                return {error: "Invalid Code!"}
            }

            const hasExpired = new Date( twoFactorToken.expires ) < new Date();

            if (hasExpired) {
                return {error: "Code expired!"}
            }

            await sanityClient.delete(twoFactorToken._id);

            const existingConfirmation = await getTwoFactorConfirmationByUserId(existingUser._id);

            if (existingConfirmation) {
                await sanityClient.delete(existingConfirmation._id);
            }

            await sanityClient.create({
                _type: 'twoFactorConfirmation',
                userId: existingUser._id,
                user: {
                    _type: 'reference',
                    _ref: existingUser._id,
                }
            })
            
        } else {
            const twoFactorToken = await generateTwoFactorToken(existingUser.email);
            await sendTwoFactorTokenEmail(
                twoFactorToken.identifier,
                twoFactorToken.token
            );

            return {twoFactor: true}
        }
    }
    

    try {

        await signIn("credentials", {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT
        });

    } catch (error) {

        if (error instanceof AuthError) {
            switch(error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!"}
                default:
                    return {error: "Something went wrong"}
            }
        }

        throw error;
    }
}