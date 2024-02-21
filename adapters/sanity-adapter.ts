import type { SanityClient } from '@sanity/client';
import { uuid } from '@sanity/uuid';


import type {
  Adapter,
  AdapterSession,
  AdapterUser,
} from "@auth/core/adapters"
import { User, UserRole } from "@/models/typings";

export function SanityAdapter(
  sanityClient: SanityClient,
  options = {
    schemas: {
      account: 'account',
      verificationToken: 'verificationToken',
      user: 'user',
      session: 'session'
    }
  }
): Adapter{

  return {
    async createUser(user) {

      try {
        
        const existingUser_qry = `*[_type == "user" && email == "${user.email}"][0]`;
        const existingUser = await sanityClient.fetch(existingUser_qry);

        if(existingUser) return existingUser;

        const createdUser = await sanityClient.create({
          _type: options.schemas.user,
          _id: `user.${uuid()}`,
          role: UserRole.USER,
          name: user.name,
          email: user.email,
          image: user.image,
          // isTwoFactorEnabled: false,
          emailVerified: user.emailVerified
        });


        return {
          id: createdUser._id,
          ...createdUser
        };
      } catch (error) {
        throw new Error('Failed to Create user')
      }
    },

    async getUser(id) {
      try {
        const user_qry =  `*[_type == "user" && _id== "${id}"][0]`;
        const user = await sanityClient.fetch(user_qry);

        return user;
      } catch (error) {
        throw new Error('Couldnt get the user');
      }
    },

    async getUserByEmail(email) {
      try {
        const user_qry =  `*[_type == "user" && email== "${email}"][0]`;
        const user = await sanityClient.fetch(user_qry);

        return user;

      } catch (error) {
        throw new Error('Couldnt get the user');
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {

      try {
        const account_qry =  `*[_type == "account" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        const account = await sanityClient.fetch(account_qry);

        if (!account) return;

        const user_qry =  `*[_type == "user" && _id== "${account.userId}"][0]`;
        const user = await sanityClient.fetch(user_qry);

        return {
          id: user._id,
          role: user.role,
          ...user
        };

      } catch (error) {
        throw new Error('Couldnt get the user');
      }
    },

    async updateUser(updatedUser) {
      try {
        const existingUser_qry = `*[_type == "user" && _id == "${updatedUser?.id}"][0]`;
        const existingUser = await sanityClient.fetch(existingUser_qry);

        if(!existingUser) {
          throw new Error(`Could not update user: ${updatedUser.id}; unable to find user`)
        }

        const patchedUser = await sanityClient.patch(existingUser._id)
        .set({
          emailVerified: updatedUser.emailVerified === null ? undefined : updatedUser.emailVerified,
          ...existingUser
        })
        .commit();


        return patchedUser as any

      } catch (error) {
        throw new Error('Couldnt update the user');
      }
    },

    async deleteUser(userId) {
      try {
        return await sanityClient.delete(userId);
      } catch (error: any) {
        throw new Error('Could not delete user', error)
      }
    },

    async linkAccount(account) {
      try {

        const createdAccount = await sanityClient.create({
          _type: options.schemas.account, 
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refreshToken: account.refresh_token,
          accessToken: account.access_token,
          expiresAt: account.expires_at,
          tokenType: account.token_type,
          scope: account.scope,
          idToken: account.id_token,
          user: {
            _type: 'reference',
            _ref: account.userId
          }
        });

        const userToUpdate = await sanityClient.getDocument(account.userId);

        await sanityClient.createOrReplace<User>({
          ...userToUpdate,
          emailVerified: new Date().toISOString(),
          accounts: {
            //@ts-ignore
            _type: 'reference',
            _key: uuid(),
            _ref: createdAccount._id
          }
        })
    
        return account;

      } catch (error) {
        throw new Error('Error linking account')
      }
    },

    async unlinkAccount({ providerAccountId, provider }) {
      try {
        const account_qry =  `*[_type == "account" && provider == "${provider}" && providerAccountId == "${providerAccountId}"][0]`;
        const account = await sanityClient.fetch(account_qry);

        if (!account) return;

        const accountUser  = await sanityClient.getDocument<User>(account.userId);

        // Filter out the user account to be deleted
        const updatedUserAccounts= (accountUser?.accounts || []).filter(
          ac => ac._ref !== account._id
        );

        // @ts-ignore
        await sanityClient.createOrReplace({
          ...accountUser,
          accounts: updatedUserAccounts,
        });

        await sanityClient.delete(account._id);

      } catch (error) {
        throw new Error('Could not Unlink account');
      }
    },

    async createSession(session) {
      try {
        await sanityClient.create({
          _type: 'session', 
          user: {
            _type: 'reference',
            _ref: session.userId
          },
          ...session
        })
    
        return session;

      } catch (error) {
        throw new Error('Error Creating Session')
      }
    },
    async getSessionAndUser(sessionToken: string): Promise<{ session: AdapterSession; user: AdapterUser; } | null> {
      try {
        const session_qry =  `*[_type == "session" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);

        if (!session) return null;

        const user_qry =  `*[_type == "user" && _id== "${session.userId}"][0]`;
        const user = await sanityClient.fetch(user_qry);

        return { 
          session: session, 
          user: user,
  
        };

      } catch (error) {
        throw new Error('Operation Failed');
      }
   },
    async updateSession({ sessionToken }) {
      try {
        const session_qry =  `*[_type == "session" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);

        if (!session) return null;

        await sanityClient.patch(session._id).set({
          ...session
        }).commit();

      } catch (error) {
        throw new Error('Operation Failed');
      }
    },
    async deleteSession(sessionToken) {

      try {
        const session_qry =  `*[_type == "session" && sessionToken == "${sessionToken}"][0]`;
        const session = await sanityClient.fetch(session_qry);

        if (!session) return null;

        await sanityClient.delete(session._id);

      } catch (error) {
        throw new Error('Operation Failed');
      }
    },
    async createVerificationToken({ identifier, expires, token }) {
      const verificationToken = await sanityClient.create({
        _type: options.schemas.verificationToken,
        identifier,
        token,
        expires
      });

      return verificationToken;
    },
    async useVerificationToken({ identifier, token }) {
      const verToken_qry =  `*[_type == "verificationToken" && identifier == "${identifier}" && token == "${token}"][0]`;
      const verToken = await sanityClient.fetch(verToken_qry);

      if (!verToken) return null;

      await sanityClient.delete(verToken._id);

      return {
        id: verToken._id,
        ...verToken
      };
    },
  }
}
