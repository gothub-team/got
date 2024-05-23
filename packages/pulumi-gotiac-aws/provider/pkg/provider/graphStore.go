package provider

import (
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/iam"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/s3"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a GraphStore component resource.
type GraphStoreArgs struct {
	BucketNodesName *pulumi.StringInput `pulumi:"bucketNodesName"` 
	BucketEdgesName *pulumi.StringInput `pulumi:"bucketEdgesName"` 
	BucketReverseEdgesName *pulumi.StringInput `pulumi:"bucketReverseEdgesName"` 
	BucketRightsReadName *pulumi.StringInput `pulumi:"bucketRightsReadName"` 
	BucketRightsWriteName *pulumi.StringInput `pulumi:"bucketRightsWriteName"` 
	BucketRightsAdminName *pulumi.StringInput `pulumi:"bucketRightsAdminName"` 
	BucketRightsOwnerName *pulumi.StringInput `pulumi:"bucketRightsOwnerName"` 
}

// The GraphStore component resource.
type GraphStore struct {
	pulumi.ResourceState
	BucketNodes BucketInfo `pulumi:"bucketNodes"`
	BucketEdges BucketInfo `pulumi:"bucketEdges"`
	BucketReverseEdges BucketInfo `pulumi:"bucketReverseEdges"`
	BucketRightsRead BucketInfo `pulumi:"bucketRightsRead"`
	BucketRightsWrite BucketInfo `pulumi:"bucketRightsWrite"`
	BucketRightsAdmin BucketInfo `pulumi:"bucketRightsAdmin"`
	BucketRightsOwner BucketInfo `pulumi:"bucketRightsOwner"`
	storageReadPolicyArn pulumi.StringOutput `pulumi:"storageReadPolicyArn"`
	storageWritePolicyArn pulumi.StringOutput `pulumi:"storageWritePolicyArn"`
}

type BucketInfo struct {
	Name pulumi.StringInput
	Arn pulumi.StringInput
}

// NewGraphStore creates a new GraphStore component resource.
func NewGraphStore(ctx *pulumi.Context,
	name string, args *GraphStoreArgs, opts ...pulumi.ResourceOption) (*GraphStore, error) {
	if args == nil {
		args = &GraphStoreArgs{}
	}

	component := &GraphStore{}
	err := ctx.RegisterComponentResource("gotiac:index:GraphStore", name, component, opts...)
	if err != nil {
		return nil, err
	}

	// create nodes bucket
	bucketNodes, err  := lookupOrCreateBucket(ctx, args.BucketNodesName, name + "-nodes")
	if err != nil {
		return nil, err
	}

	// create edges buckets
	bucketEdges, err  := lookupOrCreateBucket(ctx, args.BucketEdgesName, name + "-edges")
	if err != nil {
		return nil, err
	}
	bucketReverseEdges, err  := lookupOrCreateBucket(ctx, args.BucketReverseEdgesName, name + "-reverse-edges")
	if err != nil {
		return nil, err
	}

	// create right buckets
	bucketRightsRead, err  := lookupOrCreateBucket(ctx, args.BucketRightsReadName, name + "-rights-read")
	if err != nil {
		return nil, err
	}
	bucketRightsWrite, err  := lookupOrCreateBucket(ctx, args.BucketRightsWriteName, name + "-rights-write")
	if err != nil {
		return nil, err
	}
	bucketRightsAdmin, err  := lookupOrCreateBucket(ctx, args.BucketRightsAdminName, name + "-rights-admin")
	if err != nil {
		return nil, err
	}
	bucketRightsOwner, err  := lookupOrCreateBucket(ctx, args.BucketRightsOwnerName, name + "-rights-owner")
	if err != nil {
		return nil, err
	}

	storageReadPolicy, err := iam.NewPolicy(ctx, name + "-storage-read-policy", &iam.PolicyArgs{
		Name:        pulumi.String(name + "-storage-read-policy"),
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for reading the got s3 storage"),
		Policy:      pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"s3:GetObject",
						"s3:GetObjectVersion",
					},
					"Resource": []interface{}{
						pulumi.Sprintf("%v/*", bucketNodes.Arn),
						pulumi.Sprintf("%v/*", bucketEdges.Arn),
						pulumi.Sprintf("%v/*", bucketReverseEdges.Arn),
						pulumi.Sprintf("%v/*", bucketRightsRead.Arn),
						pulumi.Sprintf("%v/*", bucketRightsWrite.Arn),
						pulumi.Sprintf("%v/*", bucketRightsAdmin.Arn),
						pulumi.Sprintf("%v/*", bucketRightsOwner.Arn),
					},
				},
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"s3:ListBucket",
					},
					"Resource": []interface{}{
						pulumi.Sprintf("%v", bucketNodes.Arn),
						pulumi.Sprintf("%v", bucketEdges.Arn),
						pulumi.Sprintf("%v", bucketReverseEdges.Arn),
						pulumi.Sprintf("%v", bucketRightsRead.Arn),
						pulumi.Sprintf("%v", bucketRightsWrite.Arn),
						pulumi.Sprintf("%v", bucketRightsAdmin.Arn),
						pulumi.Sprintf("%v", bucketRightsOwner.Arn),
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}
	
	storageWritePolicy, err := iam.NewPolicy(ctx, name + "-storage-write-policy", &iam.PolicyArgs{
		Name:        pulumi.String(name + "-storage-write-policy"),
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for writing the got s3 storage"),
		Policy:      pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"s3:DeleteObject",
						"s3:PutObject",
						"s3:RestoreObject",
					},
					"Resource": []interface{}{
						pulumi.Sprintf("%v/*", bucketNodes.Arn),
						pulumi.Sprintf("%v/*", bucketEdges.Arn),
						pulumi.Sprintf("%v/*", bucketReverseEdges.Arn),
						pulumi.Sprintf("%v/*", bucketRightsRead.Arn),
						pulumi.Sprintf("%v/*", bucketRightsWrite.Arn),
						pulumi.Sprintf("%v/*", bucketRightsAdmin.Arn),
						pulumi.Sprintf("%v/*", bucketRightsOwner.Arn),
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	component.BucketNodes = *bucketNodes
	component.BucketEdges = *bucketEdges
	component.BucketReverseEdges = *bucketReverseEdges
	component.BucketRightsRead = *bucketRightsRead
	component.BucketRightsWrite = *bucketRightsWrite
	component.BucketRightsAdmin = *bucketRightsAdmin
	component.BucketRightsOwner = *bucketRightsOwner
	component.storageReadPolicyArn = storageReadPolicy.Arn
	component.storageWritePolicyArn = storageWritePolicy.Arn

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{

	}); err != nil {
		return nil, err
	}

	return component, nil
}

func lookupOrCreateBucket (ctx *pulumi.Context, name *pulumi.StringInput, fallbackName string) (*BucketInfo, error) {
	var bucketName pulumi.StringInput
	var bucketArn pulumi.StringInput
	if name != nil {
		bucketName = *name
		// Look up the bucket regional domain name
		bucketArn = (*name).ToStringOutput().ApplyT(func(name string) (string, error) {
			lookupResult, err := s3.LookupBucket(ctx, &s3.LookupBucketArgs{
				Bucket: name,
			})
			if err != nil {
				return "", err
			}

			return lookupResult.Arn, nil
		}).(pulumi.StringInput)
	} else {
		// Create an S3 bucket to host files for the FileHosting service
		bucket, err := s3.NewBucket(ctx, fallbackName, &s3.BucketArgs{})
		if err != nil {
			return nil, err
		}
		bucketName = bucket.Bucket
		bucketArn = bucket.Arn
	}

	return &BucketInfo{
		Name: bucketName,
		Arn: bucketArn,
	}, nil
}