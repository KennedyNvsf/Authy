import sanityClient from './sanityClient';
import { getVerificationTokenByEmail } from '@/data/verification-token';
import { getPasswordResetTokenByEmail } from '@/data/password-reset-token';
import { getTwoFactorTokenByEmail } from '@/data/two-factor-token';

import { uuid } from '@sanity/uuid';
import crypto from "crypto";

export const generateVerificationToken = async (email: string) => {
    
    const token = `token.${uuid()}`;

    //expires in 1hour
    const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString(); 

    const existingToken = await getVerificationTokenByEmail(email);

    if(existingToken) {
        await sanityClient.delete(existingToken._id);
    }

    const verificationToken = await sanityClient.create({
        _type: 'verificationToken',
        identifier: email,
        token,
        expires
    });

    return verificationToken;
}

export const generatePasswordResetToken = async (email: string) => {

    const token = `token.${uuid()}`;

    //expires in 1hour
    const expires = new Date(new Date().getTime() + 3600 * 1000).toISOString(); 

    const existingToken = await getPasswordResetTokenByEmail(email);

    if(existingToken) {
        await sanityClient.delete(existingToken._id);
    }

    const passwordResetToken = await sanityClient.create({
        _type: 'passwordResetToken',
        identifier: email,
        token,
        expires
    });

    return passwordResetToken;
}

export const generateTwoFactorToken = async (email: string) => {

    const token = crypto.randomInt(100_000, 1_000_000).toString();

    //expires in 5 minutes
    const expires = new Date(new Date().getTime() + 5 * 60 * 1000).toISOString();

    const existingToken = await getTwoFactorTokenByEmail(email);

    if(existingToken) {
        await sanityClient.delete(existingToken._id);
    }

    const twoFactorToken = await sanityClient.create({
        _type: 'twoFactorToken',
        identifier: email,
        token,
        expires
    });

    return twoFactorToken;
}