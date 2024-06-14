import { badRequest, forbidden, notFound } from './errors';

export const InvalidEmailError = badRequest({
    name: 'InvalidEmailError',
    message: 'The email must be valid and must not contain upper case letters or spaces.',
});
// export const InvalidPasswordError = badRequest({
//     name: 'InvalidPasswordError',
//     message: 'The password must contain at least 8 characters and at least 1 number.',
// });
export const InvalidSrpAError = badRequest({
    name: 'InvalidSrpAError',
    message: 'The SRP A value must be a correctly calculated random hex hash based on big integers.',
});
// export const InvalidRefreshTokenError = badRequest({
//     name: 'InvalidRefreshTokenError',
//     message: 'Refresh token is invalid.',
// });
// export const VerificationCodeMismatchError = badRequest({
//     name: 'VerificationCodeMismatchError',
//     message: 'The verification code does not match.',
// });
// export const VerificationCodeExpiredError = badRequest({
//     name: 'VerificationCodeExpiredError',
//     message:
//         'The verification code has exipired. Please retry via Reset Password Init (in case of pasword reset) or Register Verify Resend (in case of register).',
// });
export const UserNotFoundError = notFound({
    name: 'UserNotFoundError',
    message: 'No user was found under the given email or user ID.',
});
export const UserNotVerifiedError = forbidden({
    name: 'UserNotVerifiedError',
    message: 'The user must be verified with Register Verify operation.',
});
// export const UserExistsError = badRequest({
//     name: 'UserExistsError',
//     message: 'There is an existing user with the given email address.',
// });
// export const UserMissingPasswordChallengeError = badRequest({
//     name: 'UserMissingPasswordChallengeError',
//     message: 'The user must have an active require password change challenge.',
// });
export const PasswordResetRequiredError = forbidden({
    name: 'PasswordResetRequiredError',
    message: 'The password must be reset.',
});
// export const PasswordResetMissingParamError = badRequest({
//     name: 'PasswordResetMissingParamError',
//     message: 'Either a verification code or the users old password are required.',
// });
// export const LoginVerifyError = badRequest({
//     name: 'LoginVerifyError',
//     message: 'The password could not be verified. Please check password, userId, secretBlock, signature and timestamp.',
// });
