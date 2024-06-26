package provider

import (
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/iam"
	"github.com/pulumi/pulumi-aws/sdk/v6/go/aws/s3"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
)

// The set of arguments for creating a GraphStore component resource.
type GraphStoreArgs struct {
	BucketNodesName        *pulumi.StringInput `pulumi:"bucketNodesName"`
	BucketEdgesName        *pulumi.StringInput `pulumi:"bucketEdgesName"`
	BucketReverseEdgesName *pulumi.StringInput `pulumi:"bucketReverseEdgesName"`
	BucketRightsReadName   *pulumi.StringInput `pulumi:"bucketRightsReadName"`
	BucketRightsWriteName  *pulumi.StringInput `pulumi:"bucketRightsWriteName"`
	BucketRightsAdminName  *pulumi.StringInput `pulumi:"bucketRightsAdminName"`
	BucketRightsOwnerName  *pulumi.StringInput `pulumi:"bucketRightsOwnerName"`
	BucketLogsName         *pulumi.StringInput `pulumi:"bucketLogsName"`
	BucketMediaName        *pulumi.StringInput `pulumi:"bucketMediaName"`
	ForceDestroy           *pulumi.BoolInput   `pulumi:"forceDestroy"`
}

// The GraphStore component resource.
type GraphStore struct {
	pulumi.ResourceState
	BucketNodesName           pulumi.StringOutput `pulumi:"bucketNodesName"`
	BucketEdgesName           pulumi.StringOutput `pulumi:"bucketEdges"`
	BucketReverseEdgesName    pulumi.StringOutput `pulumi:"bucketReverseEdges"`
	BucketRightsReadName      pulumi.StringOutput `pulumi:"bucketRightsRead"`
	BucketRightsWriteName     pulumi.StringOutput `pulumi:"bucketRightsWrite"`
	BucketRightsAdminName     pulumi.StringOutput `pulumi:"bucketRightsAdmin"`
	BucketRightsOwnerName     pulumi.StringOutput `pulumi:"bucketRightsOwner"`
	BucketLogsName            pulumi.StringOutput `pulumi:"bucketLogs"`
	BucketMediaName           pulumi.StringOutput `pulumi:"bucketMedia"`
	StorageReadPolicyArn      pulumi.StringOutput `pulumi:"storageReadPolicyArn"`
	StorageWritePolicyArn     pulumi.StringOutput `pulumi:"storageWritePolicyArn"`
	logsBucketReadPolicyArn   pulumi.StringOutput `pulumi:"logsBucketReadPolicyArn"`
	logsBucketWritePolicyArn  pulumi.StringOutput `pulumi:"logsBucketWritePolicyArn"`
	mediaBucketReadPolicyArn  pulumi.StringOutput `pulumi:"mediaBucketReadPolicyArn"`
	mediaBucketWritePolicyArn pulumi.StringOutput `pulumi:"mediaBucketWritePolicyArn"`
}

