import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IPost extends Document {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail: string;
  date: string;
  votes: number;
  userVoted: boolean;
  comments: number;
  authorImage?: string;
  commenters: Array<string>;
  category: string;
  tags: Array<string>;
  images: Array<string>;
  status: string;
}

const PostSchema: Schema = new Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorEmail: { type: String, required: true },
  date: { type: Date, required: true, default: Date.now },
  votes: { type: Number, required: true, default: 0 },
  userVoted: { type: Boolean, required: true, default: false },
  comments: { type: Number, required: true, default: 0 },
  authorImage: { type: String, required: false },
  commenters: [{ type: String }],
  category: { type: String, required: true, default: 'Real Estate Investing' },
  tags: [{ type: String }],
  images: [{ type: String }],
  status: { type: String, required: true, enum: ['draft', 'published'], default: 'published' }
}, { timestamps: true });

// Check if the model exists before creating it
const Post: Model<IPost> = mongoose.models.Post || mongoose.model<IPost>('Post', PostSchema);

export default Post;
