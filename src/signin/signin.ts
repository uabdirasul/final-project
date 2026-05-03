import { AuthService } from "../lib/AuthService.js";
import { StorageService } from "../lib/StorageService.js";

/**
 * SignInController - Handles sign-in form logic
 */
class SignInController {
  private usernameInput: HTMLInputElement | null;
  private passwordInput: HTMLInputElement | null;
  private submitButton: HTMLButtonElement | null;
  private errorMessage: HTMLElement | null;
  private form: HTMLFormElement | null;

  constructor() {
    this.usernameInput = document.getElementById(
      "username"
    ) as HTMLInputElement | null;
    this.passwordInput = document.getElementById(
      "password"
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
    console.log("SignInController: init started");
    console.log("Form found:", this.form);
    console.log("Username input found:", this.usernameInput);
    console.log("Password input found:", this.passwordInput);
    console.log("Error message div found:", this.errorMessage);

    // Initialize default user in localStorage
    await StorageService.initializeDefaultUser();

    // Attach event listeners
    if (this.form) {
      this.form.addEventListener("submit", (e) => {
        console.log("Form submit event triggered");
        this.handleSubmit(e);
      });
      console.log("Sign-in form listener attached successfully");
    } else {
      console.error("Form not found - form is null!");
    }
  }

  /**
   * Handles form submission
   */
  private async handleSubmit(event: Event): Promise<void> {
    event.preventDefault();
    console.log("Form submitted");

    if (!this.usernameInput || !this.passwordInput) {
      console.error("Input elements not found");
      return;
    }

    const username = this.usernameInput.value.trim();
    const password = this.passwordInput.value;

    // Validate inputs
    if (!username || !password) {
      this.showError("Invalid username or password");
      return;
    }

    console.log("Attempting login with username:", username);

    // Attempt login
    const result = await AuthService.login(username, password);
    console.log("Login result:", result);

    if (result.success) {
      // Redirect to home page
      window.location.href = "/";
    } else {
      this.showError(result.message);
      if (this.passwordInput) {
        this.passwordInput.value = "";
      }
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
console.log("SignInController: Script loaded, initializing controller");
new SignInController();
