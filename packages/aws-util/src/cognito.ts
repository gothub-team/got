import {
    AdminCreateUserCommand,
    AdminDeleteUserCommand,
    AdminGetUserCommand,
    AdminInitiateAuthCommand,
    AdminResetUserPasswordCommand,
    AdminSetUserPasswordCommand,
    CognitoIdentityProviderClient,
    ConfirmForgotPasswordCommand,
    ConfirmSignUpCommand,
    ForgotPasswordCommand,
    InitiateAuthCommand,
    ListUsersCommand,
    ResendConfirmationCodeCommand,
    RespondToAuthChallengeCommand,
    SignUpCommand,
    type UserType,
} from '@aws-sdk/client-cognito-identity-provider';
import { AWS_REGION, CLIENT_ID, USER_POOL_ID } from './config.js';

const USER_NOT_VERIFIED_ERROR = {
    name: 'UserNotVerifiedError',
    message: 'The user must be verified with Register Verify operation.',
};

const client = new CognitoIdentityProviderClient({
    region: AWS_REGION,
    apiVersion: 'latest',
});

export const cognitoAdminInitiateAuthPassword = async (email: string, password: string) => {
    const command = new AdminInitiateAuthCommand({
        UserPoolId: USER_POOL_ID,
        ClientId: CLIENT_ID,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        },
    });
    const result = await client.send(command);
    return {
        accessToken: result?.AuthenticationResult?.AccessToken,
        expiresIn: result?.AuthenticationResult?.ExpiresIn,
        idToken: result?.AuthenticationResult?.IdToken,
        refreshToken: result?.AuthenticationResult?.RefreshToken,
        session: result?.Session,
    };
};

export const cognitoAdminResetPassword = async (email: string, skipMessage = false) => {
    const command = new AdminResetUserPasswordCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        ClientMetadata: {
            skipMessage: skipMessage ? 'true' : 'false',
        },
    });
    await client.send(command);
};

export const cognitoAdminCreateUser = async (email: string, password: string) => {
    await client.send(
        new AdminCreateUserCommand({
            UserPoolId: USER_POOL_ID,
            Username: email,
            TemporaryPassword: password,
            MessageAction: 'SUPPRESS',
            UserAttributes: [
                {
                    Name: 'email_verified',
                    Value: 'true',
                },
                {
                    Name: 'email',
                    Value: email,
                },
            ],
        }),
    );
    await client.send(
        new AdminSetUserPasswordCommand({
            UserPoolId: USER_POOL_ID,
            Username: email,
            Password: password,
            Permanent: true,
        }),
    );
};

export const cognitoAdminDeleteUser = async (email: string) => {
    const command = new AdminDeleteUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
    });
    await client.send(command);
};

export const cognitoInitiateAuthSrp = async (email: string, srpA: string) => {
    const command = new InitiateAuthCommand({
        ClientId: CLIENT_ID,
        AuthFlow: 'USER_SRP_AUTH',
        AuthParameters: {
            USERNAME: email,
            SRP_A: srpA,
        },
    });
    const result = await client.send(command);
    return {
        poolname: USER_POOL_ID.split('_')[1],
        userId: result?.ChallengeParameters?.USERNAME,
        srpB: result?.ChallengeParameters?.SRP_B,
        secretBlock: result?.ChallengeParameters?.SECRET_BLOCK,
        salt: result?.ChallengeParameters?.SALT,
    };
};

export const cognitoRespondVerifySrp = async (
    userId: string,
    secretBlock: string,
    signature: string,
    timestamp: string,
) => {
    const command = new RespondToAuthChallengeCommand({
        ClientId: CLIENT_ID,
        ChallengeName: 'PASSWORD_VERIFIER',
        ChallengeResponses: {
            USERNAME: userId,
            TIMESTAMP: timestamp,
            PASSWORD_CLAIM_SECRET_BLOCK: secretBlock,
            PASSWORD_CLAIM_SIGNATURE: signature,
        },
    });
    const result = await client.send(command);
    return {
        accessToken: result?.AuthenticationResult?.AccessToken,
        expiresIn: result?.AuthenticationResult?.ExpiresIn,
        idToken: result?.AuthenticationResult?.IdToken,
        refreshToken: result?.AuthenticationResult?.RefreshToken,
    };
};

