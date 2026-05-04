import { User } from "../User";

describe("User", () => {
  describe("constructor", () => {
    it("should create a user with username, email, and password", () => {
      const user = new User("testuser", "test@example.com", "password123");
      expect(user.username).toBe("testuser");
      expect(user.email).toBe("test@example.com");
      expect(user.password).toBe("password123");
    });
  });

  describe("isValidEmail", () => {
    it("should return true for valid emails", () => {
      expect(User.isValidEmail("test@example.com")).toBe(true);
      expect(User.isValidEmail("user@domain.co.uk")).toBe(true);
      expect(User.isValidEmail("name.surname@example.org")).toBe(true);
    });

    it("should return false for invalid emails", () => {
      expect(User.isValidEmail("invalid")).toBe(false);
      expect(User.isValidEmail("test@")).toBe(false);
      expect(User.isValidEmail("@example.com")).toBe(false);
      expect(User.isValidEmail("test @example.com")).toBe(false);
      expect(User.isValidEmail("")).toBe(false);
    });
  });

  describe("isValid", () => {
    it("should return true for valid user", () => {
      const user = new User("testuser", "test@example.com", "password123");
      expect(user.isValid()).toBe(true);
    });

    it("should return false when username is empty", () => {
      const user = new User("", "test@example.com", "password123");
      expect(user.isValid()).toBe(false);
    });

    it("should return false when username is whitespace only", () => {
      const user = new User("   ", "test@example.com", "password123");
      expect(user.isValid()).toBe(false);
    });

    it("should return false when email is empty", () => {
      const user = new User("testuser", "", "password123");
      expect(user.isValid()).toBe(false);
    });

    it("should return false when email is whitespace only", () => {
      const user = new User("testuser", "   ", "password123");
      expect(user.isValid()).toBe(false);
    });

    it("should return false when email is invalid format", () => {
      const user = new User("testuser", "invalid-email", "password123");
      expect(user.isValid()).toBe(false);
    });

    it("should return false when password is empty", () => {
      const user = new User("testuser", "test@example.com", "");
      expect(user.isValid()).toBe(false);
    });

    it("should return false when multiple fields are invalid", () => {
      const user = new User("", "invalid", "");
      expect(user.isValid()).toBe(false);
    });
  });
});
