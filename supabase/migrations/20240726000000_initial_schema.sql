-- Create custom types
CREATE TYPE membership_status AS ENUM ('PENDING', 'ACTIVE', 'INACTIVE', 'SUSPENDED', 'LAPSED');
CREATE TYPE payment_status AS ENUM ('PENDING', 'COMPLETED', 'FAILED');

-- Create tables
CREATE TABLE "profiles" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "first_name" TEXT,
  "last_name" TEXT,
  "email" TEXT UNIQUE,
  "avatar_url" TEXT,
  "updated_at" TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

CREATE TABLE "members" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "user_id" UUID NOT NULL,
  "membership_number" TEXT UNIQUE,
  "status" membership_status NOT NULL DEFAULT 'PENDING',
  "date_of_birth" DATE,
  "phone_number" TEXT,
  "address" JSONB,
  "club_id" UUID,
  "created_at" TIMESTAMPTZ DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now(),
  FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE
);

CREATE TABLE "payments" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "member_id" UUID NOT NULL,
  "amount" NUMERIC(10, 2) NOT NULL,
  "payment_date" TIMESTAMPTZ DEFAULT now(),
  "payment_method" TEXT,
  "status" payment_status NOT NULL DEFAULT 'PENDING',
  "transaction_id" TEXT UNIQUE,
  "invoice_number" TEXT,
  FOREIGN KEY ("member_id") REFERENCES "members"("id")
);

CREATE TABLE "audit_logs" (
  "id" BIGSERIAL PRIMARY KEY,
  "actor_id" UUID,
  "action" TEXT NOT NULL,
  "target_id" UUID,
  "details" JSONB,
  "created_at" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "roles" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "name" TEXT NOT NULL UNIQUE,
  "description" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "permissions" (
  "id" UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  "code" TEXT NOT NULL UNIQUE, -- e.g., 'members:create', 'payments:read'
  "description" TEXT,
  "created_at" TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE "role_permissions" (
  "role_id" UUID NOT NULL,
  "permission_id" UUID NOT NULL,
  PRIMARY KEY ("role_id", "permission_id"),
  FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE,
  FOREIGN KEY ("permission_id") REFERENCES "permissions"("id") ON DELETE CASCADE
);

CREATE TABLE "user_roles" (
  "user_id" UUID NOT NULL,
  "role_id" UUID NOT NULL,
  PRIMARY KEY ("user_id", "role_id"),
  FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE,
  FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE CASCADE
);

-- Create a function to check user permissions
CREATE OR REPLACE FUNCTION check_user_permission(p_user_id UUID, p_permission_code TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM "user_roles" ur
    JOIN "role_permissions" rp ON ur."role_id" = rp."role_id"
    JOIN "permissions" p ON rp."permission_id" = p."id"
    WHERE ur."user_id" = p_user_id
      AND p."code" = p_permission_code
  );
END;
$$ LANGUAGE plpgsql;

-- Enable Row-Level Security
ALTER TABLE "profiles" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "payments" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "audit_logs" ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own profile" ON "profiles" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON "profiles" FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Members can view their own data" ON "members" FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Club officials can see members of their club" ON "members" FOR SELECT USING (
  check_user_permission(auth.uid(), 'members:read') AND
  club_id = (SELECT club_id FROM members WHERE user_id = auth.uid())
);

-- Seed data
INSERT INTO roles (name, description) VALUES ('SUPER_ADMIN', 'Full access to all system functionalities.');
INSERT INTO roles (name, description) VALUES ('CLUB_ADMIN', 'Manages a specific club's members and activities.');
INSERT INTO roles (name, description) VALUES ('MEMBER', 'Regular member with access to personal information and basic features.');

INSERT INTO permissions (code, description) VALUES ('profiles:read', 'Read user profiles');
INSERT INTO permissions (code, description) VALUES ('profiles:write', 'Create/update user profiles');
INSERT INTO permissions (code, description) VALUES ('members:read', 'Read member data');
INSERT INTO permissions (code, description) VALUES ('members:write', 'Create/update member data');
INSERT INTO permissions (code, description) VALUES ('payments:read', 'Read payment information');
INSERT INTO permissions (code, description) VALUES ('payments:write', 'Create/update payment information');
INSERT INTO permissions (code, description) VALUES ('roles:assign', 'Assign roles to users');
INSERT INTO permissions (code, description) VALUES ('audit:read', 'Read audit logs');
