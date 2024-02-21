import user from './user';
import session from './session';
import account from './account';
import verificationToken from './verificationToken';
import passwordResetToken from './passwordResetToken';
import twoFactorToken from './twoFactorToken';
import twoFactorConfirmation from './twoFactorConfirmation';

export const schemaTypes = [
    user,
    session,
    account,
    verificationToken,
    passwordResetToken,
    twoFactorToken,
    twoFactorConfirmation
]
