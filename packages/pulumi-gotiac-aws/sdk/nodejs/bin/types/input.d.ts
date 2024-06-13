import * as pulumi from '@pulumi/pulumi';
export interface ApiFileHostingInputArgs {
    /**
     * The name of the created media bucket that is used to store files.
     */
    bucketName: pulumi.Input<string>;
    /**
     * The file hosting domain.
     */
    domain: pulumi.Input<string>;
    /**
     * The ID of the private key which is used to identify which key was used to sign a URL.
     */
    privateKeyId: pulumi.Input<string>;
    /**
     * The ssm parameter name for the private key that is used to sign upload and download URLs.
     */
    privateKeyParameterName: pulumi.Input<string>;
}
/**
 * Email account that is used to send notifications emails.
 */
export interface NotificationsEmailAccountArgs {
    /**
     * SMTP host of the email server that sends notifications.
     */
    host: pulumi.Input<string>;
    /**
     * SMTP password of the email server that sends notifications.
     */
    password: pulumi.Input<string>;
    /**
     * SMTP port of the email server that sends notifications.
     */
    port: pulumi.Input<string>;
    /**
     * Flag that indicates if the email server uses secure connection.
     */
    secureFlag: pulumi.Input<boolean>;
    /**
     * Display name of the sender of the notifications emails.
     */
    sender: pulumi.Input<string>;
    /**
     * SMTP username of the email server that sends notifications.
     */
    user: pulumi.Input<string>;
}
