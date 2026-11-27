# Changelog

All notable changes to this project are documented in this file.

## 1.1.0-SNAPSHOT - [0000-00-00]

### Release Notes

#### Added
- **Transport steps** — Show whether a message transport step is retryable.
- **Transport step retry** — Retry a retryable message transport step from the admin UI, after confirmation.
- **JMS queues** — Browse the connector's JMS queues and inspect their pending and dead-letter messages.
- **JMS message details** — View the details of each message in the connector's JMS queues.
- **DLQ replay** — Resend failed messages from a JMS dead-letter queue to their original destination in one click.
- **DLQ message deletion** — Delete unwanted messages from the dead-letter queue directly from the admin UI.
- **Session expiry** — Sign out and return to the login page when the session has expired, instead of showing a network error.
- **Clear search criteria** — Reset the search criteria of the messages, attachments and transport steps pages, and of the message reporting, to their defaults in one click.

#### Fixed
- **Filters** — Go back to the first page when a filter changes on the messages and attachments pages.
- **Message reporting export** — Export the report with the criteria it was loaded with.

#### Technical
- **Lint** — Improve linting rules and fix reported issues.
- **Unit tests** — Lay the groundwork for the test suite.
- **E2E tests** — Lay the groundwork for the end-to-end test suite.
- **Warnings** — Fix the logo and modal warnings.
- **Basic auth** — Add support for HTTP `Basic` authentication.
- **REST client** — Accept successful backend responses with an empty body.
- **Confirmation modal** — Show a spinner on the confirm button while the action is running.
- **List views** — Share the loading, error and pagination handling across all list pages.
- **E2E tests** — Fix flaky session-expiry tests.

## 1.0.0 - 2026-11-12

### Release Notes

#### Added

- **Authentication** — Users can sign in with a connector user account.
- **Authentication** — Users required to change their password are prompted to set a new one before they can continue.

- **Access control** — Administration pages and menu entries are restricted to users holding the `ROLE_ADMIN` role.

- **Dashboard** — Users can monitor connector health (API, database, JMS, disk space), message statistics and the detailed report from a single page.

- **Test message** — Administrators can send a test business message from one connector to another.
- **Messages** — Users can browse business messages and filter them by identifier, backend name, direction, business domain, service and date range.
- **Message** — Users can view the details of a business message, including its business content, attachments, evidences and errors.
- **Message** — Users can download the evidences of a business message.
- **Message** — Users can view the transport steps of a business message.
- **Message** — Users can read a built-in explanation of the message lifecycle.
- **Message statistics** — Users can view total, delivered, rejected and pending messages with a delivery rate, split by direction (all, inbound, outbound), and filter by period (last hour, today, this week, this month, this year, all time) and by business domain.
- **Detailed report** — Users can view message counts by year, month, party and service (inbound, outbound and total) and export the report to `csv`, `json` or `xlsx`.

- **Transport steps** — Users can browse message transport steps and filter them by identifier, link partner, status and date range.
- **Transport steps** — Users can view the details of a transported message (business content and evidences).

- **Attachments** — Users can browse the attachments of business messages and filter them by message identifier, name, type, storage and date range.
- **Attachments** — Users can view the details of an attachment.
- **Attachments** — Users can download an attachment.

- **Business domains** — Users can browse the business domains used for multi-tenancy.
- **Business domains** — Users can create business domains.

- **Processing modes** — Users can browse the processing modes.
- **Processing modes** — Users can view the details of a processing mode (parties, services, actions and truststore).
- **Processing modes** — Users can update the truststore of a processing mode.
- **Processing modes** — Users can download a processing mode.

- **JMS queues** — Users can see a live overview of the connector JMS queues, including message and dead-letter counts.

- **Configuration viewer** — Read-only access to the connector configuration, organized in tabs: business domains, link partners, message processing, routing, business documents, container, evidence and JMS queues.

- **User management** — Administrators can create users.
- **User management** — Administrators can edit users.
- **User management** — Administrators can disable users.
- **User management** — Administrators can delete users.
- **User management** — Administrators can update user roles.
- **User management** — Administrators can require a user to change their password at their next sign-in.

- **My Account** — Users can view their profile.
- **My Account** — Users can edit their email address.
- **My Account** — Users can change their password.

- **Light and dark themes** — Users can switch between light, dark and system themes.

#### Technical

- **Docker image** — Published as `connector-ng-admin-console:<version>` on `scm.ecodex.eu`.
- **Standalone bundle** — `connector-ng-admin-console-<version>.zip` is attached to the GitHub release.
