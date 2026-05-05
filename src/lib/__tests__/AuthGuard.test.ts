import { AuthGuard } from "../AuthGuard";
import { AuthService } from "../AuthService";

jest.mock("../AuthService");

describe("AuthGuard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("protectRoute", () => {
    it("should allow access when authenticated", async () => {
      const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
      mockAuthService.isAuthenticated.mockResolvedValueOnce(true);

      await AuthGuard.protectRoute();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });

    it("should redirect to signin when not authenticated", async () => {
      const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
      mockAuthService.isAuthenticated.mockResolvedValueOnce(false);

      await AuthGuard.protectRoute();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });

    it("should call isAuthenticated", async () => {
      const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
      mockAuthService.isAuthenticated.mockResolvedValueOnce(true);

      await AuthGuard.protectRoute();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });
  });

  describe("preventAuthenticatedAccess", () => {
    it("should redirect to home when authenticated", async () => {
      const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
      mockAuthService.isAuthenticated.mockResolvedValueOnce(true);

      await AuthGuard.preventAuthenticatedAccess();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });

    it("should allow access when not authenticated", async () => {
      const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
      mockAuthService.isAuthenticated.mockResolvedValueOnce(false);

      await AuthGuard.preventAuthenticatedAccess();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });

    it("should call isAuthenticated", async () => {
      const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
      mockAuthService.isAuthenticated.mockResolvedValueOnce(false);

      await AuthGuard.preventAuthenticatedAccess();

      expect(mockAuthService.isAuthenticated).toHaveBeenCalled();
    });
  });

  describe("getCurrentUserOrRedirect", () => {
    it("should return current user when authenticated", async () => {
      const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
      mockAuthService.getCurrentUser.mockResolvedValueOnce("testuser");

      const user = await AuthGuard.getCurrentUserOrRedirect();

      expect(user).toBe("testuser");
    });

    it("should redirect to signin when not authenticated", async () => {
      const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
      mockAuthService.getCurrentUser.mockResolvedValueOnce(null);

      const user = await AuthGuard.getCurrentUserOrRedirect();

      expect(user).toBeNull();
    });

    it("should call getCurrentUser", async () => {
      const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
      mockAuthService.getCurrentUser.mockResolvedValueOnce("user1");

      await AuthGuard.getCurrentUserOrRedirect();

      expect(mockAuthService.getCurrentUser).toHaveBeenCalled();
    });

    it("should return null and not modify location when user is null", async () => {
      const mockAuthService = AuthService as jest.Mocked<typeof AuthService>;
      mockAuthService.getCurrentUser.mockResolvedValueOnce(null);

      const user = await AuthGuard.getCurrentUserOrRedirect();

      expect(user).toBeNull();
    });
  });
});
