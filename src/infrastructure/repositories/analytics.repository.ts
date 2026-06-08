import { createClient } from '@/lib/supabase/server';

export interface DashboardMetrics {
  totalActiveMembers: number;
  pendingApplications: number;
  monthlyDuesCollected: number;
  totalRegions: number;
  totalClubs: number;
}

export interface IAnalyticsRepository {
  getExecutiveSummary(): Promise<DashboardMetrics>;
  getMembershipGrowth(): Promise<any[]>;
  getRegionalDistribution(): Promise<any[]>;
}

export class SupabaseAnalyticsRepository implements IAnalyticsRepository {
  async getExecutiveSummary(): Promise<DashboardMetrics> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('executive_dashboard_summary')
      .select('*')
      .single();

    if (error) throw new Error(`Failed to fetch executive summary: ${error.message}`);

    return {
      totalActiveMembers: data.total_active_members,
      pendingApplications: data.pending_applications,
      monthlyDuesCollected: Number(data.monthly_dues_collected),
      totalRegions: data.total_regions,
      totalClubs: data.total_clubs,
    };
  }

  async getMembershipGrowth(): Promise<any[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('membership_growth_monthly')
      .select('*');
    if (error) throw new Error(error.message);
    return data;
  }

  async getRegionalDistribution(): Promise<any[]> {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('regional_member_distribution')
      .select('*');
    if (error) throw new Error(error.message);
    return data;
  }
}
