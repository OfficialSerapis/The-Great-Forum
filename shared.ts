export type Gender = 'male' | 'female';

export interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  name: string;
  avatar: string;
  background: string;
  filterMatureContent: boolean;
  userType: 'individual' | 'organisation';
  gender: Gender;
  token: string;
}
