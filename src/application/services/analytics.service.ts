import { IAnalyticsRepository } from '@/infrastructure/repositories/analytics.repository';

export class AnalyticsService {
  constructor(private analyticsRepository: IAnalyticsRepository) {}

  async getDashboardData() {
    const [summary, growth, distribution] = await Promise.all([
      this.analyticsRepository.getExecutiveSummary(),
      this.analyticsRepository.getMembershipGrowth(),
      this.analyticsRepository.getRegionalDistribution(),
    ]);

    return {
      summary,
      growth,
      distribution,
    };
  }
}
