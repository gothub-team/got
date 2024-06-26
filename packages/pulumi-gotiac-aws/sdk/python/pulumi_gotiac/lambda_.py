# coding=utf-8
# *** WARNING: this file was generated by Pulumi SDK Generator. ***
# *** Do not edit by hand unless you're certain you know what you are doing! ***

import copy
import warnings
import pulumi
import pulumi.runtime
from typing import Any, Mapping, Optional, Sequence, Union, overload
from . import _utilities

__all__ = ['LambdaArgs', 'Lambda']

@pulumi.input_type
class LambdaArgs:
    def __init__(__self__, *,
                 code_path: pulumi.Input[str],
                 handler_path: pulumi.Input[str],
                 policy_arns: pulumi.Input[Sequence[pulumi.Input[str]]],
                 runtime: pulumi.Input[str],
                 memory_size: Optional[pulumi.Input[float]] = None):
        """
        The set of arguments for constructing a Lambda resource.
        :param pulumi.Input[str] code_path: The path to a .zip file containing your deployment package.
        :param pulumi.Input[str] handler_path: The path to the handler in the deployment package.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] policy_arns: The ARNs of the policies that are attached to the Lambda function.
        :param pulumi.Input[str] runtime: The runtime environment for the Lambda function.
        :param pulumi.Input[float] memory_size: The amount of memory in MB your Lambda Function can use at runtime.
        """
        pulumi.set(__self__, "code_path", code_path)
        pulumi.set(__self__, "handler_path", handler_path)
        pulumi.set(__self__, "policy_arns", policy_arns)
        pulumi.set(__self__, "runtime", runtime)
        if memory_size is not None:
            pulumi.set(__self__, "memory_size", memory_size)

    @property
    @pulumi.getter(name="codePath")
    def code_path(self) -> pulumi.Input[str]:
        """
        The path to a .zip file containing your deployment package.
        """
        return pulumi.get(self, "code_path")

    @code_path.setter
    def code_path(self, value: pulumi.Input[str]):
        pulumi.set(self, "code_path", value)

    @property
    @pulumi.getter(name="handlerPath")
    def handler_path(self) -> pulumi.Input[str]:
        """
        The path to the handler in the deployment package.
        """
        return pulumi.get(self, "handler_path")

    @handler_path.setter
    def handler_path(self, value: pulumi.Input[str]):
        pulumi.set(self, "handler_path", value)

    @property
    @pulumi.getter(name="policyArns")
    def policy_arns(self) -> pulumi.Input[Sequence[pulumi.Input[str]]]:
        """
        The ARNs of the policies that are attached to the Lambda function.
        """
        return pulumi.get(self, "policy_arns")

    @policy_arns.setter
    def policy_arns(self, value: pulumi.Input[Sequence[pulumi.Input[str]]]):
        pulumi.set(self, "policy_arns", value)

    @property
    @pulumi.getter
    def runtime(self) -> pulumi.Input[str]:
        """
        The runtime environment for the Lambda function.
        """
        return pulumi.get(self, "runtime")

    @runtime.setter
    def runtime(self, value: pulumi.Input[str]):
        pulumi.set(self, "runtime", value)

    @property
    @pulumi.getter(name="memorySize")
    def memory_size(self) -> Optional[pulumi.Input[float]]:
        """
        The amount of memory in MB your Lambda Function can use at runtime.
        """
        return pulumi.get(self, "memory_size")

    @memory_size.setter
    def memory_size(self, value: Optional[pulumi.Input[float]]):
        pulumi.set(self, "memory_size", value)


class Lambda(pulumi.ComponentResource):
    @overload
    def __init__(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 code_path: Optional[pulumi.Input[str]] = None,
                 handler_path: Optional[pulumi.Input[str]] = None,
                 memory_size: Optional[pulumi.Input[float]] = None,
                 policy_arns: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 runtime: Optional[pulumi.Input[str]] = None,
                 __props__=None):
        """
        Create a Lambda resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param pulumi.ResourceOptions opts: Options for the resource.
        :param pulumi.Input[str] code_path: The path to a .zip file containing your deployment package.
        :param pulumi.Input[str] handler_path: The path to the handler in the deployment package.
        :param pulumi.Input[float] memory_size: The amount of memory in MB your Lambda Function can use at runtime.
        :param pulumi.Input[Sequence[pulumi.Input[str]]] policy_arns: The ARNs of the policies that are attached to the Lambda function.
        :param pulumi.Input[str] runtime: The runtime environment for the Lambda function.
        """
        ...
    @overload
    def __init__(__self__,
                 resource_name: str,
                 args: LambdaArgs,
                 opts: Optional[pulumi.ResourceOptions] = None):
        """
        Create a Lambda resource with the given unique name, props, and options.
        :param str resource_name: The name of the resource.
        :param LambdaArgs args: The arguments to use to populate this resource's properties.
        :param pulumi.ResourceOptions opts: Options for the resource.
        """
        ...
    def __init__(__self__, resource_name: str, *args, **kwargs):
        resource_args, opts = _utilities.get_resource_args_opts(LambdaArgs, pulumi.ResourceOptions, *args, **kwargs)
        if resource_args is not None:
            __self__._internal_init(resource_name, opts, **resource_args.__dict__)
        else:
            __self__._internal_init(resource_name, *args, **kwargs)

    def _internal_init(__self__,
                 resource_name: str,
                 opts: Optional[pulumi.ResourceOptions] = None,
                 code_path: Optional[pulumi.Input[str]] = None,
                 handler_path: Optional[pulumi.Input[str]] = None,
                 memory_size: Optional[pulumi.Input[float]] = None,
                 policy_arns: Optional[pulumi.Input[Sequence[pulumi.Input[str]]]] = None,
                 runtime: Optional[pulumi.Input[str]] = None,
                 __props__=None):
        opts = pulumi.ResourceOptions.merge(_utilities.get_resource_opts_defaults(), opts)
        if not isinstance(opts, pulumi.ResourceOptions):
            raise TypeError('Expected resource options to be a ResourceOptions instance')
        if opts.id is not None:
            raise ValueError('ComponentResource classes do not support opts.id')
        else:
            if __props__ is not None:
                raise TypeError('__props__ is only valid when passed in combination with a valid opts.id to get an existing resource')
            __props__ = LambdaArgs.__new__(LambdaArgs)

            if code_path is None and not opts.urn:
                raise TypeError("Missing required property 'code_path'")
            __props__.__dict__["code_path"] = code_path
            if handler_path is None and not opts.urn:
                raise TypeError("Missing required property 'handler_path'")
            __props__.__dict__["handler_path"] = handler_path
            __props__.__dict__["memory_size"] = memory_size
            if policy_arns is None and not opts.urn:
                raise TypeError("Missing required property 'policy_arns'")
            __props__.__dict__["policy_arns"] = policy_arns
            if runtime is None and not opts.urn:
                raise TypeError("Missing required property 'runtime'")
            __props__.__dict__["runtime"] = runtime
            __props__.__dict__["arn"] = None
            __props__.__dict__["name"] = None
        super(Lambda, __self__).__init__(
            'gotiac:index:Lambda',
            resource_name,
            __props__,
            opts,
            remote=True)

    @property
    @pulumi.getter
    def arn(self) -> pulumi.Output[str]:
        """
        The ARN of the Lambda function.
        """
        return pulumi.get(self, "arn")

    @property
    @pulumi.getter
    def name(self) -> pulumi.Output[str]:
        """
        The Name of the Lambda function.
        """
        return pulumi.get(self, "name")

