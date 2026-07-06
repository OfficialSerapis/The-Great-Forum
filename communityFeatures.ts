import { CommunityRole, ContentAnalytics } from '../shared/schema';

export class CommunityFeatures {
  private communityRoles: Map<number, CommunityRole> = new Map();
  private contentAnalytics: Map<number, ContentAnalytics> = new Map();

  // Community Role Management
  async createCommunityRole(role: CommunityRole): Promise<CommunityRole> {
    this.communityRoles.set(role.id, role);
    return role;
  }

  async getCommunityRole(id: number): Promise<CommunityRole | null> {
    return this.communityRoles.get(id) || null;
  }

  async updateCommunityRole(id: number, updates: Partial<CommunityRole>): Promise<CommunityRole | null> {
    const role = this.communityRoles.get(id);
    if (!role) return null;

    const updatedRole = { ...role, ...updates, updatedAt: new Date() };
    this.communityRoles.set(id, updatedRole);
    return updatedRole;
  }

  async deleteCommunityRole(id: number): Promise<boolean> {
    return this.communityRoles.delete(id);
  }

  // Content Analytics
  async createContentAnalytics(analytics: ContentAnalytics): Promise<ContentAnalytics> {
    this.contentAnalytics.set(analytics.id, analytics);
    return analytics;
  }

  async getContentAnalytics(id: number): Promise<ContentAnalytics | null> {
    return this.contentAnalytics.get(id) || null;
  }

  async updateContentAnalytics(id: number, updates: Partial<ContentAnalytics>): Promise<ContentAnalytics | null> {
    const analytics = this.contentAnalytics.get(id);
    if (!analytics) return null;

    const updatedAnalytics = { ...analytics, ...updates, updatedAt: new Date() };
    this.contentAnalytics.set(id, updatedAnalytics);
    return updatedAnalytics;
  }

  async deleteContentAnalytics(id: number): Promise<boolean> {
    return this.contentAnalytics.delete(id);
  }

  // Community Features
  async getCommunityRolesByCommunity(communityId: number): Promise<CommunityRole[]> {
    return Array.from(this.communityRoles.values()).filter(
      role => role.communityId === communityId
    );
  }

  async getContentAnalyticsByType(contentType: string): Promise<ContentAnalytics[]> {
    return Array.from(this.contentAnalytics.values()).filter(
      analytics => analytics.contentType === contentType
    );
  }

  async getContentAnalyticsByUser(userId: number): Promise<ContentAnalytics[]> {
    return Array.from(this.contentAnalytics.values()).filter(
      analytics => analytics.userId === userId
    );
  }

  // Analytics Aggregation
  async getCommunityAnalytics(communityId: number): Promise<{
    totalPosts: number;
    totalEngagement: number;
    averageViewTime: number;
    demographicData: Record<string, number>;
  }> {
    const analytics = Array.from(this.contentAnalytics.values()).filter(
      a => a.communityId === communityId
    );

    return {
      totalPosts: analytics.length,
      totalEngagement: analytics.reduce((sum, a) => sum + a.engagement, 0),
      averageViewTime: analytics.reduce((sum, a) => sum + a.averageViewTime, 0) / analytics.length,
      demographicData: this.aggregateDemographics(analytics)
    };
  }

  private aggregateDemographics(analytics: ContentAnalytics[]): Record<string, number> {
    const demographics = {
      ageGroups: {},
      locations: {},
      devices: {}
    };

    for (const a of analytics) {
      if (a.demographicData) {
        Object.entries(a.demographicData.ageGroups).forEach(([age, count]) => {
          demographics.ageGroups[age] = (demographics.ageGroups[age] || 0) + count;
        });

        Object.entries(a.demographicData.locations).forEach(([location, count]) => {
          demographics.locations[location] = (demographics.locations[location] || 0) + count;
        });

        Object.entries(a.demographicData.devices).forEach(([device, count]) => {
          demographics.devices[device] = (demographics.devices[device] || 0) + count;
        });
      }
    }

    return demographics;
  }
}
