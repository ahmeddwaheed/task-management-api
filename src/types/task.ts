import { Document } from "mongoose";

export interface TaskType extends Document {
  id: string;
  title: string;
  description: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  dueDate: Date;
  userId: string;
}
