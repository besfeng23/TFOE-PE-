-- 0006_rbac_rls_policies.sql

-- 1. ENABLE RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE councils ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;

-- 2. HELPER FUNCTION TO GET CURRENT USER ROLES
CREATE OR REPLACE FUNCTION public.get_my_roles()
RETURNS TABLE (role_name TEXT) AS $$
BEGIN
    RETURN QUERY
    SELECT r.name
    FROM roles r
    JOIN user_roles ur ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. HELPER FUNCTION TO CHECK PERMISSION
CREATE OR REPLACE FUNCTION public.has_permission(permission_code TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    has_perm BOOLEAN;
BEGIN
    SELECT EXISTS (
        SELECT 1
        FROM permissions p
        JOIN role_permissions rp ON rp.permission_id = p.id
        JOIN user_roles ur ON ur.role_id = rp.role_id
        WHERE ur.user_id = auth.uid()
        AND p.code = permission_code
    ) INTO has_perm;
    RETURN has_perm;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. BASIC POLICIES

-- Profiles: Users can see their own profile, admins can see all
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (public.has_permission('VIEW_ALL_PROFILES'));

-- Members: Users can see their own membership, club/council/region admins can see theirs
CREATE POLICY "Users can view own membership" ON members
    FOR SELECT USING (auth.uid() = profile_id);

CREATE POLICY "Club Admins can view club members" ON members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM user_roles ur
            JOIN roles r ON ur.role_id = r.id
            WHERE ur.user_id = auth.uid()
            AND r.name = 'CLUB_ADMIN'
            AND members.club_id IN (
                SELECT id FROM clubs WHERE president_id = auth.uid() OR secretary_id = auth.uid()
            )
        )
    );

-- 5. AUDIT LOG TRIGGER
CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS TRIGGER AS $$
DECLARE
    curr_user_id UUID;
BEGIN
    curr_user_id := auth.uid();
    
    INSERT INTO audit_logs (table_name, record_id, action, old_value, new_value, user_id)
    VALUES (
        TG_TABLE_NAME,
        COALESCE(NEW.id, OLD.id),
        TG_OP,
        CASE WHEN TG_OP = 'UPDATE' OR TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE NULL END,
        CASE WHEN TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN to_jsonb(NEW) ELSE NULL END,
        curr_user_id
    );
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Attach audit trigger to core tables
CREATE TRIGGER audit_members_trigger AFTER INSERT OR UPDATE OR DELETE ON members FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_applications_trigger AFTER INSERT OR UPDATE OR DELETE ON applications FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
CREATE TRIGGER audit_transactions_trigger AFTER INSERT OR UPDATE OR DELETE ON transactions FOR EACH ROW EXECUTE FUNCTION audit_trigger_func();
