import { IRoleRepository } from '@/infrastructure/repositories/role.repository';
import { IAuditService } from './audit.service';

export class RoleService {
  constructor(
    private roleRepository: IRoleRepository,
    private auditService: IAuditService
  ) {}

  async assignRole(actorId: string, targetUserId: string, roleId: string) {
    // 1. Validate input
    // 2. Check if actor has permission to assign roles
    // 3. Call repository to assign role
    await this.roleRepository.assignRoleToUser(targetUserId, roleId);

    // 4. Log audit trail
    await this.auditService.logAction({
      actorId,
      action: 'ASSIGN_ROLE',
      targetId: targetUserId,
      details: { roleId },
    });
  }

  async removeRole(actorId: string, targetUserId: string, roleId: string) {
    // Similar logic to assignRole
    await this.roleRepository.removeRoleFromUser(targetUserId, roleId);
    await this.auditService.logAction({
      actorId,
      action: 'REMOVE_ROLE',
      targetId: targetUserId,
      details: { roleId },
    });
  }

  async hasPermission(userId: string, permissionCode: string): Promise<boolean> {
    return this.roleRepository.checkUserPermission(userId, permissionCode);
  }
}
