import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHead, StatusBadge, fmtMoney } from "@/components/restauranty-core";
import { DinerBookingForm } from "@/components/diner-booking-form";
import { getRestaurant, listDiners } from "@/lib/repositories/store";
import { authLoginUrl, getSessionUser } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function DineDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const [{ id }, user, diners] = await Promise.all([
    params,
    getSessionUser(),
    listDiners(),
  ]);
  if (!user) redirect(authLoginUrl(`/dine/${id}`));

  const restaurant = await getRestaurant(id);
  if (!restaurant) {
    return (
      <div className="page" style={{ maxWidth: 720, margin: "0 auto" }}>
        <PageHead
          title="Restaurant not found"
          subtitle="This venue isn't visible yet — it may have just been added."
          actions={
            <Link className="btn primary" href="/dine">
              Back to browse
            </Link>
          }
        />
        <div className="card">
          <div className="card-body col" style={{ gap: 10, fontSize: 13.5 }}>
            <p style={{ margin: 0 }}>
              If this restaurant was just claimed or registered, give it a moment and refresh.
            </p>
            <div className="row" style={{ gap: 8 }}>
              <Link className="btn" href={`/dine/${id}`}>
                Refresh
              </Link>
              <Link className="btn" href="/dine">
                Browse restaurants
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const dinerProfile = diners.find(
    (d) => d.userId === user._id || d.email.toLowerCase() === user.email.toLowerCase(),
  );

  return (
    <div className="page" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <PageHead
        title={restaurant.name}
        subtitle={`${restaurant.neighborhood} · ${restaurant.cuisineCategories.slice(0, 3).join(", ")}`}
        actions={
          <Link className="btn" href="/dine">
            ← Back to browse
          </Link>
        }
      />

      <div className="split">
        <div className="card">
          <div className="card-head">
            <h3>About this restaurant</h3>
            <StatusBadge state="configured">Verified on Restauranty</StatusBadge>
          </div>
          <div className="card-body">
            {restaurant.imageUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={restaurant.imageUrl}
                alt=""
                style={{
                  width: "100%",
                  height: 220,
                  objectFit: "cover",
                  borderRadius: "var(--r-3)",
                  marginBottom: 14,
                }}
              />
            )}
            <div className="kv">
              <span className="k">Address</span>
              <span className="v">{restaurant.address}</span>
            </div>
            <div className="kv">
              <span className="k">Cuisine</span>
              <span className="v">
                {restaurant.cuisineCategories.slice(0, 4).join(", ") || "—"}
              </span>
            </div>
            <div className="kv">
              <span className="k">Rating</span>
              <span className="v">
                {restaurant.rating
                  ? `★ ${restaurant.rating} (${restaurant.reviewCount ?? 0} reviews)`
                  : "Not yet rated"}
              </span>
            </div>
            <div className="kv">
              <span className="k">Price level</span>
              <span className="v">{restaurant.price ?? "$$"}</span>
            </div>
            <div className="kv">
              <span className="k">Average check</span>
              <span className="v">{fmtMoney(restaurant.averageCheck)}</span>
            </div>
            {restaurant.phone && (
              <div className="kv">
                <span className="k">Phone</span>
                <span className="v">{restaurant.phone}</span>
              </div>
            )}
          </div>
        </div>

        <div className="col" style={{ gap: 14 }}>
          <DinerBookingForm
            restaurantId={restaurant._id}
            restaurantName={restaurant.name}
            averageCheck={restaurant.averageCheck}
            defaultName={dinerProfile?.name ?? user.name}
            defaultEmail={dinerProfile?.email ?? user.email}
            defaultPhone={dinerProfile?.phone}
          />
          <div className="card flat" style={{ background: "var(--bg-sunken)" }}>
            <div className="card-body">
              <div className="sect-title">How Restauranty protects you</div>
              <ul style={{ margin: "8px 0 0 16px", padding: 0, color: "var(--ink-3)", fontSize: 12.5, lineHeight: 1.7 }}>
                <li>Free for diners — no fees, no markups, ever.</li>
                <li>If plans change, release your table from My Reservations.</li>
                <li>We refill your spot from a verified waitlist — no resale.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
