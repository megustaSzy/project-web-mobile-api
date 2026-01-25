import { ResponseData } from "../utilities/Response";
import { authService } from "../services/authService";
import { Request, Response, NextFunction } from "express";
import { loginSchema, registerSchema } from "../schemas/authSchema";
import { logActivity } from "../utilities/activityLogger";
import { ActivityAction } from "@prisma/client";
export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.registerUser(req.body);
      return ResponseData.created(res, user);
    } catch (error) {
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    const result = loginSchema.safeParse(req.body);

    if (!result.success) {
      return ResponseData.badRequest(res, result.error.issues[0].message);
    }

    const { email, password } = result.data;

    try {
      const { user, accessToken, refreshToken } = await authService.loginUser(
        email,
        password,
      );

      await logActivity({
        userId: user.id,
        role: user.role,
        action: ActivityAction.LOGIN,
        description: `${user.role} ${user.email} Login`,
        req,
      });

      return ResponseData.ok(
        res,
        { user, accessToken, refreshToken },
        "login berhasil",
      );
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return ResponseData.unauthorized(res, "refresh token tidak ditemukan");
      }

      const newAccessToken = await authService.refreshAccessToken(refreshToken);

      return ResponseData.ok(
        res,
        { accessToken: newAccessToken },
        "token diperbarui",
      );
    } catch (error) {
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const user = (req as any).user;
      const { refreshToken } = req.body;

      // ✅ LOG AKTIVITAS DULU
      if (user) {
        await logActivity({
          userId: user.id,
          role: user.role,
          action: ActivityAction.LOGOUT,
          description: `${user.email} logout`,
          req,
        });
      }

      if (refreshToken) {
        await authService.logoutUser(refreshToken);
      }

      return ResponseData.ok(res, null, "logout berhasil");
    } catch (error) {
      next(error);
    }
  },
  async googleCallback(req: Request, res: Response, next: NextFunction) {
    try {
      const profile = (req as any).user;

      if (!profile) {
        return ResponseData.unauthorized(res, "Profil Google tidak ditemukan");
      }

      // login atau register user
      const { user, accessToken, refreshToken } =
        await authService.loginWithGoogle(profile);

      // Redirect ke frontend + bawa token
      const redirectUrl = `${process.env.FRONTEND_URL}/login?accessToken=${accessToken}&refreshToken=${refreshToken}`;

      return res.redirect(redirectUrl);
    } catch (error) {
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;

      const result = await authService.requestForgotPassword(email);

      return ResponseData.ok(res, result, "link password telah dikirim");
    } catch (error) {
      next(error);
    }
  },

  async verifyResetSession(req: Request, res: Response, next: NextFunction) {
    try {
      // fe kirim query
      const sessionToken = req.query.sessionToken as string;

      const result = await authService.verifySession(sessionToken);
      return ResponseData.ok(res, result, "token valid");
    } catch (error) {
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { sessionToken, newPassword } = req.body;

      const result = await authService.resetPassword(sessionToken, newPassword);

      return ResponseData.ok(res, result, "password berhasil direset");
    } catch (error) {
      next(error);
    }
  },
};
