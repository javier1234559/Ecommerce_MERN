import { Document } from 'mongoose'; // Assuming you're using Mongoose for MongoDB object modeling

export interface IUserPayload extends Document {
 name: string;
 email: string;
 isAdmin: boolean;
}

declare global {
  namespace Express {
    interface Request {
      user?: IUserPayload
    }
  }
}

export interface IEncoded {
  userId: string;
}
