
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE councils ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read-only access to regions" ON regions FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to councils" ON councils FOR SELECT USING (true);
CREATE POLICY "Allow public read-only access to clubs" ON clubs FOR SELECT USING (true);

CREATE POLICY "Allow users to view their own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Allow users to update their own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Allow members to view their own club's applications" ON applications FOR SELECT USING (sponsoringClubId IN (SELECT clubId FROM profiles WHERE id = auth.uid()));
CREATE POLICY "Allow members to create applications for their own club" ON applications FOR INSERT WITH CHECK (sponsoringClubId IN (SELECT clubId FROM profiles WHERE id = auth.uid()));

CREATE POLICY "Allow users to view their own transactions" ON transactions FOR SELECT USING (userId = auth.uid());

CREATE POLICY "Allow users to see events" ON events FOR SELECT USING (true);

CREATE POLICY "Allow users to see documents" ON documents FOR SELECT USING (true);

CREATE POLICY "Allow users to see their own conversations" ON conversations FOR SELECT USING (auth.uid() = ANY(participants));
CREATE POLICY "Allow users to see messages in their conversations" ON messages FOR SELECT USING (id IN (SELECT conversation_id FROM conversations WHERE auth.uid() = ANY(participants)));
