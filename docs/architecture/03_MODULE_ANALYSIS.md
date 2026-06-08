# Module Analysis

This document breaks down the application into its core modules, based on the folder structure in `src/app` and the feature-specific components in `src/components`.

## 1. Core Modules

The application is structured around the following primary business domains:

### 1.1. Analytics (`src/app/analytics`)
-   **Purpose**: Provides data visualization and insights into membership trends.
-   **Components**: `MembersByGovtLevelChart`, `MembershipStatusChart`.
-   **Dependencies**: Chart.js for rendering charts, and the data repositories for fetching analytics data.
-   **Risks**: The current analytics are basic. A production-grade system will require more sophisticated reporting and data aggregation.
-   **Refactor Needs**: This module will need to be significantly expanded to meet the requirements of the new Analytics Platform, including materialized views and aggregation tables.

### 1.2. Applications (`src/app/applications`)
-   **Purpose**: Handles the submission and processing of new membership applications.
-   **Components**: `MembershipForm`.
-   **Dependencies**: `react-hook-form` for form management, Zod for validation, and the applications repository for data submission.
-   **Risks**: The current application process appears to be a single-step form. A robust system will need to handle multi-step applications, document uploads, and different application types.
-   **Refactor Needs**: The entire application lifecycle needs to be designed and implemented, including state transitions, validation rules, and integration with the payment and document systems.

### 1.3. Documents (`src/app/documents`)
-   **Purpose**: Manages document uploads, storage, and retrieval.
-   **Components**: `DocumentTable`, `SummarizeDialog`, `UploadDocumentDialog`.
-   **Dependencies**: Supabase Storage for file storage, and the documents repository. The `SummarizeDialog` also indicates an integration with the AI module.
-   **Risks**: The current document management system may not meet the security and compliance requirements for a national organization.
-   **Refactor Needs**: A full-fledged Document Vault needs to be designed, including encrypted storage, versioning, access logs, and retention policies.

### 1.4. Events (`src/app/events`)
-   **Purpose**: Manages the creation, scheduling, and registration for events.
-   **Components**: `EventCalendar`, `EventDetails`, `EventFormDialog`, `EventList`.
-   **Dependencies**: A calendar component (likely `react-calendar` or similar), and the events repository.
-   **Risks**: The current event system is likely limited to basic event management. A national platform will need to support different event types, ticketing, and integration with the finance system.
-   **Refactor Needs**: The events module needs to be expanded to support the full event lifecycle, including registration, payments, and attendance tracking.

### 1.5. Fees (`src/app/fees`)
-   **Purpose**: Likely related to managing membership fees and payments. The exact functionality is unclear as it only contains a `page.tsx`.
-   **Dependencies**: The payments repository.
-   **Risks**: This module is a stub and requires a complete implementation.
-   **Refactor Needs**: This module needs to be absorbed into the larger Finance Domain, which will handle all financial transactions.

### 1.6. Members (`src/app/members`)
-   **Purpose**: The core module for managing member data.
-   **Components**: `MembersTable`, `MemberFormDialog`, `AI-ImportDialog`, `ReportDialog`.
-   **Dependencies**: The members repository. The `AI-ImportDialog` and `ReportDialog` suggest AI integration for data import and reporting.
-   **Risks**: The current member management system is likely a simple CRUD interface. The new platform requires a comprehensive Membership Lifecycle Engine.
-   **Refactor Needs**: This module needs a complete overhaul to support the new Membership Lifecycle Engine, including member states, transitions, and history.

### 1.7. Messages (`src/app/messages`)
-   **Purpose**: Provides a communication platform for members.
-   **Components**: `ChatWindow`, `ConversationList`, `NewConversationDialog`.
-   **Dependencies**: The messages and conversations repositories.
-   **Risks**: A real-time chat system can be complex to scale. The current implementation may not be suitable for a large user base.
-   **Refactor Needs**: The messaging system needs to be designed for scalability and integrated with the new Notification Platform.

### 1.8. Partnerships (`src/app/partnerships`)
-   **Purpose**: Manages relationships with partner organizations.
-   **Components**: `PartnershipsTable`, `PartnershipFormDialog`, `EndorsementLetterDialog`.
-   **Dependencies**: The partnerships repository and the AI module for generating endorsement letters.
-   **Risks**: This module may need to be integrated with a more comprehensive CRM or external relationship management system in the future.
-   **Refactor Needs**: This module should be reviewed as part of the Organization Domain design to ensure it aligns with the multi-tenancy model.

### 1.9. Profile (`src/app/profile`)
-   **Purpose**: Allows members to manage their own profile information.
-   **Dependencies**: The members repository.
-   **Risks**: The current profile page may not provide members with sufficient control over their data and privacy settings.
-   **Refactor Needs**: The profile module needs to be updated to reflect the new data model and provide access to the new features of the platform (e.g., digital ID, notification preferences).

### 1.10. Settings (`src/app/settings`)
-   **Purpose**: Provides application-level settings for users.
-   **Components**: `AccountSettings`, `AppearanceSettings`, `SecuritySettings`.
-   **Dependencies**: The user repository.
-   **Risks**: The current settings are likely limited. The new platform will require more granular control over security, notifications, and other preferences.
-   **Refactor Needs**: The settings module needs to be expanded to support the new security and notification features.

### 1.11. Tasks (`src/app/tasks`)
-   **Purpose**: A simple task management system.
-   **Components**: `TaskList`.
-   **Dependencies**: The tasks repository.
-   **Risks**: This module appears to be a basic to-do list. It may not be sufficient for the needs of a national organization.
-   **Refactor Needs**: The task management system should be reviewed and potentially replaced with a more robust solution, or integrated with a project management tool if required.

### 1.12. Video (`src/app/video`)
-   **Purpose**: Unknown. Contains a `page.tsx` but no other components.
-   **Risks**: This module is a stub and its purpose is unclear. It should be reviewed to determine if it is still needed.
-   **Refactor Needs**: This module should be removed if it is not a part of the future vision for the platform.

### 1.13. AI (`src/ai`)
-   **Purpose**: Contains all Genkit flows and AI-related code.
-   **Dependencies**: `@genkit-ai/*` libraries.
-   **Risks**: The current AI implementation is likely tightly coupled to the specific features it supports.
-   **Refactor Needs**: The AI module should be redesigned to be more generic and extensible, allowing for the easy addition of new AI-powered features. It should be integrated with the new Queue System for long-running tasks.
