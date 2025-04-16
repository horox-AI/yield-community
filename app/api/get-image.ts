// pages/api/get-image.ts

import { NextApiRequest, NextApiResponse } from 'next';
import connect from '@/utils/config/database';
import User from '@/utils/models/user';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.query;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  await connect();

  try {
    const user = await User.findOne({ email: email });
    if (!user || !user.image) {
      return res.status(404).json({ error: 'Image not found' });
    }

    res.setHeader('Content-Type', user.image.contentType);
    res.send(user.image.data);
  } catch (error) {
    console.error('Error fetching image:', error);
    res.status(500).json({ error: 'Error fetching image' });
  }
}