package provider

import (
	"errors"
	"fmt"

	"github.com/gothub-team/got/packages/pulumi-gotiac-aws/provider/pkg/util"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/acm"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/apigatewayv2"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/cognito"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/iam"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/route53"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a Lambda component resource.
type ApiArgs struct {
	DomainName pulumi.StringInput `pulumi:"domainName"`
	UserPoolId pulumi.IDInput     `pulumi:"userPoolId"`
	// The the path to the .zip for the lambda code
	CodePath pulumi.StringInput `pulumi:"codePath"`
	// The lambda runtime
	Runtime                  pulumi.StringInput   `pulumi:"runtime"`
	ForceStoreDestroy        *pulumi.BoolInput    `pulumi:"forceStoreDestroy"`
	BucketNodesName          *pulumi.StringInput  `pulumi:"bucketNodesName"`
	BucketEdgesName          *pulumi.StringInput  `pulumi:"bucketEdgesName"`
	BucketReverseEdgesName   *pulumi.StringInput  `pulumi:"bucketReverseEdgesName"`
	BucketRightsReadName     *pulumi.StringInput  `pulumi:"bucketRightsReadName"`
	BucketRightsWriteName    *pulumi.StringInput  `pulumi:"bucketRightsWriteName"`
	BucketRightsAdminName    *pulumi.StringInput  `pulumi:"bucketRightsAdminName"`
	BucketRightsOwnerName    *pulumi.StringInput  `pulumi:"bucketRightsOwnerName"`
	BucketMediaName          *pulumi.StringInput  `pulumi:"bucketMediaName"`
	InviteUserValidationView *pulumi.StringInput  `pulumi:"inviteUserValidationView"`
	FileHosting              *ApiFileHostingInput `pulumi:"fileHosting"`
}

type ApiFileHostingInput struct {
	Domain                  pulumi.StringInput `pulumi:"domain"`
	PrivateKeyParameterName pulumi.StringInput `pulumi:"privateKeyParameterName"`
	PrivateKeyId            pulumi.StringInput `pulumi:"privateKeyId"`
	BucketName              pulumi.StringInput `pulumi:"bucketName"`
}

// The Api component resource.
type Api struct {
	pulumi.ResourceState
	// Route apigatewayv2.Route `pulumi:"route"`
	Endpoint                         pulumi.StringOutput `pulumi:"endpoint"`
	PullEndpoint                     pulumi.StringOutput `pulumi:"pullEndpoint"`
	PushEndpoint                     pulumi.StringOutput `pulumi:"pushEndpoint"`
	PullInvokePolicyArn              pulumi.StringOutput `pulumi:"pullInvokePolicyArn"`
	PushInvokePolicyArn              pulumi.StringOutput `pulumi:"pushInvokePolicyArn"`
	AuthLoginInitEndpoint            pulumi.StringOutput `pulumi:"authLoginInitEndpoint"`
	AuthLoginVerifyEndpoint          pulumi.StringOutput `pulumi:"authLoginVerifyEndpoint"`
	AuthLoginRefreshEndpoint         pulumi.StringOutput `pulumi:"authLoginRefreshEndpoint"`
	AuthRegisterInitEndpoint         pulumi.StringOutput `pulumi:"authRegisterInitEndpoint"`
	AuthRegisterVerifyEndpoint       pulumi.StringOutput `pulumi:"authRegisterVerifyEndpoint"`
	AuthRegisterVerifyResendEndpoint pulumi.StringOutput `pulumi:"authRegisterVerifyResendEndpoint"`
	AuthResetPasswordInitEndpoint    pulumi.StringOutput `pulumi:"authResetPasswordInitEndpoint"`
	AuthResetPasswordVerifyEndpoint  pulumi.StringOutput `pulumi:"authResetPasswordVerifyEndpoint"`
	AuthInviteUserEndpoint           pulumi.StringOutput `pulumi:"authInviteUserEndpoint"`
	OpenApiEndpoint                  pulumi.StringOutput `pulumi:"openApiEndpoint"`
	BucketMediaName                  pulumi.StringOutput `pulumi:"bucketMediaName"`
}

// NewApi creates a new Lambda component resource.
func NewApi(ctx *pulumi.Context,
	name string, args *ApiArgs, opts ...pulumi.ResourceOption) (*Api, error) {
	if args == nil {
		args = &ApiArgs{}
	}

	component := &Api{}
	err := ctx.RegisterComponentResource("gotiac:index:Api", name, component, opts...)
	if err != nil {
		return nil, err
	}

	corsConfiguration := &apigatewayv2.ApiCorsConfigurationArgs{
		AllowCredentials: pulumi.Bool(false),
		AllowHeaders: pulumi.StringArray{
			pulumi.String("Content-Type"),
			pulumi.String("X-Amz-Date"),
			pulumi.String("Authorization"),
			pulumi.String("X-Api-Key"),
			pulumi.String("X-Amz-Security-Token"),
			pulumi.String("X-Amz-User-Agent"),
			pulumi.String("Access-Control-Allow-Headers"),
			pulumi.String("Access-Control-Allow-Origin"),
			pulumi.String("x-as-admin"),
			pulumi.String("x-as-role"),
		},
		AllowMethods: pulumi.StringArray{
			pulumi.String("POST"),
		},
		AllowOrigins: pulumi.StringArray{
			pulumi.String("*"),
		},
		// ExposeHeaders: pulumi.StringArray{
		// 	pulumi.String("string"),
		// },
		// MaxAge: pulumi.Int(0),
	}

	api, err := apigatewayv2.NewApi(ctx, name+"Api", &apigatewayv2.ApiArgs{
		ProtocolType: pulumi.String("HTTP"),
		// FailOnWarnings: pulumi.Bool(false),
		CorsConfiguration: corsConfiguration,
	})
	if err != nil {
		return nil, err
	}

	stage, err := apigatewayv2.NewStage(ctx, name+"stage", &apigatewayv2.StageArgs{
		ApiId:      api.ID(),
		AutoDeploy: pulumi.Bool(true),
	})
	if err != nil {
		return nil, err
	}

	// convert the domain to a string
	certificate, err := acm.NewCertificate(ctx, name+"Certificate", &acm.CertificateArgs{
		DomainName:       args.DomainName,
		ValidationMethod: pulumi.String("DNS"),
	})
	if err != nil {
		return nil, err
	}

	// Look up the hosted zone for the domain
	hostedZoneId := util.LookUpHostedZone(ctx, args.DomainName)
	// Use the Route 53 HostedZone ID and Record Name/Type from the certificate's DomainValidationOptions to create a DNS record
	validationRecord := certificate.DomainValidationOptions.Index(pulumi.Int(0))
	// Create a Route 53 record set for the domain
	validationRecordEntry, err := route53.NewRecord(ctx, name+"CertificateValidationRecord", &route53.RecordArgs{
		Name:   validationRecord.ResourceRecordName().Elem(),
		Type:   validationRecord.ResourceRecordType().Elem(),
		ZoneId: hostedZoneId,
		Ttl:    pulumi.Int(300),
		Records: pulumi.StringArray{
			validationRecord.ResourceRecordValue().Elem(),
		},
		AllowOverwrite: pulumi.Bool(true),
	})
	if err != nil {
		return nil, err
	}

	// Create a validation object that encapsulates the certificate and its validation DNS entry
	certificateValidation, err := acm.NewCertificateValidation(ctx, name+"CertValidation", &acm.CertificateValidationArgs{
		CertificateArn: certificate.Arn,
	}, pulumi.DependsOn([]pulumi.Resource{certificate, validationRecordEntry}))
	if err != nil {
		return nil, err
	}

	domainName, err := apigatewayv2.NewDomainName(ctx, name+"DomainName", &apigatewayv2.DomainNameArgs{
		DomainName: args.DomainName,
		DomainNameConfiguration: &apigatewayv2.DomainNameDomainNameConfigurationArgs{
			CertificateArn: certificate.Arn,
			EndpointType:   pulumi.String("REGIONAL"),
			SecurityPolicy: pulumi.String("TLS_1_2"),
		},
	}, pulumi.DependsOn([]pulumi.Resource{certificateValidation}))
	if err != nil {
		return nil, err
	}

	_, err = route53.NewRecord(ctx, name+"DomainNameRecord", &route53.RecordArgs{
		Name:   domainName.DomainName,
		Type:   pulumi.String(route53.RecordTypeA),
		ZoneId: hostedZoneId,
		Aliases: route53.RecordAliasArray{
			&route53.RecordAliasArgs{
				Name: domainName.DomainNameConfiguration.TargetDomainName().ApplyT(func(targetDomainName *string) (string, error) {
					if targetDomainName != nil {
						return *targetDomainName, nil
					}
					return "", errors.New("targetDomainName is nil")
				}).(pulumi.StringOutput),
				ZoneId: domainName.DomainNameConfiguration.HostedZoneId().ApplyT(func(hostedZoneId *string) (string, error) {
					if hostedZoneId != nil {
						return *hostedZoneId, nil
					}
					return "", errors.New("hostedZoneId is nil")
				}).(pulumi.StringOutput),
				EvaluateTargetHealth: pulumi.Bool(false),
			},
		},
	})
	if err != nil {
		return nil, err
	}

	_, err = apigatewayv2.NewApiMapping(ctx, name+"ApiMapping", &apigatewayv2.ApiMappingArgs{
		ApiId:      api.ID().ToStringOutput(),
		Stage:      stage.ID().ToStringOutput(),
		DomainName: domainName.ID().ToStringOutput(),
	}, pulumi.DependsOn([]pulumi.Resource{domainName, api, stage}))
	if err != nil {
		return nil, err
	}

	userPool, err := cognito.GetUserPool(ctx, name, args.UserPoolId, &cognito.UserPoolState{})
	if err != nil {
		return nil, err
	}

	userPoolClient, err := cognito.NewUserPoolClient(ctx, name+"-userpoolclient", &cognito.UserPoolClientArgs{
		UserPoolId:     userPool.ID(),
		GenerateSecret: pulumi.Bool(false),
		ExplicitAuthFlows: pulumi.StringArray{
			pulumi.String("ADMIN_NO_SRP_AUTH"),
		},
	})
	if err != nil {
		return nil, err
	}

	authUserPolicy, err := iam.NewPolicy(ctx, name+"-auth-user-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for writing the got s3 storage"),
		Policy: pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"cognito-idp:InitiateAuth",
						"cognito-idp:RespondToAuthChallenge",
						"cognito-idp:SignUp",
						"cognito-idp:ConfirmSignUp",
						"cognito-idp:ResendConfirmationCode",
						"cognito-idp:ForgotPassword",
						"cognito-idp:ConfirmForgotPassword",
					},
					"Resource": []interface{}{
						userPool.Arn,
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	authAdminPolicy, err := iam.NewPolicy(ctx, name+"-auth-admin-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for writing the got s3 storage"),
		Policy: pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"cognito-idp:AdminGetUser",
						"cognito-idp:AdminCreateUser",
						"cognito-idp:AdminDeleteUser",
						"cognito-idp:AdminInitiateAuth",
						"cognito-idp:AdminRespondToAuthChallenge",
						"cognito-idp:AdminUpdateUserAttributes",
						"cognito-idp:AdminSetUserPassword",
					},
					"Resource": []interface{}{
						userPool.Arn,
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	ssmGetParameterPolicy, err := iam.NewPolicy(ctx, name+"-ssm-get-parameter-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for writing the got s3 storage"),
		Policy: pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"ssm:GetParameter",
					},
					"Resource": []interface{}{
						"*",
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	// Create Cognito Authorizer
	authorizer, err := apigatewayv2.NewAuthorizer(ctx, fmt.Sprintf("%s-Authorizer", name), &apigatewayv2.AuthorizerArgs{
		ApiId:          api.ID(),
		AuthorizerType: pulumi.String("JWT"),
		IdentitySources: pulumi.StringArray{
			pulumi.String("$request.header.Authorization"),
		},
		JwtConfiguration: &apigatewayv2.AuthorizerJwtConfigurationArgs{
			Audiences: pulumi.StringArray{
				userPool.ID(),
				userPoolClient.ID(),
			},
			Issuer: pulumi.Sprintf("https://%s", userPool.Endpoint),
		},
	})
	if err != nil {
		return nil, err
	}

	cloudfrontAccessKeyId := pulumi.String("").ToStringOutput()
	cloudfrontNewAccessKeyParameter := pulumi.String("").ToStringOutput()
	mediaDomain := pulumi.String("").ToStringOutput()
	var bucketMediaName *pulumi.StringInput
	if args.FileHosting != nil {
		cloudfrontAccessKeyId = args.FileHosting.PrivateKeyId.ToStringOutput()
		cloudfrontNewAccessKeyParameter = args.FileHosting.PrivateKeyParameterName.ToStringOutput()
		mediaDomain = args.FileHosting.Domain.ToStringOutput()
		bucketMediaName = &args.FileHosting.BucketName
	}

	graphStore, err := NewGraphStore(ctx, name+"-graph-store", &GraphStoreArgs{
		BucketNodesName:        args.BucketNodesName,
		BucketEdgesName:        args.BucketEdgesName,
		BucketReverseEdgesName: args.BucketReverseEdgesName,
		BucketRightsReadName:   args.BucketRightsReadName,
		BucketRightsWriteName:  args.BucketRightsWriteName,
		BucketRightsAdminName:  args.BucketRightsAdminName,
		BucketRightsOwnerName:  args.BucketRightsOwnerName,
		BucketMediaName:        bucketMediaName,
		ForceDestroy:           args.ForceStoreDestroy,
	})
	if err != nil {
		return nil, err
	}

	pullMem := pulumi.Int(2048)
	pullEnv := pulumi.StringMap{
		"BUCKET_NODES":                        graphStore.BucketNodesName,
		"BUCKET_EDGES":                        graphStore.BucketEdgesName,
		"BUCKET_REVERSE_EDGES":                graphStore.BucketReverseEdgesName,
		"BUCKET_RIGHTS_READ":                  graphStore.BucketRightsReadName,
		"BUCKET_RIGHTS_WRITE":                 graphStore.BucketRightsWriteName,
		"BUCKET_RIGHTS_ADMIN":                 graphStore.BucketRightsAdminName,
		"BUCKET_OWNERS":                       graphStore.BucketRightsOwnerName,
		"BUCKET_MEDIA":                        graphStore.BucketMediaName,
		"MEDIA_DOMAIN":                        mediaDomain,
		"CLOUDFRONT_ACCESS_KEY_ID":            cloudfrontAccessKeyId,
		"CLOUDFRONT_NEW_ACCESS_KEY_PARAMETER": cloudfrontNewAccessKeyParameter,
	}

	pullLambda, err := NewLambda(ctx, name+"PullInternal", &LambdaArgs{
		Runtime:     args.Runtime,
		CodePath:    pulumi.Sprintf("%s/pull.js", args.CodePath),
		HandlerPath: pulumi.String("pull.handleInvoke"),
		MemorySize:  &pullMem,
		PolicyArns: pulumi.StringArray{
			graphStore.StorageReadPolicyArn,
			ssmGetParameterPolicy.Arn,
			graphStore.mediaBucketReadPolicyArn,
		},
		Environment: pullEnv,
	})
	if err != nil {
		return nil, err
	}

	pullLambdaInvokePolicy, err := iam.NewPolicy(ctx, name+"-invoke-pull-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for writing the got s3 storage"),
		Policy: pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"lambda:InvokeFunction",
					},
					"Resource": []interface{}{
						pullLambda.Arn,
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	pullApiLambda, err := NewApiLambda(ctx, name+"PullApi", &ApiLambdaArgs{
		Runtime:      args.Runtime,
		CodePath:     pulumi.Sprintf("%s/pull.js", args.CodePath),
		HandlerPath:  pulumi.String("pull.handleHttp"),
		MemorySize:   &pullMem,
		Method:       pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			graphStore.StorageReadPolicyArn,
			ssmGetParameterPolicy.Arn,
			graphStore.mediaBucketReadPolicyArn,
		},
		ApiId:        api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath:    pulumi.String("/pull"),
		Environment:  pullEnv,
	})
	if err != nil {
		return nil, err
	}

	pushMem := pulumi.Int(2048)
	pushEnv := pulumi.StringMap{
		"BUCKET_NODES":                        graphStore.BucketNodesName,
		"BUCKET_EDGES":                        graphStore.BucketEdgesName,
		"BUCKET_REVERSE_EDGES":                graphStore.BucketReverseEdgesName,
		"BUCKET_RIGHTS_READ":                  graphStore.BucketRightsReadName,
		"BUCKET_RIGHTS_WRITE":                 graphStore.BucketRightsWriteName,
		"BUCKET_RIGHTS_ADMIN":                 graphStore.BucketRightsAdminName,
		"BUCKET_OWNERS":                       graphStore.BucketRightsOwnerName,
		"BUCKET_MEDIA":                        graphStore.BucketMediaName,
		"MEDIA_DOMAIN":                        mediaDomain,
		"CLOUDFRONT_ACCESS_KEY_ID":            cloudfrontAccessKeyId,
		"CLOUDFRONT_NEW_ACCESS_KEY_PARAMETER": cloudfrontNewAccessKeyParameter,
	}

	pushLambda, err := NewLambda(ctx, name+"PushInternal", &LambdaArgs{
		Runtime:     args.Runtime,
		CodePath:    pulumi.Sprintf("%s/push.js", args.CodePath),
		HandlerPath: pulumi.String("push.handleInvoke"),
		MemorySize:  &pushMem,
		PolicyArns: pulumi.StringArray{
			graphStore.StorageReadPolicyArn,
			graphStore.StorageWritePolicyArn,
			ssmGetParameterPolicy.Arn,
			graphStore.mediaBucketReadPolicyArn,
			graphStore.mediaBucketWritePolicyArn,
		},
		Environment: pushEnv,
	})
	if err != nil {
		return nil, err
	}

	pushLambdaInvokePolicy, err := iam.NewPolicy(ctx, name+"-invoke-push-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for writing the got s3 storage"),
		Policy: pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"lambda:InvokeFunction",
					},
					"Resource": []interface{}{
						pushLambda.Arn,
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	pushApiLambda, err := NewApiLambda(ctx, name+"PushApi", &ApiLambdaArgs{
		Runtime:      args.Runtime,
		CodePath:     pulumi.Sprintf("%s/push.js", args.CodePath),
		HandlerPath:  pulumi.String("push.handleHttp"),
		MemorySize:   &pushMem,
		Method:       pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			graphStore.StorageReadPolicyArn,
			graphStore.StorageWritePolicyArn,
			ssmGetParameterPolicy.Arn,
			graphStore.mediaBucketReadPolicyArn,
			graphStore.mediaBucketWritePolicyArn,
		},
		ApiId:        api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath:    pulumi.String("/push"),
		Environment:  pushEnv,
	})
	if err != nil {
		return nil, err
	}

	completeUploadEnv := pulumi.StringMap{
		"BUCKET_MEDIA": graphStore.BucketMediaName,
	}

	_, err = NewApiLambda(ctx, name+"CompleteUploadApi", &ApiLambdaArgs{
		Runtime:      args.Runtime,
		CodePath:     pulumi.Sprintf("%s/completeUpload.js", args.CodePath),
		HandlerPath:  pulumi.String("completeUpload.handleHttp"),
		Method:       pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			graphStore.mediaBucketReadPolicyArn,
			graphStore.mediaBucketWritePolicyArn,
		},
		ApiId:        api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath:    pulumi.String("/media/complete-upload"),
		Environment:  completeUploadEnv,
	})
	if err != nil {
		return nil, err
	}

	var inviteUserValidationView pulumi.StringOutput
	if args.InviteUserValidationView != nil {
		inviteUserValidationView = (*args.InviteUserValidationView).ToStringOutput()
	} else {
		inviteUserValidationView = pulumi.String("{\"root\":{\"edges\":{\"from/to\":{\"include\":{\"rights\":true}}}}}").ToStringOutput()
	}

	AuthMem := pulumi.Int(512)
	AuthEnv := pulumi.StringMap{
		"USER_POOL_ID":                userPool.ID(),
		"CLIENT_ID":                   userPoolClient.ID(),
		"INVITE_USER_VALIDATION_VIEW": inviteUserValidationView,
		"PULL_LAMBDA_NAME":            pullLambda.Name,
	}

	AuthLoginInitApiLambda, err := NewApiLambda(ctx, name+"AuthLoginInit", &ApiLambdaArgs{
		Runtime:     args.Runtime,
		CodePath:    pulumi.Sprintf("%s/auth/login-init.js", args.CodePath),
		HandlerPath: pulumi.String("login-init.handleHttp"),
		MemorySize:  &AuthMem,
		Method:      pulumi.String("POST"),
		PolicyArns: pulumi.StringArray{
			authUserPolicy.Arn,
		},
		ApiId:        api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath:    pulumi.String("/auth/login-init"),
		Environment:  AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	AuthLoginVerifyApiLambda, err := NewApiLambda(ctx, name+"AuthLoginVerify", &ApiLambdaArgs{
		Runtime:     args.Runtime,
		CodePath:    pulumi.Sprintf("%s/auth/login-verify.js", args.CodePath),
		HandlerPath: pulumi.String("login-verify.handleHttp"),
		MemorySize:  &AuthMem,
		Method:      pulumi.String("POST"),
		PolicyArns: pulumi.StringArray{
			authUserPolicy.Arn,
		},
		ApiId:        api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath:    pulumi.String("/auth/login-verify"),
		Environment:  AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	AuthLoginRefreshApiLambda, err := NewApiLambda(ctx, name+"AuthLoginRefresh", &ApiLambdaArgs{
		Runtime:     args.Runtime,
		CodePath:    pulumi.Sprintf("%s/auth/login-refresh.js", args.CodePath),
		HandlerPath: pulumi.String("login-refresh.handleHttp"),
		MemorySize:  &AuthMem,
		Method:      pulumi.String("POST"),
		PolicyArns: pulumi.StringArray{
			authUserPolicy.Arn,
		},
		ApiId:        api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath:    pulumi.String("/auth/login-refresh"),
		Environment:  AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	AuthRegisterInitApiLambda, err := NewApiLambda(ctx, name+"AuthRegisterInit", &ApiLambdaArgs{
		Runtime:     args.Runtime,
		CodePath:    pulumi.Sprintf("%s/auth/register-init.js", args.CodePath),
		HandlerPath: pulumi.String("register-init.handleHttp"),
		MemorySize:  &AuthMem,
		Method:      pulumi.String("POST"),
		PolicyArns: pulumi.StringArray{
			authUserPolicy.Arn,
		},
		ApiId:        api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath:    pulumi.String("/auth/register-init"),
		Environment:  AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	AuthRegisterVerifyApiLambda, err := NewApiLambda(ctx, name+"AuthRegisterVerify", &ApiLambdaArgs{
		Runtime:     args.Runtime,
		CodePath:    pulumi.Sprintf("%s/auth/register-verify.js", args.CodePath),
		HandlerPath: pulumi.String("register-verify.handleHttp"),
		MemorySize:  &AuthMem,
		Method:      pulumi.String("POST"),
		PolicyArns: pulumi.StringArray{
			authUserPolicy.Arn,
		},
		ApiId:        api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath:    pulumi.String("/auth/register-verify"),
		Environment:  AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	AuthRegisterVerifyResendApiLambda, err := NewApiLambda(ctx, name+"AuthRegisterVerifyResend", &ApiLambdaArgs{
		Runtime:     args.Runtime,
		CodePath:    pulumi.Sprintf("%s/auth/register-verify-resend.js", args.CodePath),
		HandlerPath: pulumi.String("register-verify-resend.handleHttp"),
		MemorySize:  &AuthMem,
		Method:      pulumi.String("POST"),
		PolicyArns: pulumi.StringArray{
			authUserPolicy.Arn,
		},
		ApiId:        api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath:    pulumi.String("/auth/register-verify-resend"),
		Environment:  AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	AuthResetPasswordInitApiLambda, err := NewApiLambda(ctx, name+"AuthResetPasswordInit", &ApiLambdaArgs{
		Runtime:     args.Runtime,
		CodePath:    pulumi.Sprintf("%s/auth/reset-password-init.js", args.CodePath),
		HandlerPath: pulumi.String("reset-password-init.handleHttp"),
		MemorySize:  &AuthMem,
		Method:      pulumi.String("POST"),
		PolicyArns: pulumi.StringArray{
			authUserPolicy.Arn,
			authAdminPolicy.Arn,
		},
		ApiId:        api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath:    pulumi.String("/auth/reset-password-init"),
		Environment:  AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	AuthResetPasswordVerifyApiLambda, err := NewApiLambda(ctx, name+"AuthResetPasswordVerify", &ApiLambdaArgs{
		Runtime:     args.Runtime,
		CodePath:    pulumi.Sprintf("%s/auth/reset-password-verify.js", args.CodePath),
		HandlerPath: pulumi.String("reset-password-verify.handleHttp"),
		MemorySize:  &AuthMem,
		Method:      pulumi.String("POST"),
		PolicyArns: pulumi.StringArray{
			authUserPolicy.Arn,
			authAdminPolicy.Arn,
		},
		ApiId:        api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath:    pulumi.String("/auth/reset-password-verify"),
		Environment:  AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	AuthInviteUserApiLambda, err := NewApiLambda(ctx, name+"AuthInviteUser", &ApiLambdaArgs{
		Runtime:      args.Runtime,
		CodePath:     pulumi.Sprintf("%s/auth/invite-user.js", args.CodePath),
		HandlerPath:  pulumi.String("invite-user.handleHttp"),
		MemorySize:   &AuthMem,
		Method:       pulumi.String("POST"),
		AuthorizerId: authorizer.ID(),
		PolicyArns: pulumi.StringArray{
			authUserPolicy.Arn,
			authAdminPolicy.Arn,
			pullLambdaInvokePolicy.Arn,
		},
		ApiId:        api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath:    pulumi.String("/auth/invite-user"),
		Environment:  AuthEnv,
	})
	if err != nil {
		return nil, err
	}

	OpenApiApiLambda, err := NewApiLambda(ctx, name+"OpenApi", &ApiLambdaArgs{
		Runtime:      args.Runtime,
		CodePath:     pulumi.Sprintf("%s/api.js", args.CodePath),
		HandlerPath:  pulumi.String("api.handleHttp"),
		MemorySize:   &AuthMem,
		Method:       pulumi.String("GET"),
		PolicyArns:   pulumi.StringArray{},
		ApiId:        api.ID(),
		ExecutionArn: api.ExecutionArn,
		RoutePath:    pulumi.String("/api"),
		Environment:  pulumi.StringMap{},
	})
	if err != nil {
		return nil, err
	}

	component.Endpoint = args.DomainName.ToStringOutput()
	// component.PullFunction = pullLambda.Function
	component.PullEndpoint = pullApiLambda.Route.RouteKey()
	// component.PushFunction = pushLambda.Function
	component.PushEndpoint = pushApiLambda.Route.RouteKey()
	component.PullInvokePolicyArn = pullLambdaInvokePolicy.Arn
	component.PushInvokePolicyArn = pushLambdaInvokePolicy.Arn
	component.AuthLoginInitEndpoint = AuthLoginInitApiLambda.Route.RouteKey()
	component.AuthLoginVerifyEndpoint = AuthLoginVerifyApiLambda.Route.RouteKey()
	component.AuthLoginRefreshEndpoint = AuthLoginRefreshApiLambda.Route.RouteKey()
	component.AuthRegisterInitEndpoint = AuthRegisterInitApiLambda.Route.RouteKey()
	component.AuthRegisterVerifyEndpoint = AuthRegisterVerifyApiLambda.Route.RouteKey()
	component.AuthRegisterVerifyResendEndpoint = AuthRegisterVerifyResendApiLambda.Route.RouteKey()
	component.AuthResetPasswordInitEndpoint = AuthResetPasswordInitApiLambda.Route.RouteKey()
	component.AuthResetPasswordVerifyEndpoint = AuthResetPasswordVerifyApiLambda.Route.RouteKey()
	component.AuthInviteUserEndpoint = AuthInviteUserApiLambda.Route.RouteKey()
	component.OpenApiEndpoint = OpenApiApiLambda.Route.RouteKey()
	component.BucketMediaName = graphStore.BucketMediaName

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{
		"endpoint":     args.DomainName,
		"pullFunction": pullLambda.Function,
		"pullEndpoint": pullApiLambda.Route.RouteKey(),
	}); err != nil {
		return nil, err
	}

	return component, nil
}
