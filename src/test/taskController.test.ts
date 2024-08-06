import {
  describe,
  expect,
  beforeEach,
  afterEach,
  jest,
  it,
} from "@jest/globals";
import { Request, Response, NextFunction } from "express";
import taskController from "../controllers/taskController";
import taskService from "../services/taskService";
import { AppError } from "../utils/errorHandler";
import Task from "../models/task";

jest.mock("../services/taskService");

describe("Task Controller", () => {
  let mockRequest: Partial<Request>;
  let responseObject: Partial<Response>;
  let mockResponse: Partial<Response> & {
    status: jest.Mock<any>;
    json: jest.Mock<any>;
  };
  let nextFunction: NextFunction = jest.fn();

  beforeEach(() => {
    mockRequest = {
      cookies: {
        user: { id: "user123" },
      },
      query: {},
    };
    mockResponse = {
      status: jest.fn().mockReturnThis() as jest.MockedFunction<
        typeof mockResponse.status
      >,
      json: jest.fn().mockImplementation((result: any) => {
        responseObject = result;
      }) as jest.MockedFunction<typeof mockResponse.json>,
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getAllTasks", () => {
    it("should get all tasks for the authenticated user", async () => {
      const mockTasks: any[] = [
        {
          _id: "66ae8052da058f269514d0e8",
          title: "test title 1",
        },
        {
          _id: "66afb787235fbff7fc37c0fc",
          title: "test title 2",
        },
      ];

      (
        taskService.getAllTasks as jest.MockedFunction<
          typeof taskService.getAllTasks
        >
      ).mockResolvedValue({
        tasks: mockTasks,
        totalTasks: 2,
      });

      mockRequest.query = { page: "0", limit: "10" };

      await taskController.getAllTasks(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      jest.spyOn(Task, "countDocuments").mockResolvedValue(2);

      expect(taskService.getAllTasks).toHaveBeenCalledWith("user123", 0, 10);
      expect(mockResponse.json).toHaveBeenCalledWith({
        tasks: mockTasks,
        currentPage: 1,
        totalPages: 1,
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      mockRequest.cookies = {};

      await taskController.getAllTasks(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        new AppError("User not found in session", 401)
      );
    });

    it("should handle errors from the service layer", async () => {
      (
        taskService.getAllTasks as jest.MockedFunction<
          typeof taskService.getAllTasks
        >
      ).mockRejectedValue(new Error("Database error"));

      await taskController.getAllTasks(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(new Error("Database error"));
    });
  });

  describe("createTask", () => {
    it("should create a new task and return the task object with a 201 status", async () => {
      const mockTaskData: any = {
        title: "New Task",
        description: "This is a new task",
        status: "pending",
        priority: "medium",
        dueDate: new Date("2024-09-01T00:00:00.000Z"),
      };
      const mockCreatedTask = {
        _id: "newTaskId",
        ...mockTaskData,
        userId: "user123",
      };
      (
        taskService.createTask as jest.MockedFunction<
          typeof taskService.createTask
        >
      ).mockResolvedValue(mockCreatedTask);
      mockRequest.body = mockTaskData;

      await taskController.createTask(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(taskService.createTask).toHaveBeenCalledWith(
        mockTaskData,
        "user123"
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith({
        createdTask: mockCreatedTask,
        message: "Task created successfully",
      });
    });

    it("should return 401 if user is not authenticated", async () => {
      mockRequest.cookies = {};
      mockRequest.body = {
        title: "New Task",
        status: "pending",
      };

      await taskController.createTask(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        new AppError("User not found in session", 401)
      );
    });

    it("should return 400 for invalid input data", async () => {
      mockRequest.body = {
        // Missing required 'title' field
        status: "pending",
      };

      await taskController.createTask(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        new AppError('"title" is required', 400)
      );
    });

    it("should handle errors from the service layer", async () => {
      (
        taskService.createTask as jest.MockedFunction<
          typeof taskService.createTask
        >
      ).mockRejectedValue(new Error("Database error"));
      mockRequest.body = {
        title: "New Task",
        status: "pending",
      };

      await taskController.createTask(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(new Error("Database error"));
    });
  });
});
