"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ic } from "./restauranty-core";
import type { UserRole } from "@/lib/types";

type NavUser = { name: string; role: UserRole; email: string; initials: string };
type PrimaryRestaurant = { id: string; name: string };

const ownerItems = [
  { href: "/restaurant-dashboard", label: "Overview", icon: <Ic.overview /> },
  { href: "/reservations", label: "Risk Monitor", icon: <Ic.risk /> },
  { href: "/waitlist", label: "Waitlist", icon: <Ic.waitlist /> },
  { href: "/policies", label: "Policies", icon: <Ic.policy /> },
  { href: "/agents", label: "Agent Room", icon: <Ic.agents /> },
];

const dinerItems = [
  { href: "/home", label: "Home", icon: <Ic.overview /> },
  { href: "/dine", label: "Find a Table", icon: <Ic.search /> },
  { href: "/my-reservations", label: "My Reservations", icon: <Ic.risk /> },
  { href: "/waitlist/join", label: "Join a Waitlist", icon: <Ic.waitlist /> },
];

const adminItems = [
  { href: "/admin", label: "Admin", icon: <Ic.shield /> },
  { href: "/integrations", label: "Integrations", icon: <Ic.policy /> },
  { href: "/trust", label: "Trust Center", icon: <Ic.trust /> },
];

function isActive(pathname: string, href: string) {
  if (href === pathname) return true;
  if (href === "/") return false;
  return pathname.startsWith(href);
}

export function SidebarNav({
  user,
  primaryRestaurant,
}: {
  user: NavUser | null;
  primaryRestaurant: PrimaryRestaurant | null;
}) {
  const pathname = usePathname();
  const role = user?.role;
  const showOwner = !user || role === "restaurant_manager" || role === "admin";
  const showDiner = !user || role === "diner" || role === "replacement_diner" || role === "admin";

  return (
    <aside className="side">
      <Link className="brand" href={user ? "/" : "/"}>
        <div className="brand-mark">R</div>
        <div className="brand-name">
          Restauranty<span className="dot">.</span>
        </div>
      </Link>
      <Link
        className={`nav-item ${pathname === "/" ? "active" : ""}`}
        href="/"
      >
        <span className="ic">
          <Ic.spark />
        </span>
        Product overview
      </Link>

      {showOwner && (
        <>
          <div className="nav-group-label">Restaurant</div>
          {ownerItems.map((item) => (
            <Link
              key={item.href}
              className={`nav-item ${isActive(pathname, item.href) ? "active" : ""}`}
              href={item.href}
            >
              <span className="ic">{item.icon}</span>
              {item.label}
            </Link>
          ))}
          {primaryRestaurant && (
            <Link
              className={`nav-item ${pathname.startsWith(`/restaurants/${primaryRestaurant.id}`) ? "active" : ""}`}
              href={`/restaurants/${primaryRestaurant.id}/dashboard`}
              style={{ fontSize: 12.5 }}
            >
              <span className="ic">
                <Ic.diner />
              </span>
              {primaryRestaurant.name}
            </Link>
          )}
        </>
      )}

      {showDiner && (
        <>
          <div className="nav-group-label">Diner</div>
          {dinerItems.map((item) => (
            <Link
              key={item.href}
              className={`nav-item ${isActive(pathname, item.href) ? "active" : ""}`}
              href={item.href}
            >
              <span className="ic">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </>
      )}

      {role === "admin" && (
        <>
          <div className="nav-group-label">Admin</div>
          {adminItems.map((item) => (
            <Link
              key={item.href}
              className={`nav-item ${isActive(pathname, item.href) ? "active" : ""}`}
              href={item.href}
            >
              <span className="ic">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </>
      )}

      <div className="side-foot">
        {user ? (
          <Link href="/profile" style={{ display: "flex", alignItems: "center", gap: 10, color: "inherit", textDecoration: "none" }}>
            <div className="avatar">{user.initials}</div>
            <div className="who">
              <div className="n">{user.name}</div>
              <div className="r">
                {primaryRestaurant && (role === "restaurant_manager" || role === "admin")
                  ? `${primaryRestaurant.name} · ${role.replaceAll("_", " ")}`
                  : role?.replaceAll("_", " ")}
              </div>
            </div>
          </Link>
        ) : (
          <Link className="btn sm primary" href="/api/auth/login?returnTo=/onboarding">
            Sign in <Ic.arrow />
          </Link>
        )}
      </div>
    </aside>
  );
}
