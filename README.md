## Prerequisites

This version of the Admin Console is compatible with **e-CODEX Connector NG 7.1.0**, which must be installed and reachable from the machine running the app (see `CONNECTOR_API_URL` below).

## Getting Started

### Environment variables

Create a `.env` file at the root of the project:

```env
APP_MODE=ADMIN_CONSOLE

CONNECTOR_API_URL=http://localhost:30000

# HTTP Basic credentials of the connector's actuator endpoints (required)
BASIC_AUTH_USER=actuator
BASIC_AUTH_PASSWORD=change-me

# only needed with APP_MODE=TESTING_CONSOLE
CONNECTOR_BFF_URL=http://localhost:4000

DEFAULT_ORIGINAL_SENDER=alice
DEFAULT_FINAL_RECIPIENT=bob
```

| Variable                  | Description                                               |
|---------------------------|-----------------------------------------------------------|
| `APP_MODE`                | `ADMIN_CONSOLE` or `TESTING_CONSOLE`, see below           |
| `CONNECTOR_API_URL`       | URL of the connector REST API                             |
| `BASIC_AUTH_USER`         | User for HTTP Basic authentication on the connector's actuator endpoints (health and build info shown in the footer). **Required** |
| `BASIC_AUTH_PASSWORD`     | Password of `BASIC_AUTH_USER`. **Required**; keep it secret |
| `CONNECTOR_BFF_URL`       | URL of the BFF, **only needed in `TESTING_CONSOLE` mode** |
| `DEFAULT_ORIGINAL_SENDER` | Original sender used by default for test messages         |
| `DEFAULT_FINAL_RECIPIENT` | Final recipient used by default for test messages         |

`BASIC_AUTH_USER` and `BASIC_AUTH_PASSWORD` are required: if either is missing or empty, the app fails to render any page and the server logs `Missing required environment variable: BASIC_AUTH_USER` (or `BASIC_AUTH_PASSWORD`).

### Modes

**`ADMIN_CONSOLE`**: test messages can only be sent via REST, and only with the configured TEST service and action.

**`TESTING_CONSOLE`**: gives access to more services and actions. Messages are sent as prepared SOAP requests, which are handled by the BFF. This is why `CONNECTOR_BFF_URL` has to be set in this mode, and can be left out in `ADMIN_CONSOLE` mode.

The BFF is a separate project, available at [e-CODEX/connector-ng-bff](https://github.com/e-CODEX/connector-ng-bff). It is meant for testing purposes only.

### Install dependencies

```bash
npm ci
```

### Run the app

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).
