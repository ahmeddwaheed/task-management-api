import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "my_secret_key";

const authService = {
  registerUser: async (userData: any) => {
    const { username, password } = userData;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      throw new Error("Username already taken");
    }
    const user = new User({ username, password });
    await user.save();
    return { id: user.id, username: user.username };
  },

  loginUser: async (username: string, password: string) => {
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error("Invalid credentials");
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new Error("Invalid credentials");
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "24h" });
    return token;
  },
};

export default authService;
