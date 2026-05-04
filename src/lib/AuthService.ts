import { StorageService } from "./StorageService.js";
import { User } from "./User.js";

/**
 * AuthService - Handles all authentication logic
 * Manages login, registration, and session management
 */
export class AuthService {
  /**
   * Registers a new user
   */
  static async register(
    username: string,
    email: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    // Validate input with specific checks first
    if (username.trim().length < 3) {
      return {
        success: false,
        message: "Username must be at least 3 characters"
      };
    }

    if (password.length < 3) {
      return {
        success: false,
        message: "Password must be at least 3 characters"
      };
    }

    // Then validate general format
    const user = new User(username, email, password);

    if (!user.isValid()) {
      return {
        success: false,
        message: "All fields are required and email must be valid"
      };
    }

    // Check if user already exists
    const existingUser = await StorageService.findUserByUsername(username);
    if (existingUser) {
      return {
        success: false,
        message: "Username already exists"
      };
    }

    // Add user to storage
    const added = await StorageService.addUser(user);

    if (added) {
      // Set as current user
      await StorageService.setCurrentUser(username);
      return {
        success: true,
        message: "Registration successful"
      };
    }

    return {
      success: false,
      message: "Registration failed"
    };
  }

  /**
   * Logs in a user with username and password
   */
  static async login(
    username: string,
    password: string
  ): Promise<{ success: boolean; message: string }> {
    if (!username.trim() || !password) {
      return {
        success: false,
        message: "Invalid username or password"
      };
    }

    // Find user by username
    const user = await StorageService.findUserByUsername(username);

    if (!user || user.password !== password) {
      return {
        success: false,
        message: "Invalid username or password"
      };
    }

    // Set as current user
    await StorageService.setCurrentUser(username);

    return {
      success: true,
      message: "Login successful"
    };
  }

  /**
   * Logs out the current user
   */
  static async logout(): Promise<void> {
    await StorageService.clearCurrentUser();
  }

  /**
   * Checks if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    return await StorageService.isAuthenticated();
  }

  /**
   * Gets the current authenticated user
   */
  static async getCurrentUser(): Promise<string | null> {
    return await StorageService.getCurrentUser();
  }
}
