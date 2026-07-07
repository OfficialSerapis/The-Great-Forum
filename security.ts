export interface RateLimitOptions {
  limit: number;
  windowMs: number;
  keyGenerator?: (req: Request) => string;
}

export interface SecurityHeaders {
  'X-Frame-Options': string;
  'X-Content-Type-Options': string;
  'Referrer-Policy': string;
  'Strict-Transport-Security': string;
  'Content-Security-Policy': string;
}

export interface InputValidationSchema {
  [key: string]: any;
  required?: string[];
  properties?: {
    [key: string]: {
      type: string;
      format?: string;
      pattern?: string;
      minLength?: number;
      maxLength?: number;
    };
  };
}

export interface JWTConfig {
  secret: string;
  expiresIn: string;
  algorithms: string[];
}

export interface CSRFConfig {
  cookie: {
    key: string;
    secure: boolean;
    httpOnly: boolean;
  };
  value: string;
}

export interface XSSConfig {
  onNoMatch: 'escape' | 'throw';
  whiteList: string[];
  escapeHtml: boolean;
}
