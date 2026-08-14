import { publicErrorMessage } from "@/features/auth/errors";
import { requireVerifiedClaims } from "@/shared/lib/auth/session";
import { SiteHeader } from "@/shared/components/site-header";

export const dynamic = "force-dynamic";

type DashboardPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const claims = await requireVerifiedClaims();
  const params = await searchParams;
  const rawError = Array.isArray(params.error) ? params.error[0] : params.error;
  const error = publicErrorMessage(rawError);

  return (
    <>
      <SiteHeader authenticated />
      <main className="page-shell">
        <p className="eyebrow">Protected area</p>
        <h1>Dashboard</h1>
        {error ? <p className="message error">{error}</p> : null}
        <section className="panel">
          <h2>ยินดีต้อนรับ</h2>
          <p>{claims.email ?? "ผู้ใช้ EV-JARVIS"}</p>
          <p className="muted">
            Session นี้ผ่านการตรวจลายเซ็น JWT ฝั่งเซิร์ฟเวอร์แล้ว
          </p>
        </section>
      </main>
    </>
  );
}
