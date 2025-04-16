import Post from '@/utils/models/post';
import connect from '@/utils/config/database';

interface PostType {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  votes: number;
  comments: number;
  authorImage: string;
  commenters: Array<string>;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

async function dbConnect() {
  try {
    await connect();
  } catch (error) {
    console.error('Failed to connect to the database:', error);
    throw new Error('Database connection failed');
  }
}

const apiPosts = async (): Promise<PostType[]> => {
  await dbConnect();
  try {
    const posts = await Post.find().lean();
    return posts as PostType[];
  } catch (error) {
    console.error("Failed to get posts:", error);
    throw new Error('Failed to fetch posts');
  }
};

const getPosts = async (): Promise<PostType[]> => {
  await connect();
  try {
    const posts = await Post.find().lean();
    return posts.map(post => ({
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      author: post.author,
      date: formatDate(post.date),
      votes: post.votes,
      comments: post.comments,
      authorImage: post.authorImage || '',
      commenters: post.commenters || []
    }));
  } catch (error) {
    console.error("Failed to get posts:", error);
    throw new Error('Failed to fetch posts');
  }
};

const getPostById = async (id: string): Promise<PostType | null> => {
  await dbConnect();
  console.log('Attempting to fetch post with ID:', id);
  try {
    const post = await Post.findById(id).lean();
    console.log('Raw post from database:', post);
    if (!post) {
      console.log('No post found with ID:', id);
      return null;
    }
    const formattedPost = {
      id: post._id.toString(),
      title: post.title,
      content: post.content,
      author: post.author,
      date: formatDate(post.date),
      votes: post.votes,
      comments: post.comments,
      authorImage: post.authorImage || '',
      commenters: post.commenters || []
    };
    console.log('Formatted post:', formattedPost);
    return formattedPost;
  } catch (error) {
    console.error("Failed to get post:", error);
    throw new Error('Failed to fetch post');
  }
};

export default { getPosts, getPostById, apiPosts };