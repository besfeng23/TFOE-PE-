-- 0005_enterprise_schema_foundation.sql
-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS
CREATE TYPE membership_status AS ENUM (
    'DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'ENDORSED', 'APPROVED', 'REJECTED', 'ACTIVATED', 'SUSPENDED', 'EXPELLED', 'DECEASED'
);

CREATE TYPE application_stage AS ENUM (
    'APPLICANT', 'INTERVIEW', 'INDOCTRINATION', 'INITIATION', 'INDUCTION', 'COMPLETED'
);

CREATE TYPE application_status AS ENUM (
    'IN_PROGRESS', 'ON_HOLD', 'RETURNED', 'REJECTED', 'APPROVED', 'CONVERTED'
);

CREATE TYPE transaction_type AS ENUM (
    'DUES', 'DONATION', 'ALALAYAN_AGILA_DEBIT', 'ALALAYAN_AGILA_PAYOUT', 'ASSESSMENT', 'REVERSAL'
);

-- 3. CORE GEOGRAPHIC/ORGANIZATIONAL HIERARCHY
CREATE TABLE regions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    governor_id UUID, -- References profiles later
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE councils (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    region_id UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(name, region_id)
);

CREATE TABLE clubs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    council_id UUID NOT NULL REFERENCES councils(id) ON DELETE CASCADE,
    region_id UUID NOT NULL REFERENCES regions(id) ON DELETE CASCADE,
    president_id UUID,
    secretary_id UUID,
    xendit_sub_account_id TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(name, council_id)
);

-- 4. IDENTITY & ACCESS (RBAC)
CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE permissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE role_permissions (
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    PRIMARY KEY (role_id, permission_id)
);

-- 5. PROFILES & MEMBERS (Normalized)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    avatar_url TEXT,
    id_photo_url TEXT,
    contact_info JSONB,
    government_position TEXT,
    government_branch TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
    membership_number TEXT UNIQUE,
    status membership_status NOT NULL DEFAULT 'ACTIVATED',
    club_id UUID NOT NULL REFERENCES clubs(id),
    region_id UUID NOT NULL REFERENCES regions(id),
    council_id UUID NOT NULL REFERENCES councils(id),
    joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE user_roles (
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    role_id UUID NOT NULL REFERENCES roles(id) ON DELETE CASCADE,
    PRIMARY KEY (user_id, role_id)
);

-- 6. AUDIT LOGGING
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL,
    old_value JSONB,
    new_value JSONB,
    user_id UUID REFERENCES profiles(id),
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. APPLICATIONS
CREATE TABLE applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES profiles(id), -- If they already have an account
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    mobile_number TEXT,
    address TEXT,
    barangay TEXT,
    municipality_city TEXT,
    province TEXT,
    sponsoring_club_id UUID NOT NULL REFERENCES clubs(id),
    sponsor_member_id UUID, -- References members(id)
    status application_status NOT NULL DEFAULT 'IN_PROGRESS',
    stage application_stage NOT NULL DEFAULT 'APPLICANT',
    current_handler_level TEXT NOT NULL DEFAULT 'CLUB', -- CLUB, REGION, NATIONAL
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 8. FINANCE
CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    member_id UUID NOT NULL REFERENCES members(id),
    type transaction_type NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency TEXT NOT NULL DEFAULT 'PHP',
    status TEXT NOT NULL,
    reference_id TEXT UNIQUE, -- e.g., Xendit ID
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Immutable Transactions Constraint (Conceptual - enforced via RLS and no updates)
-- 9. AI AUDIT
CREATE TABLE ai_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES profiles(id),
    prompt TEXT NOT NULL,
    response TEXT NOT NULL,
    model TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
