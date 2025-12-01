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

      const { user, accessToken, refreshToken } =
        await authService.loginUser(email, password);

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return ResponseData.ok(res, { user, accessToken, refreshToken }, "login berhasil");

    } catch (error: any) {
      return ResponseData.unauthorized(res, error.message);
    }
  },

  async refreshToken(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      if (!token) return ResponseData.unauthorized(res, "refresh token tidak ditemukan");

      const newAccessToken = await authService.refreshAccessToken(token);

      res.cookie("accessToken", newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000
      });

      return ResponseData.ok(res, null, "token diperbarui");

    } catch (error: any) {
      return ResponseData.unauthorized(res, error.message);
    }
  },

  async logout(req: Request, res: Response) {
    try {
      const token = req.cookies.refreshToken;
      if (token) await authService.logoutUser(token);

      res.clearCookie("accessToken");
      res.clearCookie("refreshToken");

      return ResponseData.ok(res, null, "logout berhasil");

    } catch (error: any) {
      return ResponseData.serverError(res, error);
    }
  },

  async googleCallback(req: Request, res: Response) {
  try {
    const profile = (req as any).user;

    if (!profile) {
      return ResponseData.unauthorized(res, "Profil Google tidak ditemukan");
    }

    const { user, accessToken, refreshToken } =
      await authService.loginWithGoogle(profile);

    // Simpan token ke cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 1000 // 1 jam
    });

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 hari
    });

    // Kembalikan JSON karena belum ada frontend
    return ResponseData.ok(
      
      res,{user, accessToken, refreshToken}, "login google berhasil");

  } catch (err: any) {
    return ResponseData.serverError(res, err.message);
  }
  },

  async forgotPassword(req: Request, res: Response) {
    try {
      const message = await authService.requestOtp(req.body.email);
      return ResponseData.ok(res, message, "OTP dikirim")
    } catch (error) {
      return ResponseData.serverError(res, error)
    }
  },

  async verifyOtp(req: Request, res: Response) {
    try {
      const { email, otp } = req.body
    } catch (error) {
      
    }
  }

// async googleCallback(req: Request, res: Response) {
//   try {
//     const profile = (req as any).user;

//     if (!profile) {
//       return ResponseData.unauthorized(res, "Profil Google tidak ditemukan");
//     }

//     const { user, accessToken, refreshToken } =
//       await authService.loginWithGoogle(profile);

//     // set cookie
//     res.cookie("accessToken", accessToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//       maxAge: 60 * 60 * 1000 
//     });

//     res.cookie("refreshToken", refreshToken, {
//       httpOnly: true,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "strict",
//       maxAge: 7 * 24 * 60 * 60 * 1000 
//     });

//     // ⬅️ redirect ke frontend, token tetap dikirim via cookie
//     return res.redirect(`${process.env.FRONTEND_URL}/dashboard`);

//   } catch (err: any) {
//     return ResponseData.serverError(res, err.message);
//   }
// }


};
