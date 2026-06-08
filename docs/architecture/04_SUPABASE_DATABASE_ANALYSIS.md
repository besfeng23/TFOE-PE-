# Supabase Database Analysis (in lieu of Firebase)

This document reverse-engineers the likely Supabase database schema based on an analysis of the Next.js application's types and repository files. The primary source of information is `src/lib/types.ts` and the data access queries found in `src/lib/repositories/`. The original prompt requested a Firebase analysis, but the repository is built on Supabase.

## 1. Deduced Database Schema

The following tables are inferred to exist in the Supabase database.

### `members`

Stores core information about each member. This table is linked to Supabase Authentication users.

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key, Foreign Key to `auth.users.id`. |
| `fullName` | `text` | |
| `eagleId` | `text` | |
| `email` | `text` | |
| `mobileNumber` | `text` | |
| `region` | `text` | |
| `councilName` | `text` | |
| `clubName` | `text` | |
| `orgRole` | `text` | |
| `governmentRole` | `text` | |
| `governmentBranch`| `text` | |
| `barangayName` | `text` | |
| `municipalityCity`| `text` | |
| `province` | `text` | |
| `status` | `text` | Enum: `"Active"`, `"Inactive"`, `"Suspended"`, etc. |
| `joinedDate` | `timestamp` | From Firebase, should be `timestamptz`. |
| `membershipType` | `text` | |
| `tags` | `text[]` | Array of tags. |
| `fiveIsStage` | `text` | |
| `avatarUrl` | `text` | URL to profile picture. |
| `lastUpdatedAt` | `timestamp` | From Firebase, should be `timestamptz`. |
| `searchKeywords` | `text[]` | For search functionality. |

### `applications`

Tracks the status of membership applications.

| Column | Type | Notes |
| :--- | :--- | :--- |
| `id` | `uuid` | Primary Key. |
| `applicantFullName`| `text` | |
| `applicantEmail` | `text` | |
| `applicantMobileNumber` | `text` | |
| `applicantAddress`| `text` | |
| `sponsoringClubId`| `uuid` | Foreign Key to `clubs.id`. |
| ... | ... | (Other columns as per `Application` type) |
| `createdByUserId` | `uuid` | Foreign Key to `auth.users.id`. |
| `createdAt` | `timestamp` | From Firebase, should be `timestamptz`. |
| `updatedAt` | `timestamp` | From Firebase, should be `timestamptz`. |

### Other Tables

Based on the `types.ts` file, the following tables also likely exist:

- **`regions`**: Defines the different regions.
- **`clubs`**: Defines the clubs within regions. Linked to `regions` and `members`.
- **`transactions`**: Records financial transactions (dues, donations).
- **`governance`**: A settings table for application-wide rules.
- **`tasks`**: A simple task-tracking table.
- **`notifications`**: Stores user notifications.
- **`documents`**: Manages uploaded documents and their metadata.
- **`attendance`**: Tracks user attendance at events.
- **`events`**: Defines events that members can attend.
- **`partnerships`**: Stores information about partner organizations.
- **`endorsements`**: Manages endorsements related to partnerships.
- **`conversations`**: Represents a chat conversation between users.
- **`messages`**: Stores individual chat messages within a conversation.

## 2. Key Findings and Issues

### Use of Firebase `Timestamp`
- **Finding**: The TypeScript types (`src/lib/types.ts`) import and use `Timestamp` from the `firebase/firestore` package.
- **Impact**: This is a major architectural inconsistency. The application is using Supabase for its backend, but relying on a data type from the Firebase SDK. This adds a completely unnecessary dependency and creates a potential for data type mismatches between the application and the PostgreSQL database.
- **Recommendation**: Refactor the code to use native JavaScript `Date` objects or a library like `date-fns`. When sending dates to Supabase, they should be formatted as ISO 8601 strings. All `Timestamp` types should be replaced.

### Data Modeling Concerns
- **Denormalization**: There appears to be a significant amount of denormalization. For example, `applications` stores `sponsoringClubName` and `sponsorName` instead of relying on joins with the `clubs` and `members` tables. While this can improve read performance, it makes data updates more complex and can lead to inconsistencies.
- **JSON Blobs**: Fields like `stageDates` and `documents` in the `applications` table are modeled as objects or arrays. While PostgreSQL's `jsonb` type is powerful, overuse can make it difficult to query and maintain data integrity compared to using properly normalized related tables.

### Missing Foreign Key Constraints
- **Inference**: While the code implies relationships (e.g., `applications.sponsoringClubId` -> `clubs.id`), it is not possible to confirm from the codebase whether actual foreign key constraints are defined in the database schema.
- **Impact**: Without enforced constraints, the application is vulnerable to data integrity issues (e.g., an application pointing to a non-existent club).
- **Recommendation**: The database schema should be inspected to ensure that foreign key constraints are in place for all relationships.
