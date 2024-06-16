import mongoose, { Schema, Document, ObjectId } from 'mongoose';
import { PostEntity } from '../../../domain/entities'



const PostsSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'users' },
  content: { type: String },
  media: {
    path: { type: String },
    type: { type: String }
  },
  likes: { type: Number },
  comments: { type: Number },
  saves: { type: Number },
  shares: { type: Number },
  isBlocked: { type: Boolean }

}, { timestamps: true });

export const Posts = mongoose.model<PostEntity>('Posts', PostsSchema);



