import { StorageService } from "../StorageService";
import { User } from "../User";

// Create a complete localStorage implementation
class LocalStorageMock {
  private store: Record<string, string> = {};

  getItem(key: string): string | null {
    return this.store[key] || null;
  }

  setItem(key: string, value: string): void {
    this.store[key] = value.toString();
  }

  removeItem(key: string): void {
    delete this.store[key];
  }

  clear(): void {
    this.store = {};
  }

  get length(): number {
    return Object.keys(this.store).length;
  }

  key(index: number): string | null {
    return Object.keys(this.store)[index] || null;
  }
}

describe("StorageService", () => {
  beforeEach(() => {
    const storageMock = new LocalStorageMock();
    Object.defineProperty(global, "localStorage", {
      value: storageMock,
      writable: true
    });
    jest.clearAllMocks();
  });

  describe("initializeDefaultUser", () => {
    it("should create default user if no users exist", async () => {
      await StorageService.initializeDefaultUser();

      const storedData = localStorage.getItem("chat_app_users");
      expect(storedData).not.toBeNull();

      const users = JSON.parse(storedData!);
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe("abdirasul");
      expect(users[0].email).toBe("abdirasul@example.com");
    });

    it("should not create user if users already exist", async () => {
      const existingUsers = [
        { username: "user1", email: "user1@example.com", password: "pass" }
      ];
      localStorage.setItem("chat_app_users", JSON.stringify(existingUsers));

      await StorageService.initializeDefaultUser();

      const storedData = localStorage.getItem("chat_app_users");
      const users = JSON.parse(storedData!);
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe("user1");
    });
  });

  describe("getAllUsers", () => {
    it("should return empty array when no users exist", async () => {
      const users = await StorageService.getAllUsers();
      expect(users).toEqual([]);
    });

    it("should return all users from storage", async () => {
      const testUsers = [
        { username: "user1", email: "user1@example.com", password: "pass1" },
        { username: "user2", email: "user2@example.com", password: "pass2" }
      ];
      localStorage.setItem("chat_app_users", JSON.stringify(testUsers));

      const users = await StorageService.getAllUsers();
      expect(users).toEqual(testUsers);
      expect(users).toHaveLength(2);
    });
  });

  describe("findUserByUsername", () => {
    it("should return null when user not found", async () => {
      localStorage.setItem("chat_app_users", JSON.stringify([]));

      const user = await StorageService.findUserByUsername("nonexistent");
      expect(user).toBeNull();
    });

    it("should return user when found", async () => {
      const testUser = {
        username: "testuser",
        email: "test@example.com",
        password: "pass"
      };
      localStorage.setItem("chat_app_users", JSON.stringify([testUser]));

      const user = await StorageService.findUserByUsername("testuser");
      expect(user).toEqual(testUser);
    });

    it("should find user case-insensitively", async () => {
      const testUser = {
        username: "TestUser",
        email: "test@example.com",
        password: "pass"
      };
      localStorage.setItem("chat_app_users", JSON.stringify([testUser]));

      const user = await StorageService.findUserByUsername("testuser");
      expect(user).toEqual(testUser);
    });

    it("should return first matching user when multiple exist", async () => {
      const users = [
        { username: "user1", email: "user1@example.com", password: "pass1" },
        { username: "user2", email: "user2@example.com", password: "pass2" }
      ];
      localStorage.setItem("chat_app_users", JSON.stringify(users));

      const user = await StorageService.findUserByUsername("user1");
      expect(user?.username).toBe("user1");
    });
  });

  describe("addUser", () => {
    it("should add a new user", async () => {
      localStorage.setItem("chat_app_users", JSON.stringify([]));
      const newUser = new User("newuser", "new@example.com", "password");

      const result = await StorageService.addUser(newUser);
      expect(result).toBe(true);

      const storedData = localStorage.getItem("chat_app_users");
      const users = JSON.parse(storedData!);
      expect(users).toHaveLength(1);
      expect(users[0].username).toBe("newuser");
    });

    it("should return false if user already exists", async () => {
      const existingUser = {
        username: "existing",
        email: "existing@example.com",
        password: "pass"
      };
      localStorage.setItem("chat_app_users", JSON.stringify([existingUser]));

      const newUser = new User("existing", "new@example.com", "password");
      const result = await StorageService.addUser(newUser);
      expect(result).toBe(false);
    });

    it("should preserve existing users when adding new one", async () => {
      const existingUser = {
        username: "user1",
        email: "user1@example.com",
        password: "pass1"
      };
      localStorage.setItem("chat_app_users", JSON.stringify([existingUser]));

      const newUser = new User("user2", "user2@example.com", "pass2");
      await StorageService.addUser(newUser);

      const storedData = localStorage.getItem("chat_app_users");
      const users = JSON.parse(storedData!);
      expect(users).toHaveLength(2);
      expect(users[0].username).toBe("user1");
      expect(users[1].username).toBe("user2");
    });
  });

  describe("setCurrentUser and getCurrentUser", () => {
    it("should set and get current user", async () => {
      await StorageService.setCurrentUser("testuser");
      const user = await StorageService.getCurrentUser();
      expect(user).toBe("testuser");
    });

    it("should return null when no user is logged in", async () => {
      const user = await StorageService.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe("clearCurrentUser", () => {
    it("should clear current user", async () => {
      await StorageService.setCurrentUser("testuser");
      await StorageService.clearCurrentUser();

      const user = await StorageService.getCurrentUser();
      expect(user).toBeNull();
    });
  });

  describe("isAuthenticated", () => {
    it("should return false when no user is logged in", async () => {
      const isAuth = await StorageService.isAuthenticated();
      expect(isAuth).toBe(false);
    });

    it("should return true when user is logged in", async () => {
      await StorageService.setCurrentUser("testuser");
      const isAuth = await StorageService.isAuthenticated();
      expect(isAuth).toBe(true);
    });
  });
});
