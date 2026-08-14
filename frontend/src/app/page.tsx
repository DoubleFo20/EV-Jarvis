import Link from "next/link";

import { SiteHeader } from "@/shared/components/site-header";

export default function HomePage() {
  return (
    <>
      <SiteHeader />
      <main className="page-shell hero">
        <p className="eyebrow">EV intelligence, clearly delivered</p>
        <h1>EV-JARVIS</h1>
        <p className="lead">
          เข้าสู่ระบบเพื่อดู Dashboard และข้อมูลโปรไฟล์ที่ปกป้องด้วย session
          ฝั่งเซิร์ฟเวอร์
        </p>
        <div className="actions">
          <Link className="button" href="/login">
            Login
          </Link>
          <Link className="button secondary" href="/register">
            Register
          </Link>
        </div>
      </main>
    </>
  );
}
