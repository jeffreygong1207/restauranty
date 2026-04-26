import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHead, StatusBadge } from "@/components/restauranty-core";
import { RestaurantClaimForm } from "@/components/restaurant-claim-form";
import { getPlaceDetails } from "@/lib/services/googlePlaces";
import { getRestaurantByPlaceId } from "@/lib/repositories/store";
import { getSessionUser } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function ClaimPage({
  params,
}: {
  params: Promise<{ placeId: string }>;
}) {
  const { placeId: rawPlaceId } = await params;
  const placeId = decodeURIComponent(rawPlaceId);
  const [details, existing, user] = await Promise.all([
    getPlaceDetails(placeId),
    getRestaurantByPlaceId(placeId),
    getSessionUser(),
  ]);
  if (!details.result && !existing) notFound();
  const place = details.result;
  const claimedByOther = existing?.ownerUserId && existing.ownerUserId !== user?._id;

  return (
    <div className="page" style={{ maxWidth: 1100, margin: "0 auto" }}>
      <PageHead
        title={place?.name ?? existing?.name ?? "Restaurant details"}
        subtitle={place?.address ?? existing?.address ?? ""}
        actions={
          <Link className="btn" href="/restaurants/search">
            Back to search
          </Link>
        }
      />

      {details.warning && <div className="notice" style={{ marginBottom: 14 }}>{details.warning}</div>}

      <div className="split">
        <div className="card">
          <div className="card-head">
            <h3>About this restaurant</h3>
            {place && (
              <StatusBadge state={place.businessStatus === "OPERATIONAL" ? "configured" : "warning"}>
                {place.businessStatus ?? "Unknown"}
              </StatusBadge>
            )}
          </div>
          <div className="card-body">
            {place?.imageUrl && (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={place.imageUrl}
                alt=""
                style={{ width: "100%", height: 220, objectFit: "cover", borderRadius: "var(--r-3)", marginBottom: 14 }}
              />
            )}
            <div className="kv">
              <span className="k">Address</span>
              <span className="v">{place?.address ?? existing?.address}</span>
            </div>
            <div className="kv">
              <span className="k">Phone</span>
              <span className="v">{place?.phone ?? existing?.phone ?? "—"}</span>
            </div>
            <div className="kv">
              <span className="k">Website</span>
              <span className="v">
                {place?.website ?? existing?.website ? (
                  <a href={place?.website ?? existing?.website} target="_blank" rel="noreferrer">
                    Open
                  </a>
                ) : (
                  "—"
                )}
              </span>
            </div>
            <div className="kv">
              <span className="k">Rating</span>
              <span className="v">
                {place?.rating ? `${place.rating} (${place.reviewCount ?? 0} reviews)` : existing?.rating ?? "Not yet rated"}
              </span>
            </div>
            <div className="kv">
              <span className="k">Price</span>
              <span className="v">{place?.price ?? existing?.price ?? "—"}</span>
            </div>
            <div className="kv">
              <span className="k">Cuisine</span>
              <span className="v">
                {(place?.cuisineCategories ?? existing?.cuisineCategories ?? []).slice(0, 4).join(", ") || "—"}
              </span>
            </div>
            {place?.googleMapsUri && (
              <div className="kv">
                <span className="k">Google Maps</span>
                <span className="v">
                  <a href={place.googleMapsUri} target="_blank" rel="noreferrer">View listing</a>
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="col" style={{ gap: 14 }}>
          {claimedByOther ? (
            <div className="card">
              <div className="card-body">
                <h3 style={{ margin: 0 }}>Already claimed</h3>
                <p className="muted">
                  Another Restauranty owner has claimed this listing. If this is your restaurant,
                  contact admin@restauranty.demo to dispute.
                </p>
              </div>
            </div>
          ) : (
            <RestaurantClaimForm
              placeId={placeId}
              prefillName={user?.name}
              prefillPhone={place?.phone ?? existing?.phone}
              signedIn={Boolean(user)}
            />
          )}
          <div className="card flat" style={{ background: "var(--bg-sunken)" }}>
            <div className="card-body">
              <div className="sect-title">What happens next</div>
              <ol style={{ margin: "8px 0 0 16px", padding: 0, color: "var(--ink-3)", fontSize: 12.5, lineHeight: 1.7 }}>
                <li>We persist this restaurant in MongoDB linked to your owner account.</li>
                <li>A default reservation policy is created — you can fine-tune it later.</li>
                <li>You land on the restaurant dashboard and can add reservations.</li>
                <li>Status stays <i>Pending verification</i> until a Restauranty admin approves.</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
