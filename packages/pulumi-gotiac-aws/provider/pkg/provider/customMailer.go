package provider

import (
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
	// Notifications email account in the format of `$ echo "sender|host|user|password|port|secureFlag" | base64`
	NotificationsEmailAccount pulumi.StringInput `pulumi:"notificationsEmailAccount"`
	// The name of the pull lambda function that is used to pull message templates
	PullLambdaName pulumi.StringInput `pulumi:"pullLambdaName"`
	// The ARN of the pull lambda function
	InvokePullPolicyArn pulumi.StringInput `pulumi:"invokePullPolicyArn"`
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

	ssmParameter, err := ssm.NewParameter(ctx, name+"-notifications-email-account", &ssm.ParameterArgs{
		Value:       args.NotificationsEmailAccount,
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
	})
	if err != nil {
		return nil, err
	}

	pullMem := pulumi.Int(2048)
	pullEnv := pulumi.StringMap{
		"CUSTOM_MAIL_MESSAGE_KEY_ARN": kmsKey.Arn,
		"PULL_LAMBDA_NAME":            args.PullLambdaName,
	}

	customMailerLambda, err := NewLambda(ctx, name+"EmailSenderLambda", &LambdaArgs{
		Runtime:     args.Runtime,
		CodePath:    pulumi.Sprintf("%s/authMailMessage.js", args.CodePath),
		HandlerPath: pulumi.String("pull.handleInvoke"),
		MemorySize:  &pullMem,
		PolicyArns: pulumi.StringArray{
			ssmGetNotificationsEmailAccountParameterPolicy.Arn,
			args.InvokePullPolicyArn,
		},
		Environment: pullEnv,
	})
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
