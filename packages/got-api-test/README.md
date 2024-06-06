# @gothub/got-api-test

## Overview

Welcome to the `@gothub/got-api-test` package. This project is part of the `@gothub/got` monorepo and contains a
comprehensive suite of tests for the `got` API ensuring its reliability, functionality, and performance.

You can easily run the test suites against your own endpoint that implement the `got` API standard.

> To deploy your own instance of our implementation of the API on your AWS account, see the infrastructure as code (IaC)
> packages in this repo (`@gothub/got-api`, `@gothub/pulumi-got-api-aws`, `@gothub/pulumi-gotiac-aws` and
> `@gothub/gothub-iac`) All components are deployable and configurable via [SST Ion](https://ion.sst.dev/).

The tests cover a wide range of scenarios to verify that the API behaves as expected under various conditions.

## Features

-   **Comprehensive Coverage:** Tests for all major endpoints and functionalities of the got API.
-   **Automated Execution:** Easily run all tests with a single command.
-   **Extensible:** Designed to be easily extendable with new tests and scenarios.
-   **Detailed Reporting:** Clear and detailed reports of test results.

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

-   [Bun](https://bun.sh/) (>= 1.x)

### Installation

### Configuration

## Running the Tests

To execute all the test suites at once, run:

```bash
bunx @gothub/got-api-test
```

To execute specific test suites, list them as arguments:

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
