import { createClient } from '@/lib/supabase/server';
import { Member } from '@/domain/entities/member.entity';

export interface IMemberRepository {
  findById(id: string): Promise<Member | null>;
  findByUserId(userId: string): Promise<Member | null>;
  save(member: Member): Promise<void>;
  list(params: { limit: number; offset: number; clubId?: string }): Promise<Member[]>;
}

export class SupabaseMemberRepository implements IMemberRepository {
  async findById(id: string): Promise<Member | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async findByUserId(userId: string): Promise<Member | null> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .eq('profile_id', userId)
      .single();

    if (error || !data) return null;
    return this.mapToEntity(data);
  }

  async save(member: Member): Promise<void> {
    const supabase = await createClient();
    const { error } = await supabase
      .from('members')
      .upsert({
        id: member.id,
        profile_id: member.userId,
        status: member.status,
        club_id: member.clubId,
        region_id: member.regionId,
        // council_id is missing in domain entity but present in DB, need to sync
        updated_at: new Date().toISOString(),
      });

    if (error) throw new Error(`Failed to save member: ${error.message}`);
  }

  async list(params: { limit: number; offset: number; clubId?: string }): Promise<Member[]> {
    const supabase = await createClient();
    let query = supabase.from('members').select('*');
    
    if (params.clubId) {
      query = query.eq('club_id', params.clubId);
    }

    const { data, error } = await query
      .range(params.offset, params.offset + params.limit - 1);

    if (error) throw new Error(`Failed to list members: ${error.message}`);
    return data.map(this.mapToEntity);
  }

  private mapToEntity(data: any): Member {
    return {
      id: data.id,
      userId: data.profile_id,
      status: data.status,
      clubId: data.club_id,
      regionId: data.region_id,
      createdAt: new Date(data.created_at),
      updatedAt: new Date(data.updated_at),
    };
  }
}
