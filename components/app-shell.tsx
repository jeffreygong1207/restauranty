import { SidebarNav } from "./sidebar-nav";
import { TopNav } from "./top-nav";
import { getSessionUser } from "@/lib/services/session";
import { listRestaurantsByOwner } from "@/lib/repositories/store";

export async function AppShell({ children }: { children: React.ReactNode }) {
  const user = await getSessionUser();
  const ownedRestaurants = user ? await listRestaurantsByOwner(user._id) : [];
  const primaryRestaurant = ownedRestaurants[0] ?? null;

  const navUser = user
    ? {
        name: user.name,
        role: user.role,
        email: user.email,
        initials: user.name
          .split(" ")
          .map((part) => part[0])
          .join("")
          .slice(0, 2)
          .toUpperCase(),
      }
    : null;

  const primaryRestaurantSummary = primaryRestaurant
    ? { id: primaryRestaurant._id, name: primaryRestaurant.name }
    : null;

  return (
    <div className="app">
      <SidebarNav user={navUser} primaryRestaurant={primaryRestaurantSummary} />
      <div className="main">
        <TopNav user={navUser} primaryRestaurant={primaryRestaurantSummary} />
        {children}
      </div>
    </div>
  );
}
