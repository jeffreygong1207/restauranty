import Link from "next/link";
import { PageHead } from "@/components/restauranty-core";
import { RestaurantSearchCard } from "@/components/restaurant-search-card";
import { boolEnv, env } from "@/lib/env";
import { getSessionUser } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function RestaurantSearchPage() {
  const user = await getSessionUser();
  const apiConfigured = Boolean(env("GOOGLE_MAPS_API_KEY")) && boolEnv("ENABLE_GOOGLE_PLACES");

  return (
    <div className="page" style={{ maxWidth: 1280, margin: "0 auto" }}>
      <PageHead
        title="Search restaurants on Google Places"
        subtitle="Find your venue, then claim it to set up reservations, policies, and recovery."
        actions={
          <>
            <Link className="btn" href="/restaurants/new">Register manually</Link>
            {!user && (
              <Link className="btn primary" href={`/api/auth/login?returnTo=${encodeURIComponent("/restaurants/search")}`}>
                Sign in to claim
              </Link>
            )}
          </>
        }
      />
      {!apiConfigured && (
        <div className="notice" style={{ marginBottom: 14 }}>
          Google Places is not yet enabled. Set <code>GOOGLE_MAPS_API_KEY</code> and{" "}
          <code>ENABLE_GOOGLE_PLACES=true</code> to query the live API. You can still browse seed
          restaurants below.
        </div>
      )}
      <RestaurantSearchCard />
    </div>
  );
}
