// src/services/authApi.ts
import axiosInstance from "./../../utils/axiosInstance";

export const authApi = {
  login: (data: { username: string; password: string; isPhone: boolean }) =>
    axiosInstance.post("/Auth/Login", data),

  confirmEmail: (id: string, token: string) =>
    axiosInstance.get(`/Auth/ConfirmEmail/${id}/${token}`),

  confirmOtp: (data: { userId: string; otp: string }) =>
    axiosInstance.post("/Auth/ConfirmOtp", data),

  resendConfirmationEmail: (data: { email: string }) =>
    axiosInstance.post("/Auth/ResendConfirmationEmail", data),

  registerFcmToken: (data: { token: string }) =>
    axiosInstance.post("/Auth/fcm-tokens", data),

  changePassword: (data: { currentPassword: string; newPassword: string }) =>
    axiosInstance.post("/Auth/change-password", data),

  forgotPassword: (data: { email: string }) =>
    axiosInstance.post("/Auth/forgot-password", data),

  resetPassword: (data: { token: string; newPassword: string }) =>
    axiosInstance.post("/Auth/reset-password", data),

  healthCheck: () => axiosInstance.get("/Auth/healthCheck"),

  testEmail: (data: { email: string }) =>
    axiosInstance.post("/Auth/TestEmail", data),
};
