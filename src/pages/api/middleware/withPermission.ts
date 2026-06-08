import { NextApiRequest, NextApiResponse, NextApiHandler } from 'next';
import { RoleService } from '@/application/services/role.service';
import { SupabaseRoleRepository } from '@/infrastructure/repositories/role.repository';
import { getUserIdFromRequest } from '@/lib/auth';

// Poor man's dependency injection
const roleRepository = new SupabaseRoleRepository();
const roleService = new RoleService(roleRepository, {} as any); // Audit service not needed here

export const withPermission = (
  permission: string,
  handler: NextApiHandler
) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const userId = await getUserIdFromRequest(req);
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const hasPermission = await roleService.hasPermission(userId, permission);
    if (!hasPermission) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    return handler(req, res);
  };
};
