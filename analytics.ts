export interface AnalyticsData {
  views: number;
  edits: any[];
  collaborators: number;
  lastModified: Date;
  versionCount: number;
  quantumProcessing?: {
    coherence: number;
    entanglement: number;
  };
}

export interface UserAnalytics {
  totalDocuments: number;
  totalEdits: number;
  activeCollaborations: number;
  quantumActivity?: {
    stateVector: string;
    coherenceMetric: number;
  };
}

export interface DocumentPerformance {
  loadTime: number;
  responseTime: number;
  memoryUsage: number;
  issues: string[];
}

export interface ActivityMetrics {
  activeSessions: number;
  recentActivity: any[];
  anomalies: string[];
}

export interface SystemAnalytics {
  totalDocuments: number;
  activeUsers: number;
  dailyActiveUsers: number;
  totalCollaborations: number;
  quantumProcessingStats: {
    activeProcesses: number;
    averageCoherence: number;
    totalEntanglements: number;
  };
}
