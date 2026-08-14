import Link from "next/link";
import { redirect } from "next/navigation";

import { registerAction } from "@/features/auth/actions";
import { publicErrorMessage } from "@/features/auth/errors";
import { getVerifiedClaims } from "@/shared/lib/auth/session";

export const dynamic = "force-dynamic";

type RegisterPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function RegisterPage({ searchParams }: RegisterPageProps) {
  if (await getVerifiedClaims()) redirect("/dashboard");

  const params = await searchParams;
  const rawError = Array.isArray(params.error) ? params.error[0] : params.error;
  const error = publicErrorMessage(rawError);

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="register-heading">
        <Link className="brand" href="/">
          EV-JARVIS
        </Link>
        <h1 id="register-heading">สร้างบัญชี</h1>
        <p className="muted">ระบบจะส่งลิงก์ยืนยันไปยังอีเมลที่ระบุ</p>
        {error ? <p className="message error">{error}</p> : null}
        <form action={registerAction} className="form-stack">
          <label>
            ชื่อ
            <input autoComplete="name" maxLength={100} name="fullName" required />
          </label>
          <label>
            Email
            <input autoComplete="email" maxLength={320} name="email" required type="email" />
          </label>
          <label>
            Password
            <input
              autoComplete="new-password"
              maxLength={128}
              minLength={8}
              name="password"
              pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,128}"
              required
              title="Use 8-128 characters with lowercase, uppercase, number, and special character"
              type="password"
            />
            <span className="muted">
              อย่างน้อย 8 ตัว พร้อมตัวพิมพ์เล็ก พิมพ์ใหญ่ ตัวเลข และสัญลักษณ์
            </span>
          </label>
          <label className="check-row">
            <input name="terms" required type="checkbox" />
            ฉันยอมรับเงื่อนไขการใช้งาน
          </label>
          <button className="button" type="submit">
            Register
          </button>
        </form>
        <p className="muted">
          มีบัญชีแล้ว? <Link href="/login">Login</Link>
        </p>
      </section>
    </main>
  );
}
