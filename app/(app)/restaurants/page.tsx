import Link from "next/link";
import { PageHead, StatusBadge } from "@/components/restauranty-core";
import { listRestaurants, listPolicies } from "@/lib/repositories/store";

export const dynamic = "force-dynamic";

export default async function RestaurantsPage() {
  const [restaurants, policies] = await Promise.all([listRestaurants(), listPolicies()]);
  return (
    <div className="page">
      <PageHead title="Restaurants" subtitle="Imported venues, source badges, policy status, and recovery readiness." actions={<Link className="btn accent" href="/restaurants/import">Import restaurant</Link>} />
      <div className="grid-3">
        {restaurants.map((restaurant) => {
          const policy = policies.find((item) => item.restaurantId === restaurant._id);
          return (
            <div className="card" key={restaurant._id}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={restaurant.imageUrl ?? "/window.svg"} alt="" style={{ width: "100%", height: 150, objectFit: "cover", borderRadius: "var(--r-3) var(--r-3) 0 0" }} />
              <div className="card-body">
                <div className="row" style={{ justifyContent: "space-between", alignItems: "start" }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: 16 }}>{restaurant.name}</h3>
                    <p className="muted" style={{ margin: "4px 0 0", fontSize: 12.5 }}>{restaurant.address}</p>
                  </div>
                  <StatusBadge state={restaurant.source === "google_places" ? "configured" : "waiting"}>{restaurant.source.replaceAll("_", " ")}</StatusBadge>
                </div>
                <div className="divider" />
                <div className="kv"><span className="k">Cuisine</span><span className="v">{restaurant.cuisineCategories.slice(0, 2).join(", ")}</span></div>
                <div className="kv"><span className="k">Rating</span><span className="v">{restaurant.rating ?? "n/a"}</span></div>
                <div className="kv"><span className="k">Policy</span><span className="v">{policy?.waitlistRefillEnabled ? "Refill enabled" : "Needs policy"}</span></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
