// sanityProvider.js

import type { CredentialsConfig } from 'next-auth/providers';
import Credentials from 'next-auth/providers/credentials';
import type { SanityClient } from '@sanity/client';
import { uuid } from '@sanity/uuid';
import bcrypt from "bcryptjs";

import { LoginSchema } from '@/form-schemas';


// async function verifyPassword(plainPassword: string, hashedPassword: string) {
//     try {
//         // Compare the plain password with the hashed password
//         const match = await bcrypt.compare(plainPassword, hashedPassword);
//         return match;

//     } catch (error) {
//         // Handle errors
//         console.error('Error verifying password:', error);
//         return false; // Return false in case of error
//     }
// }


export const signUpHandler = (
    sanityClient: SanityClient, userSchema: string = 'user'
) =>
  async (req: any, res: any) => {

    const isEdge = req instanceof Request;

    const body = isEdge ? await req.json() : req.body;

    const { email, password, name, image, ...userData } = body;
    const hashedPassword = await bcrypt.hash(password, 10);


    const user_qry =  `*[_type == "user" && email== "${email}"][0]`;
    const user = await sanityClient.fetch(user_qry);

    //handle if user exists
    if (user) {

      const response = { error: 'User already exist' };

      if (isEdge) {
        return new Response(JSON.stringify(response), {
          headers: {
            'Content-Type': 'application/json'
          },
          status: 400
        });
      }

      res.json(response);
      return;
    }

    const newUser = await sanityClient.create({
      _id: `user.${uuid()}`,
      _type: userSchema,
      email,
      password: hashedPassword,
      name,
      image,
      ...userData
    });

    if (isEdge) {
      return new Response(JSON.stringify(newUser), {
        headers: {
          'Content-Type': 'application/json'
        },
        status: 200
      });
    }

    res.json({
      id: newUser._id,
      ...newUser
    });
  };




export const SanityCredentials = (
    sanityClient: SanityClient
): CredentialsConfig =>

    Credentials({
      name: 'Credentials',
      id: 'sanity-login',
      type: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text'
        },
        password: {
          label: 'Password',
          type: 'password'
        }
      },

      async authorize(credentials) {

        //if not using zod resolvers validated fields arent necessary
        const validatedFields = LoginSchema.safeParse(credentials);
        if(!validatedFields.success) return null;

        const user_qry =  `*[_type == "user" && email== "${credentials?.email}"][0]`;
        const user = await sanityClient.fetch(user_qry);

        if (!user || !user.password) return null;

        const passwordsMatch = await bcrypt.compare(credentials?.password as string, user.password);
  
        if (passwordsMatch) {
          return {
            id: user._id,
            ...user
          };
        } 
        
        return null;
  
      }
    });