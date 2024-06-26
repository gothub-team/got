// Code generated by Pulumi SDK Generator DO NOT EDIT.
// *** WARNING: Do not edit by hand unless you're certain you know what you are doing! ***

package sdk

import (
	"context"
	"reflect"

	"errors"
	"github.com/gothub-team/got/packages/pulumi-gotiac-aws/sdk/internal"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

type FileHosting struct {
	pulumi.ResourceState

	// The ID the private key.
	PrivateKeyId pulumi.StringOutput `pulumi:"privateKeyId"`
	// The parameter name for the private key.
	PrivateKeyParameterName pulumi.StringOutput `pulumi:"privateKeyParameterName"`
	// The file hosting URL.
	Url pulumi.StringOutput `pulumi:"url"`
}

// NewFileHosting registers a new resource with the given unique name, arguments, and options.
func NewFileHosting(ctx *pulumi.Context,
	name string, args *FileHostingArgs, opts ...pulumi.ResourceOption) (*FileHosting, error) {
	if args == nil {
		return nil, errors.New("missing one or more required arguments")
	}

	if args.Domain == nil {
		return nil, errors.New("invalid value for required argument 'Domain'")
	}
	opts = internal.PkgResourceDefaultOpts(opts)
	var resource FileHosting
	err := ctx.RegisterRemoteComponentResource("gotiac:index:FileHosting", name, args, &resource, opts...)
	if err != nil {
		return nil, err
	}
	return &resource, nil
}

type fileHostingArgs struct {
	// The name of an existing s3 Bucket to link as origin. If not provided, a new bucket will be created.
	BucketName *string `pulumi:"bucketName"`
	// The file hosting domain.
	Domain string `pulumi:"domain"`
}

// The set of arguments for constructing a FileHosting resource.
type FileHostingArgs struct {
	// The name of an existing s3 Bucket to link as origin. If not provided, a new bucket will be created.
	BucketName pulumi.StringPtrInput
	// The file hosting domain.
	Domain pulumi.StringInput
}

func (FileHostingArgs) ElementType() reflect.Type {
	return reflect.TypeOf((*fileHostingArgs)(nil)).Elem()
}

type FileHostingInput interface {
	pulumi.Input

	ToFileHostingOutput() FileHostingOutput
	ToFileHostingOutputWithContext(ctx context.Context) FileHostingOutput
}

func (*FileHosting) ElementType() reflect.Type {
	return reflect.TypeOf((**FileHosting)(nil)).Elem()
}

func (i *FileHosting) ToFileHostingOutput() FileHostingOutput {
	return i.ToFileHostingOutputWithContext(context.Background())
}

func (i *FileHosting) ToFileHostingOutputWithContext(ctx context.Context) FileHostingOutput {
	return pulumi.ToOutputWithContext(ctx, i).(FileHostingOutput)
}

// FileHostingArrayInput is an input type that accepts FileHostingArray and FileHostingArrayOutput values.
// You can construct a concrete instance of `FileHostingArrayInput` via:
//
//	FileHostingArray{ FileHostingArgs{...} }
type FileHostingArrayInput interface {
	pulumi.Input

	ToFileHostingArrayOutput() FileHostingArrayOutput
	ToFileHostingArrayOutputWithContext(context.Context) FileHostingArrayOutput
}

type FileHostingArray []FileHostingInput

func (FileHostingArray) ElementType() reflect.Type {
	return reflect.TypeOf((*[]*FileHosting)(nil)).Elem()
}

func (i FileHostingArray) ToFileHostingArrayOutput() FileHostingArrayOutput {
	return i.ToFileHostingArrayOutputWithContext(context.Background())
}

func (i FileHostingArray) ToFileHostingArrayOutputWithContext(ctx context.Context) FileHostingArrayOutput {
	return pulumi.ToOutputWithContext(ctx, i).(FileHostingArrayOutput)
}

// FileHostingMapInput is an input type that accepts FileHostingMap and FileHostingMapOutput values.
// You can construct a concrete instance of `FileHostingMapInput` via:
//
//	FileHostingMap{ "key": FileHostingArgs{...} }
type FileHostingMapInput interface {
	pulumi.Input

	ToFileHostingMapOutput() FileHostingMapOutput
	ToFileHostingMapOutputWithContext(context.Context) FileHostingMapOutput
}

type FileHostingMap map[string]FileHostingInput

func (FileHostingMap) ElementType() reflect.Type {
	return reflect.TypeOf((*map[string]*FileHosting)(nil)).Elem()
}

func (i FileHostingMap) ToFileHostingMapOutput() FileHostingMapOutput {
	return i.ToFileHostingMapOutputWithContext(context.Background())
}

func (i FileHostingMap) ToFileHostingMapOutputWithContext(ctx context.Context) FileHostingMapOutput {
	return pulumi.ToOutputWithContext(ctx, i).(FileHostingMapOutput)
}

type FileHostingOutput struct{ *pulumi.OutputState }

func (FileHostingOutput) ElementType() reflect.Type {
	return reflect.TypeOf((**FileHosting)(nil)).Elem()
}

func (o FileHostingOutput) ToFileHostingOutput() FileHostingOutput {
	return o
}

func (o FileHostingOutput) ToFileHostingOutputWithContext(ctx context.Context) FileHostingOutput {
	return o
}

// The ID the private key.
func (o FileHostingOutput) PrivateKeyId() pulumi.StringOutput {
	return o.ApplyT(func(v *FileHosting) pulumi.StringOutput { return v.PrivateKeyId }).(pulumi.StringOutput)
}

// The parameter name for the private key.
func (o FileHostingOutput) PrivateKeyParameterName() pulumi.StringOutput {
	return o.ApplyT(func(v *FileHosting) pulumi.StringOutput { return v.PrivateKeyParameterName }).(pulumi.StringOutput)
}

// The file hosting URL.
func (o FileHostingOutput) Url() pulumi.StringOutput {
	return o.ApplyT(func(v *FileHosting) pulumi.StringOutput { return v.Url }).(pulumi.StringOutput)
}

type FileHostingArrayOutput struct{ *pulumi.OutputState }

func (FileHostingArrayOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*[]*FileHosting)(nil)).Elem()
}

