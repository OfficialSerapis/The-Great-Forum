export interface User {
  id: number;
  username: string;
  name: string;
  password: string;
  email?: string;
  phoneNumber?: string;
  countryCode?: string;
  bio?: string;
  avatar?: string;
  background?: string;
  filterMatureContent?: boolean;
  createdAt: Date;
  updatedAt: Date;
  isAnonymous?: boolean;
  [key: string]: any;
}
