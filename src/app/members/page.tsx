
import { getMembers } from '@/lib/repositories/members.repository';
import { MembersPageClient } from '@/components/members/members-page-client';

export default async function MembersPage() {
    const members = await getMembers();

    return <MembersPageClient initialMembers={members} />;
}
