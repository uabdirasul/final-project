import { AuthService } from "../lib/AuthService.js";
import { StorageService } from "../lib/StorageService.js";
import { User } from "../lib/User.js";

/**
 * RegisterController - Handles registration form logic
 */
class RegisterController {
  private usernameInput: HTMLInputElement | null;
  private emailInput: HTMLInputElement | null;
  private passwordInput: HTMLInputElement | null;
  private confirmPasswordInput: HTMLInputElement | null;
  private submitButton: HTMLButtonElement | null;
  private errorMessage: HTMLElement | null;
  private form: HTMLFormElement | null;

  constructor() {
    this.usernameInput = document.getElementById(
      "username"
    ) as HTMLInputElement | null;
    this.emailInput = document.getElementById(
      "email"
    ) as HTMLInputElement | null;
    this.passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement | null;
    this.confirmPasswordInput = document.getElementById(
      "confirmPassword"
    ) as HTMLInputElement | null;
    this.submitButton = document.querySelector(
      "button[type='submit']"
    ) as HTMLButtonElement | null;
    this.errorMessage = document.getElementById(
      "errorMessage"
    ) as HTMLElement | null;
    this.form = document.querySelector("form") as HTMLFormElement | null;

    this.init();
  }

  /**
   * Initialize the controller
   */
  private async init(): Promise<void> {
    console.log("RegisterController: init started");
    console.log("Form found:", this.form);
    console.log("Username input found:", this.usernameInput);
    console.log("Email input found:", this.emailInput);
    console.log("Password input found:", this.passwordInput);
    console.log("Confirm password input found:", this.confirmPasswordInput);
    console.log("Error message div found:", this.errorMessage);

    // Initialize default user in localStorage
    await StorageService.initializeDefaultUser();

    // Attach event listeners
    if (this.form) {
      this.form.addEventListener("submit", (e) => {
        console.log("Register form submit event triggered");
        this.handleSubmit(e);
      });
      console.log("Register form listener attached successfully");
    } else {
      console.error("Form not found - form is null!");
    }
  }

  /**
   * Handles form submission
   */
  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    console.log("Register form submitted");

    if (
      !this.usernameInput ||
      !this.emailInput ||
      !this.passwordInput ||
      !this.confirmPasswordInput
    ) {
      console.error("Input elements not found");
      return;
    }

    const username = this.usernameInput.value.trim();
    const email = this.emailInput.value.trim();
    const password = this.passwordInput.value;
    const confirmPassword = this.confirmPasswordInput.value;

    // Validate passwords match
    if (password !== confirmPassword) {
      this.showError("Passwords do not match");
      return;
    }

    // Validate email format
    if (!User.isValidEmail(email)) {
      this.showError("Please enter a valid email address");
      return;
    }

    console.log("Attempting registration with username:", username);

    // Attempt registration
    const result = await AuthService.register(username, email, password);

    console.log("Registration result:", result);

    if (result.success) {
      // Redirect to home page
      window.location.href = "/";
    } else {
      this.showError(result.message);
      this.passwordInput.value = "";
      this.confirmPasswordInput.value = "";
    }
  }

  /**
   * Displays error message
   */
  private showError(message: string): void {
    if (this.errorMessage) {
      this.errorMessage.textContent = message;
      this.errorMessage.classList.remove("hidden");
      console.log("Error displayed:", message);
    } else {
      console.error("Error message element not found!");
    }
  }
}

// Initialize the controller immediately since script is loaded at end of body
console.log("RegisterController: Script loaded, initializing controller");
new RegisterController();