export const cognitoInitiateAuthRefreshToken = async (refreshToken: string) => {
    const command = new InitiateAuthCommand({
        ClientId: CLIENT_ID,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
            // USERNAME: email,
            REFRESH_TOKEN: refreshToken,
        },
    });
    const result = await client.send(command);
    return {
        accessToken: result?.AuthenticationResult?.AccessToken,
        expiresIn: result?.AuthenticationResult?.ExpiresIn,
        idToken: result?.AuthenticationResult?.IdToken,
    };
};

export const cognitoSignup = async (email: string, password: string, skipMessage = false) => {
    const command = new SignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        ClientMetadata: {
            skipMessage: skipMessage ? 'true' : 'false',
        },
    });
    const results = await client.send(command);
    return results;
};

export const cognitoConfirmSignup = async (email: string, confirmationCode: string) => {
    const command = new ConfirmSignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: confirmationCode,
    });
    await client.send(command);
};

export const cognitoResendConfirmationCode = async (email: string) => {
    const command = new ResendConfirmationCodeCommand({
        ClientId: CLIENT_ID,
        Username: email,
    });
    await client.send(command);
};

export const cognitoForgotPassword = async (email: string, skipMessage = false) => {
    const command = new ForgotPasswordCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ClientMetadata: {
            skipMessage: skipMessage ? 'true' : 'false',
        },
    });
    try {
        await client.send(command);
    } catch (err) {
        if (!(await cognitoIsUserConfirmed(email))) {
            throw USER_NOT_VERIFIED_ERROR;
        }
        throw err;
    }
};

export const cognitoConfirmForgotPassword = async (email: string, password: string, confirmationCode: string) => {
    const command = new ConfirmForgotPasswordCommand({
        ClientId: CLIENT_ID,
        Username: email,
        Password: password,
        ConfirmationCode: confirmationCode,
    });
    try {
        await client.send(command);
    } catch (err) {
        if (!(await cognitoIsUserConfirmed(email))) {
            throw USER_NOT_VERIFIED_ERROR;
        }
        throw err;
    }
};

export const cognitoRespondToPasswordChallenge = async (email: string, newPassword: string, session: string) => {
    const command = new RespondToAuthChallengeCommand({
        ClientId: CLIENT_ID,
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ChallengeResponses: {
            USERNAME: email,
            NEW_PASSWORD: newPassword,
        },
        Session: session,
    });

    const result = await client.send(command);
    return {
        accessToken: result?.AuthenticationResult?.AccessToken,
        expiresIn: result?.AuthenticationResult?.ExpiresIn,
        idToken: result?.AuthenticationResult?.IdToken,
        refreshToken: result?.AuthenticationResult?.RefreshToken,
    };
};

export const cognitoGetUser = async (email: string) => {
    const command = new AdminGetUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
    });

    return client.send(command);
};

export const cognitoIsUserConfirmed = async (email: string) => {
    const { UserStatus } = await cognitoGetUser(email);
    return UserStatus === 'CONFIRMED';
};

export const cognitoUserExists = async (email: string) => {
    try {
        await cognitoGetUser(email);
        return true;
    } catch (err) {
        return false;
    }
};

export const cognitoListUsersPaged = () =>
    new Promise((resolve, reject) => {
        const res: UserType[] = [];

        try {
            const _FETCH_PAGE = async (paginationToken?: string) => {
                const command = new ListUsersCommand({
                    UserPoolId: USER_POOL_ID,
                    PaginationToken: paginationToken,
                });
                // handling contents in then function so they are local and can get GCed after handling
                const ContinuationToken = await client.send(command).then(({ Users, PaginationToken }) => {
                    if (!Users) return;

                    Users.forEach((user) => res.push(user));
                    return PaginationToken;
                });

                ContinuationToken ? _FETCH_PAGE(ContinuationToken) : resolve(res);
            };
            _FETCH_PAGE();
        } catch (err) {
            reject(err);
        }
    });
