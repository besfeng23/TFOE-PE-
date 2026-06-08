import { IAuditRepository } from '@/infrastructure/repositories/audit.repository';
import { AuditLog } from '@/domain/entities/audit-log.entity';

export interface IAuditService {
  logAction(entry: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void>;
  getAuditLogsForTarget(targetId: string, page: number, pageSize: number): Promise<AuditLog[]>;
}

export class AuditService implements IAuditService {
  constructor(private auditRepository: IAuditRepository) {}

  async logAction(entry: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> {
    await this.auditRepository.create(entry);
  }

  async getAuditLogsForTarget(targetId: string, page: number, pageSize: number): Promise<AuditLog[]> {
    return this.auditRepository.findByTargetId(targetId, page, pageSize);
  }
}
