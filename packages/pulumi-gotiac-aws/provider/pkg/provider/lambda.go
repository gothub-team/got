package provider

import (
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/cloudwatch"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/iam"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/lambda"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a Lambda component resource.
type LambdaArgs struct {
	// The the path to the .zip for the lambda code
	CodePath pulumi.StringInput `pulumi:"codePath"`
	// The handler for the lambda function
	HandlerPath pulumi.StringInput `pulumi:"handlerPath"`
	// The memory size for the lambda function
	MemorySize *pulumi.Int `pulumi:"memorySize"`
	// The lambda runtime
	Runtime pulumi.StringInput `pulumi:"runtime"`
	// Map of environment variables to pass to the lambda function
	Environment pulumi.StringMapInput `pulumi:"environment"`
	// The array of policy arns that should be attachen to the lambda function role
	PolicyArns pulumi.StringArrayInput `pulumi:"policyArns"`
}

// The Lambda component resource.
type Lambda struct {
	pulumi.ResourceState
	// The name of the lambda resource
	Name pulumi.StringOutput `pulumi:"name"`
	// The ARN of the lambda resource
	Arn pulumi.StringOutput `pulumi:"arn"`
	// The role of the lambda resource
	Role iam.RoleOutput `pulumi:"role"`
	// The role of the lambda resource
	Function lambda.FunctionOutput `pulumi:"function"`
}

// NewLambda creates a new Lambda component resource.
func NewLambda(ctx *pulumi.Context,
	name string, args *LambdaArgs, opts ...pulumi.ResourceOption) (*Lambda, error) {
	if args == nil {
		args = &LambdaArgs{}
	}

	component := &Lambda{}
	err := ctx.RegisterComponentResource("gotiac:index:Lambda", name, component, opts...)
	if err != nil {
		return nil, err
	}

	// Create a log group for the lambda function
	logGroup, err := cloudwatch.NewLogGroup(ctx, name, &cloudwatch.LogGroupArgs{
		Name:            pulumi.String("/aws/lambda/" + name),
		RetentionInDays: pulumi.Int(30),
	})
	if err != nil {
		return nil, err
	}

	loggingPolicy, err := iam.NewPolicy(ctx, name+"-logging", &iam.PolicyArgs{
		Name:        pulumi.String(name + "-logging"),
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for logging from a lambda"),
		Policy: pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"logs:CreateLogStream",
					},
					"Resource": []interface{}{
						pulumi.Sprintf("%v*:*", logGroup.Arn),
					},
				},
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"logs:PutLogEvents",
					},
					"Resource": []interface{}{
						pulumi.Sprintf("%v*:*:*", logGroup.Arn),
					},
				},
			},
		}),
	}, pulumi.DependsOn([]pulumi.Resource{logGroup}))
	if err != nil {
		return nil, err
	}

	allow := "Allow"
	assumeRolePolicy, err := iam.GetPolicyDocument(ctx, &iam.GetPolicyDocumentArgs{
		Statements: []iam.GetPolicyDocumentStatement{
			{
				Effect: &allow,
				Actions: []string{
					"sts:AssumeRole",
				},
				Principals: []iam.GetPolicyDocumentStatementPrincipal{
					{
						Type: "Service",
						Identifiers: []string{
							"lambda.amazonaws.com",
						},
					},
				},
			},
		},
	}, nil)
	if err != nil {
		return nil, err
	}

	iamRole, err := iam.NewRole(ctx, name+"-role", &iam.RoleArgs{
		Name:             pulumi.String(name + "-role"),
		AssumeRolePolicy: pulumi.String(assumeRolePolicy.Json),
		ManagedPolicyArns: pulumi.All(args.PolicyArns, loggingPolicy.Arn).ApplyT(func(args []interface{}) []string {
			return append(args[0].([]string), args[1].(string))
		}).(pulumi.StringArrayOutput),
	}, pulumi.DependsOn([]pulumi.Resource{loggingPolicy}))
	if err != nil {
		return nil, err
	}

	var memorySize pulumi.Int
	if args.MemorySize != nil {
		memorySize = *args.MemorySize
	} else {
		memorySize = pulumi.Int(512)
	}

	lambdaFunction, err := lambda.NewFunction(ctx, name, &lambda.FunctionArgs{
		Code:    args.CodePath.ToStringOutput().ApplyT(func(s string) pulumi.Archive { return pulumi.NewFileArchive(s) }).(pulumi.ArchiveOutput),
		Name:    pulumi.String(name),
		Role:    iamRole.Arn,
		Handler: args.HandlerPath,
		Runtime: args.Runtime,
		Timeout: pulumi.Int(30),
		Environment: &lambda.FunctionEnvironmentArgs{
			Variables: args.Environment,
		},
		MemorySize: memorySize,
	}, pulumi.DependsOn([]pulumi.Resource{iamRole}))
	if err != nil {
		return nil, err
	}

	component.Name = lambdaFunction.Name
	component.Arn = lambdaFunction.Arn
	component.Role = iamRole.ToRoleOutput()
	component.Function = lambdaFunction.ToFunctionOutput()

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{
		"name":     lambdaFunction.Name,
		"arn":      lambdaFunction.Arn,
		"role":     iamRole,
		"function": lambdaFunction,
	}); err != nil {
		return nil, err
	}

	return component, nil
}
