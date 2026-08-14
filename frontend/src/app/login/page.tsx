import Link from "next/link";
import { redirect } from "next/navigation";

import { loginAction } from "@/features/auth/actions";
import { publicErrorMessage } from "@/features/auth/errors";
import { safeNextPath } from "@/shared/lib/auth/redirect";
import { getVerifiedClaims } from "@/shared/lib/auth/session";

export const dynamic = "force-dynamic";

type LoginPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const first = (value: string | string[] | undefined): string | undefined =>
  Array.isArray(value) ? value[0] : value;

export default async function LoginPage({ searchParams }: LoginPageProps) {
  if (await getVerifiedClaims()) redirect("/dashboard");

  const params = await searchParams;
  const error = publicErrorMessage(first(params.error));
  const notice = first(params.notice);
  const next = safeNextPath(first(params.next));

  return (
    <main className="auth-shell">
      <section className="auth-card" aria-labelledby="login-heading">
        <Link className="brand" href="/">
          EV-JARVIS
        </Link>
        <h1 id="login-heading">เข้าสู่ระบบ</h1>
        <p className="muted">ใช้บัญชี Email/Password ของคุณ</p>
        {error ? <p className="message error">{error}</p> : null}
        {notice === "check_email" ? (
          <p className="message success">กรุณาเปิดอีเมลเพื่อยืนยันบัญชีก่อนเข้าสู่ระบบ</p>
        ) : null}
        {notice === "signed_out" ? (
          <p className="message success">ออกจากระบบเรียบร้อยแล้ว</p>
        ) : null}
        <form action={loginAction} className="form-stack">
          <input name="next" type="hidden" value={next} />
          <label>
            Email
            <input autoComplete="email" maxLength={320} name="email" required type="email" />
          </label>
          <label>
            Password
            <input
              autoComplete="current-password"
              maxLength={128}
              name="password"
              required
              type="password"
            />
          </label>
          <button className="button" type="submit">
            Login
          </button>
        </form>
        <p className="muted">
          ยังไม่มีบัญชี? <Link href="/register">Register</Link>
        </p>
      </section>
    </main>
  );
}