func (o FileHostingArrayOutput) ToFileHostingArrayOutput() FileHostingArrayOutput {
	return o
}

func (o FileHostingArrayOutput) ToFileHostingArrayOutputWithContext(ctx context.Context) FileHostingArrayOutput {
	return o
}

func (o FileHostingArrayOutput) Index(i pulumi.IntInput) FileHostingOutput {
	return pulumi.All(o, i).ApplyT(func(vs []interface{}) *FileHosting {
		return vs[0].([]*FileHosting)[vs[1].(int)]
	}).(FileHostingOutput)
}

type FileHostingMapOutput struct{ *pulumi.OutputState }

func (FileHostingMapOutput) ElementType() reflect.Type {
	return reflect.TypeOf((*map[string]*FileHosting)(nil)).Elem()
}

func (o FileHostingMapOutput) ToFileHostingMapOutput() FileHostingMapOutput {
	return o
}

func (o FileHostingMapOutput) ToFileHostingMapOutputWithContext(ctx context.Context) FileHostingMapOutput {
	return o
}

func (o FileHostingMapOutput) MapIndex(k pulumi.StringInput) FileHostingOutput {
	return pulumi.All(o, k).ApplyT(func(vs []interface{}) *FileHosting {
		return vs[0].(map[string]*FileHosting)[vs[1].(string)]
	}).(FileHostingOutput)
}

func init() {
	pulumi.RegisterInputType(reflect.TypeOf((*FileHostingInput)(nil)).Elem(), &FileHosting{})
	pulumi.RegisterInputType(reflect.TypeOf((*FileHostingArrayInput)(nil)).Elem(), FileHostingArray{})
	pulumi.RegisterInputType(reflect.TypeOf((*FileHostingMapInput)(nil)).Elem(), FileHostingMap{})
	pulumi.RegisterOutputType(FileHostingOutput{})
	pulumi.RegisterOutputType(FileHostingArrayOutput{})
	pulumi.RegisterOutputType(FileHostingMapOutput{})
}
