import Link from "next/link";
import { redirect } from "next/navigation";
import { Ic, PageHead, StatusBadge } from "@/components/restauranty-core";
import { listRestaurantsByOwner } from "@/lib/repositories/store";
import { authLoginUrl } from "@/lib/services/session";
import { getSessionUser } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function RestaurantDashboardRouter() {
  const user = await getSessionUser();
  if (!user) redirect(authLoginUrl("/restaurant-dashboard"));

  if (user.role !== "restaurant_manager" && user.role !== "admin") {
    redirect("/onboarding?next=/restaurant-dashboard");
  }

  const restaurants = await listRestaurantsByOwner(user._id);

  if (restaurants.length === 0) {
    return (
      <div className="page" style={{ maxWidth: 880, margin: "0 auto" }}>
        <PageHead
          title={`Welcome, ${user.name.split(" ")[0]}`}
          subtitle="Connect your first restaurant to start protecting tonight's covers."
        />
        <div className="card">
          <div className="card-body col" style={{ gap: 14 }}>
            <h3 style={{ margin: 0 }}>You don&apos;t manage any restaurants yet</h3>
            <p className="muted" style={{ margin: 0 }}>
              Search Google Places to claim a verified listing, or register a new venue manually if
              your restaurant isn&apos;t indexed yet.
            </p>
            <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
              <Link className="btn primary" href="/restaurants/search">
                <Ic.search /> Search Google Places
              </Link>
              <Link className="btn" href="/restaurants/new">
                <Ic.plus /> Register manually
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (restaurants.length === 1) {
    redirect(`/restaurants/${restaurants[0]._id}/dashboard`);
  }

  return (
    <div className="page">
      <PageHead
        title="Your restaurants"
        subtitle={`${restaurants.length} venues linked to ${user.email}`}
        actions={
          <>
            <Link className="btn" href="/restaurants/search">
              <Ic.search /> Add via Google Places
            </Link>
            <Link className="btn primary" href="/restaurants/new">
              <Ic.plus /> Register manually
            </Link>
          </>
        }
      />
      <div className="grid-cards">
        {restaurants.map((restaurant) => (
          <Link
            key={restaurant._id}
            className="card hover"
            href={`/restaurants/${restaurant._id}/dashboard`}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div className="card-head">
              <h3 style={{ margin: 0 }}>{restaurant.name}</h3>
              <StatusBadge state={restaurant.claimStatus === "verified" ? "configured" : "warning"}>
                {restaurant.claimStatus === "verified" ? "Verified" : "Pending"}
              </StatusBadge>
            </div>
            <div className="card-body">
              <div className="muted" style={{ fontSize: 13 }}>{restaurant.address}</div>
              <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                {restaurant.cuisineCategories.slice(0, 3).join(" · ") || "—"}
              </div>
            </div>
            <div className="card-foot">
              <span className="btn sm">Open dashboard <Ic.arrow /></span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
