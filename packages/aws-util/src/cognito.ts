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
} from '@aws-sdk/client-cognito-identity-provider';
import { AWS_REGION, CLIENT_ID, USER_POOL_ID } from './config.js';

const client = new CognitoIdentityProviderClient({
    region: AWS_REGION,
    apiVersion: 'latest',
});

export const cognitoAdminInitiateAuthPassword = async (email, password) => {
    const command = new AdminInitiateAuthCommand({
        UserPoolId: USER_POOL_ID,
        ClientId: CLIENT_ID,
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
            USERNAME: email,
            PASSWORD: password,
        },
    });
    const {
        AuthenticationResult: {
            AccessToken: accessToken,
            ExpiresIn: expiresIn,
            IdToken: idToken,
            RefreshToken: refreshToken,
        } = {},
        Session: session,
    } = await client.send(command);
    return {
        accessToken,
        expiresIn,
        idToken,
        refreshToken,
        session,
    };
};

export const cognitoAdminResetPassword = async (email, skipMessage = false) => {
    const command = new AdminResetUserPasswordCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
        ClientMetadata: {
            skipMessage: skipMessage ? 'true' : 'false',
        },
    });
    await client.send(command);
};

export const cognitoAdminCreateUser = async (email, password) => {
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
    await client
        .send(
            new AdminSetUserPasswordCommand({
                UserPoolId: USER_POOL_ID,
                Username: email,
                Password: password,
                Permanent: true,
            }),
        )
        .then((re) => re.Session);
};

export const cognitoAdminDeleteUser = async (email) => {
    const command = new AdminDeleteUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
    });
    await client.send(command);
};

export const cognitoInitiateAuthSrp = async (email, srpA) => {
    const command = new InitiateAuthCommand({
        ClientId: CLIENT_ID,
        AuthFlow: 'USER_SRP_AUTH',
        AuthParameters: {
            USERNAME: email,
            SRP_A: srpA,
        },
    });
    const {
        ChallengeParameters: { SALT: salt, SECRET_BLOCK: secretBlock, SRP_B: srpB, USERNAME: userId },
    } = await client.send(command);
    return {
        poolname: USER_POOL_ID.split('_')[1],
        userId,
        srpB,
        secretBlock,
        salt,
    };
};

export const cognitoRespondVerifySrp = async (userId, secretBlock, signature, timestamp) => {
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
    const {
        AuthenticationResult: {
            AccessToken: accessToken,
            ExpiresIn: expiresIn,
            IdToken: idToken,
            RefreshToken: refreshToken,
        } = {},
    } = await client.send(command);
    return {
        accessToken,
        expiresIn,
        idToken,
        refreshToken,
    };
};

export const cognitoInitiateAuthRefreshToken = async (refreshToken) => {
    const command = new InitiateAuthCommand({
        ClientId: CLIENT_ID,
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
            // USERNAME: email,
            REFRESH_TOKEN: refreshToken,
        },
    });
    const { AuthenticationResult: { AccessToken: accessToken, ExpiresIn: expiresIn, IdToken: idToken } = {} } =
        await client.send(command);
    return {
        accessToken,
        expiresIn,
        idToken,
    };
};

export const cognitoSignup = async (email, password, skipMessage = false) => {
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

export const cognitoConfirmSignup = async (email, confirmationCode) => {
    const command = new ConfirmSignUpCommand({
        ClientId: CLIENT_ID,
        Username: email,
        ConfirmationCode: confirmationCode,
    });
    await client.send(command);
};

export const cognitoResendConfirmationCode = async (email) => {
    const command = new ResendConfirmationCodeCommand({
        ClientId: CLIENT_ID,
        Username: email,
    });
    await client.send(command);
};

export const cognitoForgotPassword = async (email, skipMessage = false) => {
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
            throw ERRORS.UserNotVerifiedError;
        }
        throw err;
    }
};

export const cognitoConfirmForgotPassword = async (email, password, confirmationCode) => {
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
            throw ERRORS.UserNotVerifiedError;
        }
        throw err;
    }
};

export const cognitoRespondToPasswordChallenge = async (email, newPassword, session) => {
    const command = new RespondToAuthChallengeCommand({
        ClientId: CLIENT_ID,
        ChallengeName: 'NEW_PASSWORD_REQUIRED',
        ChallengeResponses: {
            USERNAME: email,
            NEW_PASSWORD: newPassword,
        },
        Session: session,
    });
    const {
        AuthenticationResult: {
            AccessToken: accessToken,
            ExpiresIn: expiresIn,
            IdToken: idToken,
            RefreshToken: refreshToken,
        } = {},
    } = await client.send(command);
    return {
        accessToken,
        expiresIn,
        idToken,
        refreshToken,
    };
};

export const cognitoGetUser = async (email) => {
    const command = new AdminGetUserCommand({
        UserPoolId: USER_POOL_ID,
        Username: email,
    });

    return client.send(command);
};

export const cognitoIsUserConfirmed = async (email) => {
    const { UserStatus } = await cognitoGetUser(email);
    return UserStatus === 'CONFIRMED';
};

export const cognitoUserExists = async (email) => {
    try {
        await cognitoGetUser(email);
        return true;
    } catch (err) {
        return false;
    }
};

export const cognitoListUsersPaged = () =>
    new Promise((resolve, reject) => {
        const res = [];

        try {
            const _FETCH_PAGE = async (paginationToken) => {
                const command = new ListUsersCommand({
                    UserPoolId: USER_POOL_ID,
                    PaginationToken: paginationToken,
                });
                // handling contents in then function so they are local and can get GCed after handling
                const ContinuationToken = await client.send(command).then(({ Users, PaginationToken }) => {
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
