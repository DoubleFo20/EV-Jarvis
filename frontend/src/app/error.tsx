"use client";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <main className="auth-shell">
      <section className="auth-card">
        <h1>เกิดข้อผิดพลาด</h1>
        <p className="muted">ระบบไม่สามารถแสดงหน้านี้ได้ในขณะนี้</p>
        <button className="button" onClick={reset} type="button">
          ลองใหม่
        </button>
      </section>
    </main>
  );
}
