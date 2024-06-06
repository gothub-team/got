# @gothub/got-api-test

## Overview

Welcome to the `@gothub/got-api-test` package. This project is part of the `@gothub/got` monorepo and contains a
comprehensive suite of tests for the `got` API ensuring its reliability, functionality, and performance.

You can easily run the test suites against your own endpoint that implement the `got` API standard.

```BASH
bunx @gothub/got-api-test
```

> To deploy your own instance of our implementation of the API on your AWS account, see the infrastructure as code (IaC)
> packages in this repo (`@gothub/got-api`, `@gothub/pulumi-got-api-aws`, `@gothub/pulumi-gotiac-aws` and
> `@gothub/gothub-iac`) All components are deployable and configurable via [SST Ion](https://ion.sst.dev/).

The tests cover a wide range of scenarios to verify that the API behaves as expected under various conditions.

## Features

-   **Comprehensive Coverage:** Tests for all major endpoints and functionalities of the got API.
-   **Automated Execution:** Easily run all tests with a single command.
-   **Extensible:** Designed to be easily extendable with new tests and scenarios.
-   **Detailed Reporting:** Clear and detailed reports of test results.

## Prerequisites

Before you begin, ensure you have the following installed:

-   [Bun](https://bun.sh/) (>= 1.x)
-   [SST Ion](https://ion.sst.dev/)
-   [Pulumi](https://www.pulumi.com/docs/) in case you want to do a raw deployment via pulumi

## Running the Tests

To execute all the test suites at once, run:

```bash
bunx @gothub/got-api-test
```

Its always a good idea to first test the auth components of your API since all other endpoints are authenticated and
need two test users in order to comprehensively test the API. (see [Auth](#auth) for configuring your environment)

```BASH
bunx @gothub/got-api-test auth
```

To execute any specific test suites, list them as arguments:

```bash
bunx @gothub/got-api-test nodes edges
```

Possible test suites are:

-   `auth`
-   `edges`
-   `files`
-   `metadata`
-   `nodes`
-   `rights`
-   `roles`
-   `scopes`
-   `wildcards`

This will run the specified test suites and output the results to the console.

## Configuration

Each test suite depends on its own set of environment variables that you need to export in your terminal before you run
tests.

Test suites will fail with a detailed description of the variables that need to be set.

Here is a breakdown of the env vars and how you should set them:

`GOT_API_URL`: This is the main endpoint of your API instance. In our case we run tests against
`https://api.dev.gothub.io/`

### Auth

`MAIL_USERNAME`: An IMAP mailbox username that receives mails for your test users. e.g. `info@your-domain.com`. The test
suites create email addresses like `info+test-123@your-domain.com` based on this env variable so make sure your mail
server supports the plus-syntax. The main username will still be used to receive test emails.

> See below how you can leverage our IaC components to deploy an AWS Workmail domain including a test mailbox.

`MAIL_USER_PW`: The password of your IMAP mailbox.

`MAIL_IMAP_SERVER`: The hostname of the IMAP server

`TEST_USER_1_EMAIL`: An existing test user. You can either create them manually via cognito (in case you don't have an
own implementation of the auth provider) or leverage our IaC components.

### Other Test Suites

`TEST_USER_1_EMAIL`: As above. First test user email that exists before the test suites have been executed. Either
create it manually or see below to deploy test users via our IaC components.

`TEST_USER_1_PW`: Password for the first test user.

`TEST_USER_2_EMAIL`: Second test user email that exists before the test suites have been executed. Either create it
manually or see below to deploy test users via our IaC components.

`TEST_USER_2_PW`: Password for the second test user.

### Deploying Test Support Resources

Tests suites need additional resources in order to run properly. Here are examples for deploying the necessary resources
via our IaC components leveraging the great [SST Ion](https://ion.sst.dev/). All `got` resources can be deployed via SST
Ion and/or [Pulumi](https://www.pulumi.com/docs/).

To initialize an SST project run

```
sst init
```

in your TS project folder and follow the instructions. Now you should find an `sst.config.ts` that looks like this:

```TypeScript
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
    app(input) {
        return {
            name: 'your-test-env',
            removal: input?.stage === 'production' ? 'retain' : 'remove',
            home: 'aws',
        };
    },
    async run() {},
});
```

In the `run` method you can define resources to be deployed in your default AWS account. Below you find examples how
resources can be defined.

When your config is written you can trigger a deployment via

```
sst deploy (--stage dev)
```

When you want to tear down the stack after testing you can run

```
sst remove (--stage dev)
```

#### Test Users

For the two test users you can put the following into the SST config:

```TypeScript
/// <reference path="./.sst/platform/config.d.ts" />
import * as gotiac from '@gothub/pulumi-gotiac-aws';
import * as fs from 'fs';

export default $config({
    app(input) { ... },
    async run() {
        const testUser1 = new gotiac.TestUser('TestUser1', {
            userPoolId: 'cognito-USERPOOL',
            email: 'info+test1@your-domain.com',
        });
        const testUser2 = new gotiac.TestUser('TestUser2', {
            userPoolId: 'cognito-USERPOOL',
            email: 'info+test2@your-domain.com',
        });
        fs.writeFileSync('.test-users.env', '# Automatically generated test users. Do not edit this file.\n');
        testUser1.password.apply((password) => {
            fs.appendFileSync('.test-users.env', `export TEST_USER_1_PW='${password}'\n`);
        });
        testUser2.password.apply((password) => {
            fs.appendFileSync('.test-users.env', `export TEST_USER_2_PW='${password}'\n`);
        });
    },
});
```

This code also writes the passwords securely to an env file after deployment.

Test users can be safely removed via `sst remove` after the test runs. This ensures that there are no useless technical
users in your user pool.

## Test Structure

The repository is organized as follows:

-   `v1/`: Contains all test suites for v1.

## Contributing

We welcome contributions to improve the test suites. To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bugfix.
3. Make your changes and ensure tests pass.
4. Submit a pull request with a clear description of your changes.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for using and contributing to the `@gothub/got-api-test` package! If you have any questions or need further
assistance, please open an issue on the repository.
