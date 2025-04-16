// pages/api/get-user-data.ts

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
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Send user data without the image
    res.status(200).json({
      name: user.name,
      email: user.email,
      hasImage: !!user.image,
      bio: user.bio
    });
  } catch (error) {
    console.error('Error fetching user data:', error);
    res.status(500).json({ error: 'Error fetching user data' });
  }
}