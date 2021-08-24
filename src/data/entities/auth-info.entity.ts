import { User } from './user.entity';

export type AuthInfo = {
  user: User;
  token: string;
};
