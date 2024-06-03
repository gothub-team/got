package util

import (
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumix"
)

func IfNotNil[T any](ptr *T, def T) T {
	if ptr != nil {
		return *ptr
	}
	return def
}

func OptionalStringPtr(value *pulumi.StringInput) pulumix.Input[*string] {
	var ptr pulumix.Input[*string]
	if value == nil {
		ptr = nil
	} else {
		ptr = (*value).ToStringPtrOutput()
	}
	return ptr
}
