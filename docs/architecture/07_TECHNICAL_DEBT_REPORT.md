# Technical Debt Report

This document summarizes the technical debt identified in the TFOE-PE Enterprise V2 platform.

## 1. Build Configuration
-   **Debt**: `ignoreBuildErrors: true` in `next.config.ts`.
-   **Risk**: Critical. This setting masks underlying TypeScript and ESLint errors, allowing for the deployment of unstable and potentially insecure code. It completely undermines the benefits of a statically-typed language.
-   **Repayment Plan**: This must be the first thing to be fixed. All TypeScript and ESLint errors must be resolved, and this setting must be removed.

## 2. Legacy Firebase Dependency
-   **Debt**: The `firebase` package is a dependency, but the application is built on Supabase.
-   **Risk**: Moderate. The dependency on `firebase/firestore`'s `Timestamp` type is a significant architectural inconsistency. It introduces a foreign data type into the application and adds an unnecessary dependency.
-   **Repayment Plan**: Remove the `firebase` dependency and replace all uses of `Timestamp` with native JavaScript `Date` objects or ISO 8601 strings.

## 3. Denormalized Database Schema
-   **Debt**: The database schema is heavily denormalized, with data duplicated across multiple tables.
-   **Risk**: High. A denormalized schema is difficult to maintain, prone to data integrity issues, and does not scale well.
-   **Repayment Plan**: Redesign the database to be fully normalized, using foreign key constraints to enforce data integrity. This will be a major undertaking, but it is essential for the long-term health of the platform.

## 4. Lack of a Centralized Authorization System
-   **Debt**: Authorization logic is likely scattered throughout the application.
-   **Risk**: High. A decentralized authorization system is difficult to manage and audit. It is also prone to security vulnerabilities.
-   **Repayment Plan**: Implement a database-driven RBAC engine, as outlined in the master plan.

## 5. No Queue System
-   **Debt**: There is no queue system for handling long-running tasks.
-   **Risk**: Moderate. Long-running tasks, such as generating reports or processing large files, can block the main thread and impact the performance of the application.
-   **Repayment Plan**: Implement a queue system using Redis and BullMQ, as outlined in the master plan.

## 6. Inconsistent Coding Styles
-   **Debt**: There is no enforced coding style, which can lead to inconsistent and difficult-to-read code.
-   **Risk**: Low. While not a critical issue, a consistent coding style improves maintainability.
-   **Repayment Plan**: Implement a code formatter, such as Prettier, and a linter, such as ESLint, to enforce a consistent coding style.

## 7. Lack of a Formalized Design System
-   **Debt**: While a component library is in use, there is no formalized design system.
-   **Risk**: Low. A lack of a design system can lead to UI inconsistencies, but it is not a critical issue at this stage.
-   **Repayment Plan**: Develop a comprehensive design system and component library as part of the UI/UX overhaul.
