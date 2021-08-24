import { createContext } from 'react';
import { User } from '../../data/entities/user.entity';

type UserContextData = {
  loggedUser?: User;
  loginUser: (user: User, token: string) => void;
  logoutUser: () => void;
};

export const UserContext = createContext({} as UserContextData);
