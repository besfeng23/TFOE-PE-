import { IMemberRepository } from '@/infrastructure/repositories/member.repository';
import { Member, MembershipStatus } from '@/domain/entities/member.entity';

export class MemberService {
  constructor(private memberRepository: IMemberRepository) {}

  async getMemberDetails(userId: string): Promise<Member | null> {
    return this.memberRepository.findByUserId(userId);
  }

  async updateMemberStatus(memberId: string, status: MembershipStatus, actorId: string): Promise<void> {
    const member = await this.memberRepository.findById(memberId);
    if (!member) throw new Error('Member not found');

    // Business Logic: Check permissions (in a real scenario, this would be more complex)
    // Here we just update the status
    const updatedMember = {
      ...member,
      status,
      updatedAt: new Date(),
    };

    await this.memberRepository.save(updatedMember);
    
    // TODO: Trigger Audit Log via Infrastructure Layer
  }

  async getClubMembers(clubId: string, page: number = 1, pageSize: number = 20): Promise<Member[]> {
    const offset = (page - 1) * pageSize;
    return this.memberRepository.list({ limit: pageSize, offset, clubId });
  }
}
