import { detectDevice } from '@shared/utils/device';

export const detectDeviceMiddleware = (req: any, res: any, next: any) => {
  try {
    req.device = detectDevice(req.headers['user-agent']);
    next();
  } catch (error) {
    next(error);
  }
};
