import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserType } from '../types/user';

const userSchema: Schema = new Schema<UserType>({
  id: { type: String, default: uuidv4, unique: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const password = this.get('password');
  if (typeof password === 'string') {
    this.set('password', await bcrypt.hash(password, 10));
  }
  next();
});

const User = mongoose.model<UserType>('User', userSchema);

export default User;
