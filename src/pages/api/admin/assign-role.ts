import { NextApiRequest, NextApiResponse } from 'next';
import { withPermission } from '@/pages/api/middleware/withPermission';
import { RoleService } from '@/application/services/role.service';
import { SupabaseRoleRepository } from '@/infrastructure/repositories/role.repository';
import { SupabaseAuditRepository } from '@/infrastructure/repositories/audit.repository';
import { AuditService } from '@/application/services/audit.service';
import { getUserIdFromRequest } from '@/lib/auth';

const roleRepository = new SupabaseRoleRepository();
const auditRepository = new SupabaseAuditRepository();
const auditService = new AuditService(auditRepository);
const roleService = new RoleService(roleRepository, auditService);

async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { targetUserId, roleId } = req.body;
  if (!targetUserId || !roleId) {
    return res.status(400).json({ message: 'Missing targetUserId or roleId' });
  }

  try {
    const actorId = await getUserIdFromRequest(req);
    if (!actorId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    await roleService.assignRole(actorId, targetUserId, roleId);
    return res.status(200).json({ message: 'Role assigned successfully' });
  } catch (error) {
    console.error('Error assigning role:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
}

export default withPermission('roles:assign', handler);
