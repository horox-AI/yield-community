import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  postId: string;
  content: string;
  author: string;
  authorImage: string;
  authorEmail: string;
  parentCommentId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CommentSchema: Schema = new Schema({
  postId: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  authorImage: { type: String, required: true },
  authorEmail: { type: String, required: true },
  parentCommentId: { type: String },
}, { timestamps: true });

const Comment = mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;