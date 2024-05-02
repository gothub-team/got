
package provider

import (
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/iam"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/lambda"
)

// The set of arguments for creating a Lambda component resource.
type LambdaArgs struct {
	// The name of the lambda function
	Name pulumi:StringInput `pulumi:"name"`
	// The the path to the .zip for the lambda code
	CodePath pulumi:StringInput `pulumi:"codePath"`
	// The array of policy arns that should be attachen to the lambda function role
	PolicyArns pulumi:StringInput[] `pulumi:"policyArns"`
}

// The Lambda component resource.
type Lambda struct {
	pulumi.ResourceState

	// The name of the lambda resource
	Name pulumi.StringOutput `pulumi:"name"`
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

	

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{
		//"password": component.Password,
	}); err != nil {
		return nil, err
	}

	return component, nil
}
