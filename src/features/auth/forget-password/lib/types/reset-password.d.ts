export interface ResetPasswordPayload {
  email: string;
  otp: string;
  newPassword: string;
}