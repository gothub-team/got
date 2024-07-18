import type { Node } from '@gothub/got-core';

export const APPLICATION_ROOT_NODE = 'root';

export const createEmailTemplateView = (rootNodeId: string, edgeTypes: string) =>
    rootNodeId && edgeTypes
        ? {
              [rootNodeId]: {
                  edges: {
                      [edgeTypes]: {
                          include: {
                              node: true,
                          },
                      },
                  },
              },
          }
        : {};

export const TEMPLATE_EDGE_TYPES: Record<string, string> = {
    CustomEmailSender_SignUp: 'root/template-signup',
    CustomEmailSender_ResendCode: 'root/template-resendcode',
    CustomEmailSender_ForgotPassword: 'root/template-forgotpassword',
    CustomEmailSender_UpdateUserAttribute: 'root/template-updateuserattribute',
    CustomEmailSender_VerifyUserAttribute: 'root/template-verifyuserattribute',
    CustomEmailSender_AccountTakeOverNotification: 'root/template-accounttakeovernotification',
    CustomEmailSender_AdminCreateUser: 'root/template-admincreateuser',
};

export type Template = {
    subject: string;
    text: string;
    html: string;
};

export type TemplateNode = {
    templateId: string;
} & Template &
    Node;

export const DEFAULT_EMAIL_TEMPLATES: Record<string, Template | null> = {
    CustomEmailSender_SignUp: {
        subject: 'Your Verification Code',
        text: 'Your verification code is {#activationCode}',
        html: 'Your verification code is {#activationCode}',
    },
    CustomEmailSender_ResendCode: {
        subject: 'Your Verification Code',
        text: 'Your verification code is {#activationCode}',
        html: 'Your verification code is {#activationCode}',
    },
    CustomEmailSender_ForgotPassword: {
        subject: 'Your Verification Code',
        text: 'Your verification code is {#activationCode}',
        html: 'Your verification code is {#activationCode}',
    },
    CustomEmailSender_UpdateUserAttribute: null,
    CustomEmailSender_VerifyUserAttribute: null,
    CustomEmailSender_AccountTakeOverNotification: null,
    CustomEmailSender_AdminCreateUser: {
        subject: 'You Have Been Invited',
        text: 'You have been invited. Please log in with your temporary password: {#password}',
        html: 'You have been invited. Please log in with your temporary password: {#password}',
    },
};
