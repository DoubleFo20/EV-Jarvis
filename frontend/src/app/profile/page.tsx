import { requireVerifiedClaims } from "@/shared/lib/auth/session";
import { createClient } from "@/shared/lib/supabase/server";
import { SiteHeader } from "@/shared/components/site-header";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const claims = await requireVerifiedClaims();
  const supabase = await createClient();
  const { data: profile, error } = await supabase
    .from("user_profiles")
    .select("full_name, phone_number")
    .eq("user_id", claims.sub)
    .maybeSingle();

  return (
    <>
      <SiteHeader authenticated />
      <main className="page-shell">
        <p className="eyebrow">Protected by RLS</p>
        <h1>Profile</h1>
        {error || !profile ? (
          <p className="message error">ไม่สามารถโหลดข้อมูลโปรไฟล์ได้</p>
        ) : (
          <dl className="profile-list panel">
            <div>
              <dt>ชื่อ</dt>
              <dd>{profile.full_name ?? "ยังไม่ได้ระบุ"}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{claims.email ?? "ไม่พร้อมใช้งาน"}</dd>
            </div>
            <div>
              <dt>โทรศัพท์</dt>
              <dd>{profile.phone_number ?? "ยังไม่ได้ระบุ"}</dd>
            </div>
            <div>
              <dt>Role</dt>
              <dd>{claims.app_metadata?.role === "admin" ? "admin" : "user"}</dd>
            </div>
          </dl>
        )}
      </main>
    </>
  );
}
