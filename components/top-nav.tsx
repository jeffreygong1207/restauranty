"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Ic } from "./restauranty-core";
import type { UserRole } from "@/lib/types";

const labels: Record<string, string> = {
  dashboard: "Operator Overview",
  "restaurant-dashboard": "Restaurant",
  restaurants: "Restaurants",
  reservations: "Reservation Risk",
  recovery: "Recovery Flow",
  waitlist: "Waitlist",
  policies: "Restaurant Policies",
  agents: "Agent Room",
  admin: "Admin",
  integrations: "Integrations",
  settings: "Settings",
  trust: "Trust Center",
  diner: "Diner Rescue",
  dine: "Find a Table",
  home: "Diner Home",
  "my-reservations": "My Reservations",
  profile: "Profile",
  onboarding: "Onboarding",
};

type NavUser = { name: string; role: UserRole; email: string; initials: string };
type PrimaryRestaurant = { id: string; name: string };

export function TopNav({
  user,
  primaryRestaurant,
}: {
  user: NavUser | null;
  primaryRestaurant: PrimaryRestaurant | null;
}) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const key = segments[0] ?? "home";
  const label = labels[key] ?? "Restauranty";

  const crumbContext =
    user?.role === "restaurant_manager" || user?.role === "admin"
      ? primaryRestaurant?.name ?? "Restauranty operator"
      : user
        ? "Restauranty diner"
        : "Restauranty";

  return (
    <div className="topbar">
      <div className="crumbs">
        <span>{crumbContext}</span>
        <span>/</span>
        <span className="here">{label}</span>
      </div>
      <div className="spacer" />
      {user ? (
        <Link className="icon-btn" href="/profile" title="Profile">
          <span className="avatar sm">{user.initials}</span>
          <span style={{ marginLeft: 8, fontSize: 12.5 }}>{user.name.split(" ")[0]}</span>
        </Link>
      ) : (
        <Link className="btn sm primary" href="/api/auth/login?returnTo=/onboarding">
          Sign in <Ic.arrow />
        </Link>
      )}
      <button className="icon-btn" aria-label="Notifications" type="button">
        <Ic.bell />
      </button>
    </div>
  );
}
