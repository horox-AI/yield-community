import { NextApiRequest, NextApiResponse } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from './auth/[...nextauth]/route';
import formidable from 'formidable';
import fs from 'fs/promises';
import path from 'path';
import User from '@/utils/models/user';  // Import the User model
import dbConnect from '@/utils/config/database';  // Import your database connection function

export const config = { api: { bodyParser: false } };

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session?.user?.email) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  try {
    await dbConnect();  // Connect to the database

    const { fields, files } = await parseForm(req);
    const { name, bio } = fields;

    let updateData: any = { name, bio };

    if (files.image) {
      const imageFile = Array.isArray(files.image) ? files.image[0] : files.image;
      if (imageFile) {
        const newFilename = await saveFile(imageFile);
        updateData.image = `/uploads/${newFilename}`;
      }
    }

    const updatedUser = await User.findOneAndUpdate(
      { email: session.user.email },
      updateData,
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ 
      message: 'Profile updated successfully',
      user: {
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        image: updatedUser.image
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ error: 'Error updating profile' });
  }
}

async function parseForm(req: NextApiRequest): Promise<{ fields: formidable.Fields; files: formidable.Files }> {
  return new Promise((resolve, reject) => {
    const form = formidable();
    form.parse(req, (err, fields, files) => {
      if (err) reject(err);
      else resolve({ fields, files });
    });
  });
}

async function saveFile(file: formidable.File): Promise<string> {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  await fs.mkdir(uploadDir, { recursive: true });

  const newFilename = `${Date.now()}-${file.originalFilename}`;
  const newPath = path.join(uploadDir, newFilename);

  await fs.copyFile(file.filepath, newPath);
  await fs.unlink(file.filepath);

  return newFilename;
}