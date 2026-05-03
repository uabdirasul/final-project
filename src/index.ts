import { AuthService } from "./lib/AuthService.js";

/**
 * MainController - Handles the main app functionality
 */
class MainController {
  private logoutButton: HTMLButtonElement | null;
  private userDisplay: HTMLElement | null;

  constructor() {
    this.logoutButton = document.getElementById(
      "logoutBtn"
    ) as HTMLButtonElement | null;
    this.userDisplay = document.getElementById(
      "currentUser"
    ) as HTMLElement | null;

    this.init();
  }

  /**
   * Initialize the main app
   */
  private async init(): Promise<void> {
    // Get and display current user
    const currentUser = await AuthService.getCurrentUser();
    if (this.userDisplay && currentUser) {
      this.userDisplay.textContent = currentUser;
    }

    // Attach logout event listener
    if (this.logoutButton) {
      this.logoutButton.addEventListener("click", (e) => this.handleLogout(e));
    }
  }

  /**
   * Handles logout
   */
  private async handleLogout(event: Event): Promise<void> {
    event.preventDefault();

    // Clear authentication
    await AuthService.logout();

    // Redirect to signin
    window.location.href = "/signin/signin.html";
  }
}

// Initialize when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  new MainController();
});
