import { createClient } from '@/lib/supabase/server';
import { AuditLog } from '@/domain/entities/audit-log.entity';

export interface IAuditRepository {
  create(entry: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void>;
  findByTargetId(targetId: string, page: number, pageSize: number): Promise<AuditLog[]>;
}

export class SupabaseAuditRepository implements IAuditRepository {
  async create(entry: Omit<AuditLog, 'id' | 'createdAt'>): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('audit_logs')
      .insert({
        actor_id: entry.actorId,
        action: entry.action,
        target_id: entry.targetId,
        details: entry.details,
      });

    if (error) {
      console.error('Failed to create audit log:', error);
    }
  }

  async findByTargetId(targetId: string, page: number, pageSize: number): Promise<AuditLog[]> {
    // Implementation ...
    return [];
  }
}