type BucketInfo struct {
	Name pulumi.StringInput
	Arn  pulumi.StringInput
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
	bucketNodes, err := lookupOrCreateBucket(ctx, args.BucketNodesName, name+"-nodes", args.ForceDestroy)
	if err != nil {
		return nil, err
	}

	// create edges buckets
	bucketEdges, err := lookupOrCreateBucket(ctx, args.BucketEdgesName, name+"-edges", args.ForceDestroy)
	if err != nil {
		return nil, err
	}
	bucketReverseEdges, err := lookupOrCreateBucket(ctx, args.BucketReverseEdgesName, name+"-reverse-edges", args.ForceDestroy)
	if err != nil {
		return nil, err
	}

	// create right buckets
	bucketRightsRead, err := lookupOrCreateBucket(ctx, args.BucketRightsReadName, name+"-rights-read", args.ForceDestroy)
	if err != nil {
		return nil, err
	}
	bucketRightsWrite, err := lookupOrCreateBucket(ctx, args.BucketRightsWriteName, name+"-rights-write", args.ForceDestroy)
	if err != nil {
		return nil, err
	}
	bucketRightsAdmin, err := lookupOrCreateBucket(ctx, args.BucketRightsAdminName, name+"-rights-admin", args.ForceDestroy)
	if err != nil {
		return nil, err
	}
	bucketRightsOwner, err := lookupOrCreateBucket(ctx, args.BucketRightsOwnerName, name+"-rights-owner", args.ForceDestroy)
	if err != nil {
		return nil, err
	}
	bucketLogs, err := lookupOrCreateBucket(ctx, args.BucketRightsOwnerName, name+"-logs", args.ForceDestroy)
	if err != nil {
		return nil, err
	}
	bucketMedia, err := lookupOrCreateBucket(ctx, args.BucketMediaName, name+"-media", args.ForceDestroy)
	if err != nil {
		return nil, err
	}

	storageReadPolicy, err := iam.NewPolicy(ctx, name+"-storage-read-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for reading the got s3 storage"),
		Policy: pulumi.Any(map[string]interface{}{
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

	storageWritePolicy, err := iam.NewPolicy(ctx, name+"-storage-write-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for writing the got s3 storage"),
		Policy: pulumi.Any(map[string]interface{}{
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

	logsBucketReadPolicy, err := iam.NewPolicy(ctx, name+"-logs-bucket-read-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for reading the logs bucket"),
		Policy: pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"s3:GetObject",
						"s3:GetObjectVersion",
					},
					"Resource": []interface{}{
						pulumi.Sprintf("%v/*", bucketLogs.Arn),
					},
				},
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"s3:ListBucket",
					},
					"Resource": []interface{}{
						pulumi.Sprintf("%v", bucketLogs.Arn),
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	logsBucketWritePolicy, err := iam.NewPolicy(ctx, name+"-logs-bucket-write-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for writing the logs bucket"),
		Policy: pulumi.Any(map[string]interface{}{
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
						pulumi.Sprintf("%v/*", bucketLogs.Arn),
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	mediaBucketReadPolicy, err := iam.NewPolicy(ctx, name+"-media-bucket-read-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for reading the media bucket"),
		Policy: pulumi.Any(map[string]interface{}{
			"Version": "2012-10-17",
			"Statement": []map[string]interface{}{
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"s3:GetObject",
						"s3:GetObjectVersion",
					},
					"Resource": []interface{}{
						pulumi.Sprintf("%v/*", bucketMedia.Arn),
					},
				},
				{
					"Effect": "Allow",
					"Action": []interface{}{
						"s3:ListBucket",
					},
					"Resource": []interface{}{
						pulumi.Sprintf("%v", bucketMedia.Arn),
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	mediaBucketWritePolicy, err := iam.NewPolicy(ctx, name+"-media-bucket-write-policy", &iam.PolicyArgs{
		Path:        pulumi.String("/"),
		Description: pulumi.String("IAM policy for writing the media bucket"),
		Policy: pulumi.Any(map[string]interface{}{
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
						pulumi.Sprintf("%v/*", bucketMedia.Arn),
					},
				},
			},
		}),
	})
	if err != nil {
		return nil, err
	}

	component.BucketNodesName = bucketNodes.Name.ToStringOutput()
	component.BucketEdgesName = bucketEdges.Name.ToStringOutput()
	component.BucketReverseEdgesName = bucketReverseEdges.Name.ToStringOutput()
	component.BucketRightsReadName = bucketRightsRead.Name.ToStringOutput()
	component.BucketRightsWriteName = bucketRightsWrite.Name.ToStringOutput()
	component.BucketRightsAdminName = bucketRightsAdmin.Name.ToStringOutput()
	component.BucketRightsOwnerName = bucketRightsOwner.Name.ToStringOutput()
	component.BucketLogsName = bucketLogs.Name.ToStringOutput()
	component.BucketMediaName = bucketMedia.Name.ToStringOutput()

	component.StorageReadPolicyArn = storageReadPolicy.Arn
	component.StorageWritePolicyArn = storageWritePolicy.Arn
	component.logsBucketReadPolicyArn = logsBucketReadPolicy.Arn
	component.logsBucketWritePolicyArn = logsBucketWritePolicy.Arn
	component.mediaBucketReadPolicyArn = mediaBucketReadPolicy.Arn
	component.mediaBucketWritePolicyArn = mediaBucketWritePolicy.Arn

	if err := ctx.RegisterResourceOutputs(component, pulumi.Map{}); err != nil {
		return nil, err
	}

	return component, nil
}

func lookupOrCreateBucket(ctx *pulumi.Context, name *pulumi.StringInput, fallbackName string, forceDestroy *pulumi.BoolInput) (*BucketInfo, error) {
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
		var _forceDestroy pulumi.BoolInput
		if forceDestroy == nil {
			_forceDestroy = pulumi.Bool(false)
		} else {
			_forceDestroy = *forceDestroy
		}
		// Create an S3 bucket to host files for the FileHosting service
		bucket, err := s3.NewBucketV2(ctx, fallbackName, &s3.BucketV2Args{
			ForceDestroy: _forceDestroy,
		})
		if err != nil {
			return nil, err
		}
		bucketName = bucket.Bucket
		bucketArn = bucket.Arn
	}

	return &BucketInfo{
		Name: bucketName,
		Arn:  bucketArn,
	}, nil
}
