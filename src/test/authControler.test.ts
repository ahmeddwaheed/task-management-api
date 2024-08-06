import {
  describe,
  expect,
  beforeEach,
  afterEach,
  jest,
  it,
} from "@jest/globals";
import { NextFunction, Request, Response } from "express";
import authController from "../controllers/authController";
import authService from "../services/authService";
import jwt from "jsonwebtoken";

jest.mock("../services/authService");
let mockRequest: Partial<Request>;
let responseObject: Partial<Response>;
let mockResponse: Partial<Response> & {
  status: jest.Mock<any>;
  json: jest.Mock<any>;
};
let mockNext: NextFunction = jest.fn();

describe("Auth Controller", () => {
  beforeEach(() => {
    mockRequest = {};
    mockResponse = {
      status: jest.fn().mockReturnThis() as jest.MockedFunction<
        typeof mockResponse.status
      >,
      json: jest.fn().mockImplementation((result: any) => {
        responseObject = result;
      }) as jest.MockedFunction<typeof mockResponse.json>,
    };
    mockNext = jest.fn();
  });

  jest.mock("../models/user", () => {
    return {
      __esModule: true,
      ...(jest.requireActual("../models/user") as Object),
      findUserById: () =>
        Promise.resolve({
          id: "bc426c44-75d7-46fe-99f9-10793ed1adbb",
          username: "testuser",
          password: "password123",
        }),
    };
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("registerUser", () => {
    it("should register a new user and return the user object with a 201 status", async () => {
      mockRequest.body = { username: "testuser", password: "password123" };
      const mockUser: {
        id: string;
        username: string;
      } = { id: "123", username: "testuser" };
      (
        authService.registerUser as jest.MockedFunction<
          typeof authService.registerUser
        >
      ).mockResolvedValue(mockUser);

      await authController.registerUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(responseObject).toEqual({ user: mockUser });
    });

    it("should handle errors during registration", async () => {
      mockRequest.body = { username: "testuser", password: "password123" };
      (
        authService.registerUser as jest.MockedFunction<
          typeof authService.registerUser
        >
      ).mockRejectedValue(new Error("Username already exists"));

      jest
        .fn<() => Promise<never>>()
        .mockRejectedValue(new Error("Username already exists"));

      await authController.registerUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(responseObject).toEqual({ message: "Username already exists" });
    });
  });

  describe("loginUser", () => {
    it("should login the user and return a token with a 200 status", async () => {
      mockRequest.body = { username: "testuser", password: "password123" };
      const response: { token: string } = { token: "123" };
      jest.spyOn(jwt, "sign").mockImplementation(() => "token");

      (
        authService.loginUser as jest.MockedFunction<
          typeof authService.loginUser
        >
      ).mockResolvedValue(response.token);

      await authController.loginUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(responseObject).toEqual({ token: response.token });
    });

    it("should handle errors during login", async () => {
      mockRequest.body = { username: "testuser", password: "" };
      (
        authService.loginUser as jest.MockedFunction<
          typeof authService.loginUser
        >
      ).mockRejectedValue(new Error("Invalid credentials"));

      jest
        .fn<() => Promise<never>>()
        .mockRejectedValue(new Error("Invalid credentials"));

      await authController.loginUser(
        mockRequest as Request,
        mockResponse as Response
      );

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(responseObject).toEqual({ message: "Invalid credentials" });
    });
  });
});
