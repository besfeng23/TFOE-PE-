
CREATE SCHEMA IF NOT EXISTS analytics;

CREATE MATERIALIZED VIEW analytics.executive_dashboard AS
SELECT
    r.name AS region_name,
    co.name AS council_name,
    c.name AS club_name,
    COUNT(DISTINCT p.id) AS total_members,
    COUNT(DISTINCT a.id) AS total_applications,
    SUM(CASE WHEN t.type = 'dues' THEN t.amount ELSE 0 END) AS total_dues,
    SUM(CASE WHEN t.type = 'donation' THEN t.amount ELSE 0 END) AS total_donations
FROM
    regions r
    LEFT JOIN councils co ON r.id = co.region_id
    LEFT JOIN clubs c ON co.id = c.council_id
    LEFT JOIN profiles p ON c.id = p.clubId
    LEFT JOIN applications a ON c.id = a.sponsoringClubId
    LEFT JOIN transactions t ON p.id = t.userId
GROUP BY
    r.name, co.name, c.name;

-- Create an index to improve query performance
CREATE UNIQUE INDEX ON analytics.executive_dashboard (region_name, council_name, club_name);

-- Note: You will need to refresh this view periodically to keep the data up-to-date.
-- You can do this with the following command:
-- REFRESH MATERIALIZED VIEW analytics.executive_dashboard;
