import { AuthService } from "./AuthService.js";

/**
 * AuthGuard - Protects routes and manages navigation based on authentication status
 */
export class AuthGuard {
  /**
   * Redirects to signin if not authenticated
   */
  static async protectRoute(): Promise<void> {
    const isAuthenticated = await AuthService.isAuthenticated();

    if (!isAuthenticated) {
      window.location.href = "/signin/signin.html";
    }
  }

  /**
   * Redirects to home if already authenticated (for login/register pages)
   */
  static async preventAuthenticatedAccess(): Promise<void> {
    const isAuthenticated = await AuthService.isAuthenticated();

    if (isAuthenticated) {
      window.location.href = "/";
    }
  }

  /**
   * Gets the current user and handles redirect if not authenticated
   */
  static async getCurrentUserOrRedirect(): Promise<string | null> {
    const user = await AuthService.getCurrentUser();

    if (!user) {
      window.location.href = "/signin/signin.html";
      return null;
    }

    return user;
  }
}
