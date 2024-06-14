package provider

import (
	"encoding/base64"
	"fmt"

	"github.com/gothub-team/pulumi-awsworkmail/sdk/go/awsworkmail"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/iam"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/kms"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/lambda"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/ssm"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a CustomMailer component resource.
type CustomMailerArgs struct {
	// ID of the cognito user pool that should be updated with the custom mailer.
	UserPoolId pulumi.StringInput `pulumi:"userPoolId"`
	// The the path to the .zip for the lambda code
	CodePath pulumi.StringInput `pulumi:"codePath"`
	// The lambda runtime
	Runtime pulumi.StringInput `pulumi:"runtime"`
	// Notifications email account
	NotificationsEmailAccount NotificationsEmailAccount `pulumi:"notificationsEmailAccount"`
	// The name of the pull lambda function that is used to pull message templates
	PullLambdaName pulumi.StringInput `pulumi:"pullLambdaName"`
	// The ARN of the pull lambda function
	InvokePullPolicyArn pulumi.StringInput `pulumi:"invokePullPolicyArn"`
}

type NotificationsEmailAccount struct {
	// Display name of the sender of the notifications emails.
	Sender pulumi.StringInput `pulumi:"sender"`
	// SMTP host of the email server that sends notifications.
	Host pulumi.StringInput `pulumi:"host"`
	// SMTP username of the email server that sends notifications.
	User pulumi.StringInput `pulumi:"user"`
	// SMTP password of the email server that sends notifications.
	Password pulumi.StringInput `pulumi:"password"`
	// SMTP port of the email server that sends notifications.
	Port pulumi.StringInput `pulumi:"port"`
	// Flag that indicates if the email server uses secure connection.
	SecureFlag pulumi.BoolInput `pulumi:"secureFlag"`
}

// The CustomMailer component resource.
type CustomMailer struct {
	pulumi.ResourceState
	CustomMailerId pulumi.StringOutput `pulumi:"customMailerId"`
}

// NewCustomMailer creates a new CustomMailer component resource.
func NewCustomMailer(ctx *pulumi.Context,
	name string, args *CustomMailerArgs, opts ...pulumi.ResourceOption) (*CustomMailer, error) {
	if args == nil {
		args = &CustomMailerArgs{}
	}

	component := &CustomMailer{}
	err := ctx.RegisterComponentResource("gotiac:index:CustomMailer", name, component, opts...)
	if err != nil {
		return nil, err
	}

	// Base64 encode the NotificationsEmailAccount like sender|host|user|password|port|secureFlag
	notificationsEmailAccount := pulumi.Sprintf(
		"%s|%s|%s|%s|%s|%t",
		args.NotificationsEmailAccount.Sender,
		args.NotificationsEmailAccount.Host,
		args.NotificationsEmailAccount.User,
		args.NotificationsEmailAccount.Password,
		args.NotificationsEmailAccount.Port,
		args.NotificationsEmailAccount.SecureFlag,
	).ApplyT(func(emailAccountString string) (string, error) {
		return base64.StdEncoding.EncodeToString([]byte(emailAccountString)), nil
	}).(pulumi.StringOutput)

	ssmParameter, err := ssm.NewParameter(ctx, name+"-notifications-email-account", &ssm.ParameterArgs{
		Value:       notificationsEmailAccount,
		Description: pulumi.String("The email account used for sending notifications"),
		Type:        pulumi.String("SecureString"),
	})
	if err != nil {
		return nil, err
	}

	ssmGetNotificationsEmailAccountParameterPolicy, err := iam.NewPolicy(ctx, name+"-notifications-email-account-parameter-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for retrieving the cloudfront access key parameter"),
		Policy: pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"ssm:GetParameter",
					},
					"Resource": []interface{}{
						ssmParameter.Arn,
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	KMS_KEY_ALIAS := "alias/got/custom-mailer"
	var kmsKeyArn pulumi.StringOutput
	existingKmsKey, err := kms.LookupKey(ctx, &kms.LookupKeyArgs{
		KeyId: KMS_KEY_ALIAS,
	})
	if err == nil {
		kmsKeyArn = pulumi.String(existingKmsKey.Arn).ToStringOutput()
	} else {
		callerIdentity, err := aws.GetCallerIdentity(ctx, nil)
		if err != nil {
			return nil, err
		}
		allow := "Allow"
		keyPolicy, err := iam.GetPolicyDocument(ctx, &iam.GetPolicyDocumentArgs{
			Statements: []iam.GetPolicyDocumentStatement{
				{
					Effect: &allow,
					Principals: []iam.GetPolicyDocumentStatementPrincipal{
						{
							Type: "AWS",
							Identifiers: []string{
								fmt.Sprintf("arn:aws:iam::%s:root", callerIdentity.AccountId),
							},
						},
					},
					Actions: []string{
						"kms:*",
					},
					Resources: []string{
						"*",
					},
				},
			},
		}, nil)
		if err != nil {
			return nil, err
		}

		kmsKey, err := kms.NewKey(ctx, name+"CustomMailMessageKey", &kms.KeyArgs{
			Policy: pulumi.String(keyPolicy.Json),
		}, pulumi.RetainOnDelete(true))
		if err != nil {
			return nil, err
		}

		_, err = kms.NewAlias(ctx, name+"CustomMailMessageKeyAlias", &kms.AliasArgs{
			Name:        pulumi.String(KMS_KEY_ALIAS),
			TargetKeyId: kmsKey.Arn,
		}, pulumi.RetainOnDelete(true))
		if err != nil {
			return nil, err
		}

		kmsKeyArn = kmsKey.Arn
	}

	pullMem := pulumi.Int(2048)
	pullEnv := pulumi.StringMap{
		"NOTIFICATIONS_EMAIL_ACCOUNT_PARAMETER_NAME": ssmParameter.Name,
		"CUSTOM_MAIL_MESSAGE_KEY_ARN":                kmsKeyArn,
		"PULL_LAMBDA_NAME":                           args.PullLambdaName,
	}

	decryptKeyPolicy, err := iam.NewPolicy(ctx, name+"-decrypt-key-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for decrypting via KMS key"),
		Policy: pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"kms:Decrypt",
					},
					"Resource": []interface{}{
						kmsKeyArn,
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	customMailerLambda, err := NewLambda(ctx, name+"EmailSenderLambda", &LambdaArgs{
		Runtime:     args.Runtime,
		CodePath:    pulumi.Sprintf("%s/authMailMessage.js", args.CodePath),
		HandlerPath: pulumi.String("authMailMessage.handleInvoke"),
		MemorySize:  &pullMem,
		PolicyArns: pulumi.StringArray{
			ssmGetNotificationsEmailAccountParameterPolicy.Arn,
			args.InvokePullPolicyArn,
			decryptKeyPolicy.Arn,
		},
		Environment: pullEnv,
	}, pulumi.DependsOn([]pulumi.Resource{ssmGetNotificationsEmailAccountParameterPolicy, decryptKeyPolicy}))
	if err != nil {
		return nil, err
	}

	_, err = lambda.NewPermission(ctx, fmt.Sprintf("%s-Permission", name), &lambda.PermissionArgs{
		StatementId: pulumi.String("CognitoLambdaInvokeAccess"),
		Action:      pulumi.String("lambda:InvokeFunction"),
		Function:    customMailerLambda.Function,
		Principal:   pulumi.String("cognito-idp.amazonaws.com"),
	})
	if err != nil {
		return nil, err
	}

	customMailer, err := awsworkmail.NewCognitoEmailSender(ctx, "CognitoEmailSender", &awsworkmail.CognitoEmailSenderArgs{
		UserPoolId: args.UserPoolId.ToStringOutput(),
		KmsKeyArn:  kmsKeyArn,
		LambdaArn:  customMailerLambda.Arn,
	})
	if err != nil {
		return nil, err
	}

	component.CustomMailerId = customMailer.ID().ToIDOutput().ToStringOutput()

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{}); err != nil {
		return nil, err
	}

	return component, nil
}
