
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id TEXT NOT NULL,
    old_data JSONB,
    new_data JSONB,
    changed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    changed_by_user_id UUID
);

CREATE OR REPLACE FUNCTION audit_trigger_function()
RETURNS TRIGGER AS $$
BEGIN
    IF (TG_OP = 'INSERT') THEN
        INSERT INTO audit_logs (table_name, record_id, new_data, changed_by_user_id)
        VALUES (TG_TABLE_NAME, NEW.id, to_jsonb(NEW), auth.uid());
        RETURN NEW;
    ELSIF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit_logs (table_name, record_id, old_data, new_data, changed_by_user_id)
        VALUES (TG_TABLE_NAME, NEW.id, to_jsonb(OLD), to_jsonb(NEW), auth.uid());
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit_logs (table_name, record_id, old_data, changed_by_user_id)
        VALUES (TG_TABLE_NAME, OLD.id, to_jsonb(OLD), auth.uid());
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to business tables
CREATE TRIGGER profiles_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON profiles FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER applications_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON applications FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER regions_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON regions FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER clubs_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON clubs FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER councils_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON councils FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER transactions_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON transactions FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER events_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON events FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
CREATE TRIGGER documents_audit_trigger AFTER INSERT OR UPDATE OR DELETE ON documents FOR EACH ROW EXECUTE FUNCTION audit_trigger_function();
