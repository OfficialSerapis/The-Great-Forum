import { Request, Response, NextFunction } from 'express';
import { documentAnalyticsService } from '../server/services/documentAnalyticsService';
import { Document } from '../server/models/document.model';
import { User } from '../server/models/user.model';

export const trackDocumentView = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentId } = req.params;
    const userId = req.user?.id;

    if (documentId && userId) {
      await documentAnalyticsService.trackDocumentView(parseInt(documentId), userId);
    }

    next();
  } catch (error) {
    console.error('Error tracking document view:', error);
    next();
  }
};

export const trackDocumentEdit = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentId } = req.params;
    const userId = req.user?.id;
    const { changes } = req.body;

    if (documentId && userId) {
      await documentAnalyticsService.trackDocumentEdit(parseInt(documentId), userId, changes);
    }

    next();
  } catch (error) {
    console.error('Error tracking document edit:', error);
    next();
  }
};

export const updateMetrics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentId } = req.params;
    const userId = req.user?.id;
    const { metrics } = req.body;

    if (documentId && userId) {
      await documentAnalyticsService.updateMetrics(parseInt(documentId), userId, metrics);
    }

    next();
  } catch (error) {
    console.error('Error updating metrics:', error);
    next();
  }
};

export const trackDocumentAnalytics = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { documentId } = req.params;
    const userId = req.user?.id;

    if (documentId && userId) {
      const metrics = {
        engagementMetrics: {
          timeSpent: req.metrics?.timeSpent || 0,
          scrollDepth: req.metrics?.scrollDepth || 0,
          interactions: req.metrics?.interactions || 0
        },
        deviceMetrics: {
          type: req.device?.type || 'unknown',
          screenSize: req.device?.screenSize || 'unknown',
          browser: req.device?.browser || 'unknown'
        },
        locationMetrics: {
          country: req.location?.country || 'unknown',
          region: req.location?.region || 'unknown',
          city: req.location?.city || 'unknown'
        }
      };

      await documentAnalyticsService.updateMetrics(parseInt(documentId), userId, metrics);
    }

    next();
  } catch (error) {
    console.error('Error tracking document analytics:', error);
    next();
  }
};
