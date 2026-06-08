-- 0007_analytics_views.sql

-- Materialized view for executive dashboard metrics
CREATE MATERIALIZED VIEW executive_dashboard_summary AS
SELECT
    (SELECT COUNT(*) FROM members WHERE status = 'ACTIVATED') as total_active_members,
    (SELECT COUNT(*) FROM applications WHERE status = 'IN_PROGRESS') as pending_applications,
    (SELECT COALESCE(SUM(amount), 0) FROM transactions WHERE type = 'DUES' AND created_at >= date_trunc('month', now())) as monthly_dues_collected,
    (SELECT COUNT(*) FROM regions) as total_regions,
    (SELECT COUNT(*) FROM clubs) as total_clubs;

-- View for membership growth trends
CREATE VIEW membership_growth_monthly AS
SELECT
    date_trunc('month', joined_at) as month,
    count(*) as new_members
FROM members
GROUP BY 1
ORDER BY 1 DESC;

-- View for regional distribution
CREATE VIEW regional_member_distribution AS
SELECT
    r.name as region_name,
    count(m.id) as member_count
FROM regions r
LEFT JOIN members m ON m.region_id = r.id
GROUP BY r.name
ORDER BY member_count DESC;

-- Refresh function for materialized views
CREATE OR REPLACE FUNCTION refresh_executive_dashboard()
RETURNS void AS $$
BEGIN
    REFRESH MATERIALIZED VIEW CONCURRENTLY executive_dashboard_summary;
END;
$$ LANGUAGE plpgsql;
