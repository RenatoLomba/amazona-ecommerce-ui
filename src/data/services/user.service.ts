import { API_URL } from '../../utils/constants';
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
