import { MembershipStatus } from '@/domain/entities/member.entity';

export interface IMemberService {
  getMemberDetails(userId: string): Promise<any>;
  updateMemberStatus(memberId: string, status: MembershipStatus, actorId: string): Promise<void>;
  getClubMembers(clubId: string, page: number, pageSize: number): Promise<any[]>;
}

export interface IFinanceService {
  recordPayment(memberId: string, amount: number, type: string, referenceId?: string): Promise<any>;
  reverseTransaction(transactionId: string, reason: string, actorId: string): Promise<any>;
  getMemberFinancialHistory(memberId: string): Promise<any[]>;
}

export interface IAnalyticsService {
  getDashboardData(): Promise<any>;
}

export interface IAISecretariatService {
  generateMembershipReport(userId: string, memberData: any): Promise<string>;
}
