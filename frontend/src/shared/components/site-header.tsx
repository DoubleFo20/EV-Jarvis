import Link from "next/link";

import { logoutAction } from "@/features/auth/actions";

type SiteHeaderProps = {
  authenticated?: boolean;
};

export const SiteHeader = ({ authenticated = false }: SiteHeaderProps) => (
  <header className="site-header">
    <Link className="brand" href={authenticated ? "/dashboard" : "/"}>
      EV-JARVIS
    </Link>
    <nav aria-label="เมนูหลัก">
      {authenticated ? (
        <>
          <Link href="/dashboard">Dashboard</Link>
          <Link href="/profile">Profile</Link>
          <form action={logoutAction}>
            <button className="link-button" type="submit">
              Logout
            </button>
          </form>
        </>
      ) : (
        <>
          <Link href="/login">Login</Link>
          <Link href="/register">Register</Link>
        </>
      )}
    </nav>
  </header>
);
