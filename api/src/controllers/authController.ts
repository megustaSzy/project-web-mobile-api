import { ResponseData } from "../utilities/Response";
import { authService } from "../services/authService";
import { Request, Response } from "express";

export const authController = {
  async register(req: Request, res: Response) {
    try {
      const user = await authService.registerUser(req.body);
      return ResponseData.created(res, user, "registrasi berhasil");
    } catch (error: any) {
      return ResponseData.badRequest(res, error.message);
    }
  },

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const { user, accessToken, refreshToken } = await authService.loginUser(
        email,
        password
      );

      return ResponseData.ok(
        res,
        { user, accessToken, refreshToken },
        "login berhasil"
      );
    } catch (error: any) {
      return ResponseData.unauthorized(res, error.message);
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return ResponseData.unauthorized(res, "refresh token tidak ditemukan");
      }

      const newAccessToken = await authService.refreshAccessToken(refreshToken);

      return ResponseData.ok(
        res,
        { accessToken: newAccessToken },
        "token diperbarui"
      );
    } catch (error: any) {
      return ResponseData.unauthorized(res, error.message);
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (refreshToken) {
        await authService.logoutUser(refreshToken);
      }

      return ResponseData.ok(res, null, "logout berhasil");
    } catch (error: any) {
      return ResponseData.serverError(res, error.message);
    }
  },

  // async googleCallback(req: Request, res: Response) {
  //   try {
  //     const profile = (req as any).user;
  //     if (!profile) {
  //       return ResponseData.unauthorized(res, "Profil Google tidak ditemukan");
  //     }

  //     const { user, accessToken, refreshToken } =
  //       await authService.loginWithGoogle(profile);

  //     return ResponseData.ok(
  //       res,
  //       { user, accessToken, refreshToken },
  //       "login google berhasil"
  //     );
  //   } catch (err: any) {
  //     return ResponseData.serverError(res, err.message);
  //   }
  // },

  async googleCallback(req: Request, res: Response) {
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
    } catch (err: any) {
      return ResponseData.serverError(res, err.message);
    }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const data = await authService.requestOtp(email);
      return ResponseData.ok(res, data, "OTP dikirim");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async verifyOtp(req: Request, res: Response) {
    try {
      const { sessionToken, otp } = req.body;

      const data = await authService.verifyOtp(sessionToken, otp);
      return ResponseData.ok(res, data, "OTP Valid");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },

  async resetPassword(req: Request, res: Response) {
    try {
      const { sessionToken, newPassword } = req.body;

      const data = await authService.resetPassword(sessionToken, newPassword);
      return ResponseData.ok(res, data, "Password berhasil diperbarui");
    } catch (error) {
      return ResponseData.serverError(res, error);
    }
  },
};
