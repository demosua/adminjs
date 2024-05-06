import mongoose, { Schema, Document } from 'mongoose';

// Define the role enum
enum UserRole {
  ADMIN = 'admin',
  OWNER = 'owner',
  MANAGER = 'manager',
  PAINTER = 'painter'
}

enum UserStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived'
}

// Define the interface for the User object
interface User extends Document {
  username: string;
  email: string;
  password: string;
  status: UserStatus;
  role: UserRole;
  createdAt: Date;
  // Add more properties as needed
}

// Define the schema for the User object
const UserSchema: Schema = new Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  status: { type: String, enum: Object.values(UserStatus) },
  role: { type: String, enum: Object.values(UserRole) },
  createdAt: { type: Date, default: Date.now }
  // Add more schema definitions as needed
});

// Create and export the User model based on the schema
const UserModel = mongoose.model<User>('User', UserSchema);

export default UserModel;
