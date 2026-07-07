export interface Action {
  id: string;
  type: string;
  payload: any;
  timestamp: Date;
  userId: number;
}

export const createAction = (type: string, payload: any, userId: number): Action => ({
  id: generateId(),
  type,
  payload,
  timestamp: new Date(),
  userId
});
