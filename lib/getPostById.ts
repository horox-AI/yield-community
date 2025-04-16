
import db from '@/utils/config/database';
import Post from '@/utils/models/post';

export async function getPosts() {
  await db();
  const posts = await Post.find({}).lean();
  return posts;
}

export async function getPostById(id: string) {
  await db();
  const post = await Post.findById(id).lean();
  return post;
}

const postsApi = {
  getPosts,
  getPostById
};

export default postsApi;