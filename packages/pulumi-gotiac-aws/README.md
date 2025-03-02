## Prerequisites

-   Go 1.17
-   Pulumi CLI
-   Node.js (to build the Node.js SDK)
-   Yarn (to build the Node.js SDK)
-   Python 3.6+ (to build the Python SDK)
-   .NET Core SDK (to build the .NET SDK)

## Getting Started

-   Install go `sudo apt install golang-go`
-   Install build-essential for make `sudo apt install build-essential`
-   Install Pulumi CLI `curl -fsSL https://get.pulumi.com | sh`
-   Build the provider and SDKs:

```bash
# Build and install the provider (plugin copied to $GOPATH/bin)
make install_provider

# Test Node.js SDK
$ make install_nodejs_sdk
```
