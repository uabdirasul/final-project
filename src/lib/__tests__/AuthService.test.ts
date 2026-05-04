import { AuthService } from "../AuthService";
import { StorageService } from "../StorageService";
import { User } from "../User";

jest.mock("../StorageService");

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("register", () => {
    it("should return success for valid registration", async () => {
      const mockStorageService = StorageService as jest.Mocked<
        typeof StorageService
      >;
      mockStorageService.findUserByUsername.mockResolvedValueOnce(null);
      mockStorageService.addUser.mockResolvedValueOnce(true);
      mockStorageService.setCurrentUser.mockResolvedValueOnce(undefined);

      const result = await AuthService.register(
        "newuser",
        "new@example.com",
        "password123"
      );

      expect(result.success).toBe(true);
      expect(result.message).toBe("Registration successful");
      expect(mockStorageService.addUser).toHaveBeenCalled();
      expect(mockStorageService.setCurrentUser).toHaveBeenCalledWith("newuser");
    });

    it("should return error for invalid user data", async () => {
      const result = await AuthService.register(
        "newuser",
        "invalid-email",
        "password123"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe(
        "All fields are required and email must be valid"
      );
    });

    it("should return error for username too short", async () => {
      const result = await AuthService.register(
        "ab",
        "test@example.com",
        "password123"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Username must be at least 3 characters");
    });

    it("should return error for password too short", async () => {
      const result = await AuthService.register(
        "testuser",
        "test@example.com",
        "ab"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Password must be at least 3 characters");
    });

    it("should return error when username already exists", async () => {
      const mockStorageService = StorageService as jest.Mocked<
        typeof StorageService
      >;
      const existingUser = new User(
        "existing",
        "existing@example.com",
        "password"
      );
      mockStorageService.findUserByUsername.mockResolvedValueOnce(existingUser);

      const result = await AuthService.register(
        "existing",
        "new@example.com",
        "password123"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Username already exists");
      expect(mockStorageService.addUser).not.toHaveBeenCalled();
    });

    it("should return error when addUser fails", async () => {
      const mockStorageService = StorageService as jest.Mocked<
        typeof StorageService
      >;
      mockStorageService.findUserByUsername.mockResolvedValueOnce(null);
      mockStorageService.addUser.mockResolvedValueOnce(false);

      const result = await AuthService.register(
        "newuser",
        "new@example.com",
        "password123"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Registration failed");
    });

    it("should return error for empty username", async () => {
      const result = await AuthService.register(
        "",
        "test@example.com",
        "password123"
      );

      expect(result.success).toBe(false);
    });

    it("should return error for whitespace-only username", async () => {
      const result = await AuthService.register(
        "   ",
        "test@example.com",
        "password123"
      );

      expect(result.success).toBe(false);
      expect(result.message).toBe("Username must be at least 3 characters");
    });
  });

  describe("login", () => {
    it("should return success for valid login", async () => {
      const mockStorageService = StorageService as jest.Mocked<
        typeof StorageService
      >;
      const user = new User("testuser", "test@example.com", "password123");
      mockStorageService.findUserByUsername.mockResolvedValueOnce(user);
      mockStorageService.setCurrentUser.mockResolvedValueOnce(undefined);

      const result = await AuthService.login("testuser", "password123");

      expect(result.success).toBe(true);
      expect(result.message).toBe("Login successful");
      expect(mockStorageService.setCurrentUser).toHaveBeenCalledWith(
        "testuser"
      );
    });

    it("should return error for non-existent user", async () => {
      const mockStorageService = StorageService as jest.Mocked<
        typeof StorageService
      >;
      mockStorageService.findUserByUsername.mockResolvedValueOnce(null);

      const result = await AuthService.login("nonexistent", "password123");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid username or password");
    });

    it("should return error for incorrect password", async () => {
      const mockStorageService = StorageService as jest.Mocked<
        typeof StorageService
      >;
      const user = new User("testuser", "test@example.com", "password123");
      mockStorageService.findUserByUsername.mockResolvedValueOnce(user);

      const result = await AuthService.login("testuser", "wrongpassword");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid username or password");
    });

    it("should return error for empty username", async () => {
      const result = await AuthService.login("", "password123");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid username or password");
    });

    it("should return error for empty password", async () => {
      const result = await AuthService.login("testuser", "");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid username or password");
    });

    it("should return error for whitespace-only username", async () => {
      const result = await AuthService.login("   ", "password123");

      expect(result.success).toBe(false);
      expect(result.message).toBe("Invalid username or password");
    });
  });

  describe("logout", () => {
    it("should clear current user", async () => {
      const mockStorageService = StorageService as jest.Mocked<
        typeof StorageService
      >;
      mockStorageService.clearCurrentUser.mockResolvedValueOnce(undefined);

      await AuthService.logout();

      expect(mockStorageService.clearCurrentUser).toHaveBeenCalled();
    });
  });

  describe("isAuthenticated", () => {
    it("should return true when user is authenticated", async () => {
      const mockStorageService = StorageService as jest.Mocked<
        typeof StorageService
      >;
      mockStorageService.isAuthenticated.mockResolvedValueOnce(true);

      const result = await AuthService.isAuthenticated();

      expect(result).toBe(true);
    });

    it("should return false when user is not authenticated", async () => {
      const mockStorageService = StorageService as jest.Mocked<
        typeof StorageService
      >;
      mockStorageService.isAuthenticated.mockResolvedValueOnce(false);

      const result = await AuthService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe("getCurrentUser", () => {
    it("should return current user when authenticated", async () => {
      const mockStorageService = StorageService as jest.Mocked<
        typeof StorageService
      >;
      mockStorageService.getCurrentUser.mockResolvedValueOnce("testuser");

      const result = await AuthService.getCurrentUser();

      expect(result).toBe("testuser");
    });

    it("should return null when not authenticated", async () => {
      const mockStorageService = StorageService as jest.Mocked<
        typeof StorageService
      >;
      mockStorageService.getCurrentUser.mockResolvedValueOnce(null);

      const result = await AuthService.getCurrentUser();

      expect(result).toBeNull();
    });
  });
});
