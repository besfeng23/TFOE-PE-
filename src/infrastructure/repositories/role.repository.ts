import { createClient } from '@/lib/supabase/server';
import { Role, Permission, UserRole } from '@/domain/entities/role.entity';

export interface IRoleRepository {
  getRoleByName(name: string): Promise<Role | null>;
  getRoleById(id: string): Promise<Role | null>;
  getPermissionsByRoleId(roleId: string): Promise<Permission[]>;
  assignRoleToUser(userId: string, roleId: string): Promise<void>;
  removeRoleFromUser(userId: string, roleId: string): Promise<void>;
  checkUserPermission(userId: string, permissionCode: string): Promise<boolean>;
}

export class SupabaseRoleRepository implements IRoleRepository {
  async getRoleByName(name: string): Promise<Role | null> {
    // Implementation ...
    return null
  }

  async getRoleById(id: string): Promise<Role | null> {
    // Implementation ...
    return null
  }

  async getPermissionsByRoleId(roleId: string): Promise<Permission[]> {
    // Implementation ...
    return []
  }

  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    // Implementation ...
  }

  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    // Implementation ...
  }

  async checkUserPermission(userId: string, permissionCode: string): Promise<boolean> {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('check_user_permission', {
      p_user_id: userId,
      p_permission_code: permissionCode
    });

    if (error) {
      console.error("Error checking permission:", error);
      return false;
    }
    return data as boolean;
  }
}
