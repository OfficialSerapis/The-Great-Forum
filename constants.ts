export const API_VERSION = 'v1';
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;
export const DOCUMENT_PERMISSIONS = {
  OWNER: 'owner',
  EDITOR: 'editor',
  VIEWER: 'viewer'
} as const;

export type DocumentPermission = typeof DOCUMENT_PERMISSIONS[keyof typeof DOCUMENT_PERMISSIONS];
