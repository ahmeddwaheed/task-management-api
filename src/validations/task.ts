import Joi from "joi";

export const taskSchema = Joi.object({
  title: Joi.string().required().min(3).max(100),
  description: Joi.string().allow(null, ""),

  status: Joi.string().valid("pending", "in-progress", "completed").required(),

  priority: Joi.string().valid("low", "medium", "high").default("medium"),

  dueDate: Joi.date().iso().allow(null),
});
