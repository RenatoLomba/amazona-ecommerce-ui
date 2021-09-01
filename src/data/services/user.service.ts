import nookies from 'nookies';
import { API_URL } from '../../utils/constants';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthInfo } from '../entities/auth-info.entity';
import { User } from '../entities/user.entity';

type RegisterDto = {
  email: string;
  name: string;
  password: string;
};

class UserSerivce {
  async login(email: string, password: string): Promise<AuthInfo> {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  }

  async register(dto: RegisterDto): Promise<AuthInfo> {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dto),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  }

  async update(dto: UpdateUserDto): Promise<AuthInfo> {
    const { USER_TOKEN } = nookies.get(null);

    if (!USER_TOKEN) throw new Error('Unauthorized request');

    const res = await fetch(`${API_URL}/auth/update`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + USER_TOKEN,
      },
      body: JSON.stringify(dto),
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  }

  async validateToken(
    token: string,
  ): Promise<{ isValid: boolean; user: User }> {
    const res = await fetch(`${API_URL}/auth`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + token,
      },
    });
    const data = await res.json();

    if (!res.ok) throw new Error(data.message);

    return data;
  }
}

const userService = new UserSerivce();

export { userService };
