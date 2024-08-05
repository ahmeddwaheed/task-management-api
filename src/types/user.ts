import { Document } from 'mongoose';

export interface UserType extends Document {
	id: string;
	username: string;
	password: string;
}