import React, { FC, useEffect, useState } from 'react';
import nookies from 'nookies';
import { UserContext } from '.';
import { User } from '../../data/entities/user.entity';
import { userService } from '../../data/services/user.service';

export const UserContextProvider: FC = ({ children }) => {
  const [loggedUser, setLoggedUser] = useState<User>();

  const loginUser = (user: User, token: string) => {
    nookies.set(null, 'USER_TOKEN', token);
    setLoggedUser(user);
  };

  const logoutUser = () => {
    nookies.destroy(null, 'USER_TOKEN');
    setLoggedUser(undefined);
  };

  useEffect(() => {
    const { USER_TOKEN } = nookies.get(null);

    if (!USER_TOKEN) return;

    const validateToken = async () => {
      try {
        const authInfo = await userService.validateToken(USER_TOKEN);
        if (!authInfo.isValid) return;
        setLoggedUser(authInfo.user);
      } catch (err) {
        console.log(err);
      }
    };

    validateToken();
  }, []);

  return (
    <UserContext.Provider value={{ loginUser, loggedUser, logoutUser }}>
      {children}
    </UserContext.Provider>
  );
};
