import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { TaskType } from "../types/task";

const taskSchema: Schema = new Schema<TaskType>({
  id: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  priority: {
    type: String,
    enum: ["low", "medium", "high"],
    default: "low",
  },
  dueDate: {
    type: Date,
  },
  userId: {
    type: String,
    required: true,
  },
});

const Task = mongoose.model<TaskType>("Task", taskSchema);

export default Task;
