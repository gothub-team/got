// Copyright 2016-2021, Pulumi Corporation.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package provider

import (
	"github.com/pkg/errors"

	"github.com/pulumi/pulumi/sdk/v3/go/pulumi"
	"github.com/pulumi/pulumi/sdk/v3/go/pulumi/provider"
)

func construct(ctx *pulumi.Context, typ, name string, inputs provider.ConstructInputs,
	options pulumi.ResourceOption) (*provider.ConstructResult, error) {
	// TODO: Add support for additional component resources here.
	switch typ {
	case "gotiac:index:MailDomain":
		return constructMailDomain(ctx, name, inputs, options)
	case "gotiac:index:MailUser":
		return constructMailUser(ctx, name, inputs, options)
	case "gotiac:index:FileHosting":
		return constructFileHosting(ctx, name, inputs, options)
	case "gotiac:index:UserPool":
		return constructUserPool(ctx, name, inputs, options)
	case "gotiac:index:TestUser":
		return constructTestUser(ctx, name, inputs, options)
	case "gotiac:index:Api":
		return constructApi(ctx, name, inputs, options)
	case "gotiac:index:GraphStore":
		return constructGraphStore(ctx, name, inputs, options)
	default:
		return nil, errors.Errorf("unknown resource type %s", typ)
	}
}

func constructMailDomain(ctx *pulumi.Context, name string, inputs provider.ConstructInputs,
	options pulumi.ResourceOption) (*provider.ConstructResult, error) {

	// Copy the raw inputs to MailDomainArgs. `inputs.CopyTo` uses the types and `pulumi:` tags
	// on the struct's fields to convert the raw values to the appropriate Input types.
	args := &MailDomainArgs{}
	if err := inputs.CopyTo(args); err != nil {
		return nil, errors.Wrap(err, "setting args")
	}

	// Create the component resource.
	mailDomain, err := NewMailDomain(ctx, name, args, options)
	if err != nil {
		return nil, errors.Wrap(err, "creating component")
	}

	// Return the component resource's URN and state. `NewConstructResult` automatically sets the
	// ConstructResult's state based on resource struct fields tagged with `pulumi:` tags with a value
	// that is convertible to `pulumi.Input`.
	return provider.NewConstructResult(mailDomain)
}

func constructMailUser(ctx *pulumi.Context, name string, inputs provider.ConstructInputs,
	options pulumi.ResourceOption) (*provider.ConstructResult, error) {

	// Copy the raw inputs to MailUserArgs. `inputs.CopyTo` uses the types and `pulumi:` tags
	// on the struct's fields to convert the raw values to the appropriate Input types.
	args := &MailUserArgs{}
	if err := inputs.CopyTo(args); err != nil {
		return nil, errors.Wrap(err, "setting args")
	}

	// Create the component resource.
	mailUser, err := NewMailUser(ctx, name, args, options)
	if err != nil {
		return nil, errors.Wrap(err, "creating component")
	}

	// Return the component resource's URN and state. `NewConstructResult` automatically sets the
	// ConstructResult's state based on resource struct fields tagged with `pulumi:` tags with a value
	// that is convertible to `pulumi.Input`.
	return provider.NewConstructResult(mailUser)
}

func constructFileHosting(ctx *pulumi.Context, name string, inputs provider.ConstructInputs,
	options pulumi.ResourceOption) (*provider.ConstructResult, error) {

	// Copy the raw inputs to FileHostingArgs. `inputs.CopyTo` uses the types and `pulumi:` tags
	// on the struct's fields to convert the raw values to the appropriate Input types.
	args := &FileHostingArgs{}
	if err := inputs.CopyTo(args); err != nil {
		return nil, errors.Wrap(err, "setting args")
	}

	// Create the component resource.
	fileHosting, err := NewFileHosting(ctx, name, args, options)
	if err != nil {
		return nil, errors.Wrap(err, "creating component")
	}

	// Return the component resource's URN and state. `NewConstructResult` automatically sets the
	// ConstructResult's state based on resource struct fields tagged with `pulumi:` tags with a value
	// that is convertible to `pulumi.Input`.
	return provider.NewConstructResult(fileHosting)
}

func constructUserPool(ctx *pulumi.Context, name string, inputs provider.ConstructInputs,
	options pulumi.ResourceOption) (*provider.ConstructResult, error) {

	// Copy the raw inputs to UserPoolArgs. `inputs.CopyTo` uses the types and `pulumi:` tags
	// on the struct's fields to convert the raw values to the appropriate Input types.
	args := &UserPoolArgs{}
	if err := inputs.CopyTo(args); err != nil {
		return nil, errors.Wrap(err, "setting args")
	}

	// Create the component resource.
	testUser, err := NewUserPool(ctx, name, args, options)
	if err != nil {
		return nil, errors.Wrap(err, "creating component")
	}

	// Return the component resource's URN and state. `NewConstructResult` automatically sets the
	// ConstructResult's state based on resource struct fields tagged with `pulumi:` tags with a value
	// that is convertible to `pulumi.Input`.
	return provider.NewConstructResult(testUser)
}

func constructTestUser(ctx *pulumi.Context, name string, inputs provider.ConstructInputs,
	options pulumi.ResourceOption) (*provider.ConstructResult, error) {

	// Copy the raw inputs to TestUserArgs. `inputs.CopyTo` uses the types and `pulumi:` tags
	// on the struct's fields to convert the raw values to the appropriate Input types.
	args := &TestUserArgs{}
	if err := inputs.CopyTo(args); err != nil {
		return nil, errors.Wrap(err, "setting args")
	}

	// Create the component resource.
	testUser, err := NewTestUser(ctx, name, args, options)
	if err != nil {
		return nil, errors.Wrap(err, "creating component")
	}

	// Return the component resource's URN and state. `NewConstructResult` automatically sets the
	// ConstructResult's state based on resource struct fields tagged with `pulumi:` tags with a value
	// that is convertible to `pulumi.Input`.
	return provider.NewConstructResult(testUser)
}

func constructApi(ctx *pulumi.Context, name string, inputs provider.ConstructInputs,
	options pulumi.ResourceOption) (*provider.ConstructResult, error) {

	args := &ApiArgs{}
	if err := inputs.CopyTo(args); err != nil {
		return nil, errors.Wrap(err, "setting args")
	}

	// Create the component resource.
	testUser, err := NewApi(ctx, name, args, options)
	if err != nil {
		return nil, errors.Wrap(err, "creating component")
	}

	return provider.NewConstructResult(testUser)
}

func constructGraphStore(ctx *pulumi.Context, name string, inputs provider.ConstructInputs,
	options pulumi.ResourceOption) (*provider.ConstructResult, error) {

	args := &GraphStoreArgs{}
	if err := inputs.CopyTo(args); err != nil {
		return nil, errors.Wrap(err, "setting args")
	}

	// Create the component resource.
	testUser, err := NewGraphStore(ctx, name, args, options)
	if err != nil {
		return nil, errors.Wrap(err, "creating component")
	}

	return provider.NewConstructResult(testUser)
}
