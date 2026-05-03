/**
 * User Interface - Defines the contract for user data
 */
export interface IUser {
  username: string;
  email: string;
  password: string;
}

/**
 * User Class - Represents a user in the system
 */
export class User implements IUser {
  username: string;
  email: string;
  password: string;

  constructor(username: string, email: string, password: string) {
    this.username = username;
    this.email = email;
    this.password = password;
  }

  /**
   * Validates email format using regex
   */
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Checks if all required fields are filled
   */
  isValid(): boolean {
    return (
      this.username.trim().length > 0 &&
      this.email.trim().length > 0 &&
      this.password.length > 0 &&
      User.isValidEmail(this.email)
    );
  }
}
