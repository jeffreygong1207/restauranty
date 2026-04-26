import Link from "next/link";
import { redirect } from "next/navigation";
import { Ic, PageHead, StatusBadge } from "@/components/restauranty-core";
import { listRestaurants } from "@/lib/repositories/store";
import { authLoginUrl, getSessionUser } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function DineBrowsePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cuisine?: string }>;
}) {
  const [user, search, restaurants] = await Promise.all([
    getSessionUser(),
    searchParams,
    listRestaurants(),
  ]);
  if (!user) redirect(authLoginUrl("/dine"));

  const claimed = restaurants.filter(
    (r) => r.claimStatus === "verified" || r.claimed === true || r.source === "seed",
  );

  const q = (search.q ?? "").trim().toLowerCase();
  const cuisine = (search.cuisine ?? "").trim().toLowerCase();
  const filtered = claimed.filter((r) => {
    if (q) {
      const haystack = `${r.name} ${r.neighborhood} ${r.address} ${r.cuisineCategories.join(" ")}`.toLowerCase();
      if (!haystack.includes(q)) return false;
    }
    if (cuisine) {
      if (!r.cuisineCategories.some((c) => c.toLowerCase().includes(cuisine))) return false;
    }
    return true;
  });

  const cuisines = Array.from(
    new Set(claimed.flatMap((r) => r.cuisineCategories.map((c) => c.toLowerCase()))),
  )
    .filter((c) => c && !["high-demand", "halal", "casual"].includes(c))
    .sort()
    .slice(0, 10);

  return (
    <div className="page">
      <PageHead
        title="Find a table"
        subtitle={`${filtered.length} verified restaurants on Restauranty${q ? ` matching "${q}"` : ""}`}
        actions={
          <Link className="btn" href="/waitlist/join">
            <Ic.waitlist /> Join a waitlist instead
          </Link>
        }
      />

      <form className="card" style={{ marginBottom: 16 }}>
        <div className="card-body">
          <div className="form-grid">
            <div className="field">
              <label>Search</label>
              <input name="q" defaultValue={search.q} placeholder="e.g. ramen, Westwood, Italian" />
            </div>
            <div className="field">
              <label>Cuisine</label>
              <select name="cuisine" defaultValue={search.cuisine ?? ""}>
                <option value="">All cuisines</option>
                {cuisines.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <div className="card-foot">
          <button className="btn primary" type="submit">
            <Ic.search /> Search
          </button>
          {(q || cuisine) && (
            <Link className="btn sm" href="/dine">
              Clear
            </Link>
          )}
        </div>
      </form>

      {filtered.length === 0 && (
        <div className="empty">
          No restaurants matched your search. <Link href="/dine">Clear filters →</Link>
        </div>
      )}

      <div className="grid-3">
        {filtered.map((restaurant) => (
          <article key={restaurant._id} className="card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={restaurant.imageUrl ?? "/window.svg"}
              alt=""
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover",
                borderRadius: "var(--r-3) var(--r-3) 0 0",
                background: "var(--bg-sunken)",
              }}
            />
            <div className="card-body">
              <div className="row" style={{ justifyContent: "space-between", alignItems: "start", gap: 8 }}>
                <div style={{ minWidth: 0 }}>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{restaurant.name}</h3>
                  <p className="muted" style={{ margin: "4px 0 0", fontSize: 12.5 }}>
                    {restaurant.neighborhood} · {restaurant.price ?? "$$"}
                  </p>
                </div>
                <StatusBadge state="configured">Verified</StatusBadge>
              </div>
              <div className="muted" style={{ fontSize: 12, marginTop: 10 }}>
                {restaurant.cuisineCategories.slice(0, 3).join(" · ") || "Restaurant"}
              </div>
              {restaurant.rating && (
                <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                  ★ {restaurant.rating} ({restaurant.reviewCount ?? 0} reviews)
                </div>
              )}
            </div>
            <div className="card-foot" style={{ justifyContent: "space-between" }}>
              <Link className="btn sm" href={`/waitlist/join?restaurantId=${restaurant._id}`}>
                Join waitlist
              </Link>
              <Link className="btn sm primary" href={`/dine/${restaurant._id}`}>
                Book a table <Ic.arrow />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
