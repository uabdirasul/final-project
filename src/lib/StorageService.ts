import { IUser } from "./User.js";

/**
 * StorageService - Manages all localStorage operations with Promise-based API
 * Simulates a local database for user data
 */
export class StorageService {
  private static readonly USERS_KEY = "chat_app_users";
  private static readonly CURRENT_USER_KEY = "chat_app_current_user";

  /**
   * Initializes default user (abdirasul) if no users exist
   */
  static initializeDefaultUser(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = this.getUsersSync();
        if (users.length === 0) {
          const defaultUser: IUser = {
            username: "abdirasul",
            email: "abdirasul@example.com",
            password: "password123"
          };
          const usersData = [defaultUser];
          localStorage.setItem(this.USERS_KEY, JSON.stringify(usersData));
        }
        resolve();
      }, 0);
    });
  }

  /**
   * Gets all users from localStorage (synchronous helper)
   */
  private static getUsersSync(): IUser[] {
    const data = localStorage.getItem(this.USERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Gets all users from localStorage (Promise-based)
   */
  static getAllUsers(): Promise<IUser[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = this.getUsersSync();
        resolve(users);
      }, 0);
    });
  }

  /**
   * Finds a user by username
   */
  static findUserByUsername(username: string): Promise<IUser | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = this.getUsersSync();
        const user = users.find(
          (u) => u.username.toLowerCase() === username.toLowerCase()
        );
        resolve(user || null);
      }, 0);
    });
  }

  /**
   * Adds a new user to storage
   */
  static addUser(user: IUser): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = this.getUsersSync();

        // Check if user already exists
        if (
          users.some(
            (u) => u.username.toLowerCase() === user.username.toLowerCase()
          )
        ) {
          resolve(false);
          return;
        }

        users.push(user);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));
        resolve(true);
      }, 0);
    });
  }

  /**
   * Sets the currently logged-in user
   */
  static setCurrentUser(username: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.setItem(this.CURRENT_USER_KEY, username);
        resolve();
      }, 0);
    });
  }

  /**
   * Gets the currently logged-in user
   */
  static getCurrentUser(): Promise<string | null> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = localStorage.getItem(this.CURRENT_USER_KEY);
        resolve(user);
      }, 0);
    });
  }

  /**
   * Clears the currently logged-in user (logout)
   */
  static clearCurrentUser(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        resolve();
      }, 0);
    });
  }

  /**
   * Checks if a user is authenticated
   */
  static isAuthenticated(): Promise<boolean> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const user = localStorage.getItem(this.CURRENT_USER_KEY);
        resolve(!!user);
      }, 0);
    });
  }
}
