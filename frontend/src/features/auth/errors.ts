type ProviderError = {
  code?: string;
  status?: number;
};

const publicMessages = {
  invalid_input: "กรุณาตรวจสอบข้อมูลที่กรอก",
  invalid_credentials: "อีเมลหรือรหัสผ่านไม่ถูกต้อง",
  email_not_confirmed: "กรุณายืนยันอีเมลก่อนเข้าสู่ระบบ",
  account_exists: "ไม่สามารถสร้างบัญชีด้วยอีเมลนี้ได้",
  email_rate_limited: "ระบบส่งอีเมลถึงขีดจำกัด กรุณาลองใหม่ภายหลัง",
  weak_password: "รหัสผ่านยังไม่ผ่านข้อกำหนดความปลอดภัย",
  confirmation_failed: "ลิงก์ยืนยันอีเมลไม่ถูกต้องหรือหมดอายุ",
  session_required: "กรุณาเข้าสู่ระบบเพื่อดำเนินการต่อ",
  auth_failed: "ไม่สามารถดำเนินการได้ กรุณาลองใหม่",
  profile_unavailable: "ไม่สามารถโหลดข้อมูลโปรไฟล์ได้",
} as const;

export type PublicErrorCode = keyof typeof publicMessages;

export const authErrorCode = (error: ProviderError): PublicErrorCode => {
  if (error.status === 429 || error.code === "over_email_send_rate_limit") {
    return "email_rate_limited";
  }

  switch (error.code) {
    case "invalid_credentials":
      return "invalid_credentials";
    case "email_not_confirmed":
      return "email_not_confirmed";
    case "user_already_exists":
    case "email_exists":
      return "account_exists";
    case "weak_password":
      return "weak_password";
    default:
      return "auth_failed";
  }
};

export const publicErrorMessage = (value: string | undefined): string | null =>
  value && value in publicMessages
    ? publicMessages[value as PublicErrorCode]
    : null;
