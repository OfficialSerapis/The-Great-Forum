import { v4 as uuidv4 } from 'uuid';

export const generateId = (): string => uuidv4();

export const isValidId = (id: string): boolean => {
  try {
    return uuidv4.parse(id);
  } catch {
    return false;
  }
};
