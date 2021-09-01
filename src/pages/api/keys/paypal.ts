import type { NextApiRequest, NextApiResponse } from 'next';
import { userService } from '../../../data/services/user.service';
import { PAYPAL_CLIENT_ID } from '../../../utils/constants';
import { getError } from '../../../utils/error';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (!req.method && req.method !== 'GET') {
    return res.status(400).json({ message: 'Only accepts GET requests' });
  }

  if (!req.headers.authorization) {
    return res.status(400).json({ message: 'Unauthorized' });
  }

  const [bearer, token] = req.headers.authorization.split(' ');

  try {
    const { isValid } = await userService.validateToken(token);
    if (!isValid) return res.status(400).json({ message: 'Unauthorized' });
    return res.status(200).send(PAYPAL_CLIENT_ID || 'sb');
  } catch (err) {
    return res.status(500).json({ message: getError(err) });
  }
}
