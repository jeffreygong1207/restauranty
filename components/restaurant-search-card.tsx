"use client";

import Link from "next/link";
import { useState } from "react";
import { Ic, StatusBadge } from "./restauranty-core";

type Place = {
  googlePlaceId: string;
  name: string;
  address: string;
  rating?: number;
  reviewCount?: number;
  price?: string;
  phone?: string;
  website?: string;
  imageUrl?: string;
  cuisineCategories: string[];
  businessStatus?: string;
  source: string;
};

type SearchResponse = {
  ok: boolean;
  results?: Place[];
  warning?: string;
  mode?: "google_places" | "seed_fallback";
};

export function RestaurantSearchCard({
  initialQuery = "",
  initialLocation = "Los Angeles, CA",
}: {
  initialQuery?: string;
  initialLocation?: string;
}) {
  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [cuisine, setCuisine] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [warning, setWarning] = useState<string | undefined>();
  const [mode, setMode] = useState<SearchResponse["mode"]>();
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function search(event?: React.FormEvent) {
    event?.preventDefault();
    if (!query.trim()) return;
    setBusy(true);
    setSubmitted(true);
    try {
      const res = await fetch("/api/places/search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query, location, cuisine: cuisine || undefined }),
      });
      const data: SearchResponse = await res.json();
      setResults(data.results ?? []);
      setWarning(data.warning);
      setMode(data.mode);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="col" style={{ gap: 16 }}>
      <form className="card" onSubmit={search}>
        <div className="card-head">
          <h3>Find your restaurant</h3>
          <span className="sub">Powered by Google Places</span>
        </div>
        <div className="card-body">
          <div className="form-grid">
            <div className="field">
              <label>Restaurant name</label>
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="e.g. Katsuya West Hollywood"
                required
              />
            </div>
            <div className="field">
              <label>City or address</label>
              <input
                value={location}
                onChange={(event) => setLocation(event.target.value)}
                placeholder="Los Angeles, CA"
              />
            </div>
            <div className="field">
              <label>Cuisine (optional)</label>
              <input
                value={cuisine}
                onChange={(event) => setCuisine(event.target.value)}
                placeholder="Sushi, Italian, Steakhouse…"
              />
            </div>
          </div>
        </div>
        <div className="card-foot">
          <button className="btn accent" disabled={busy || !query.trim()}>
            <Ic.search /> {busy ? "Searching…" : "Search Google Places"}
          </button>
          {mode && (
            <StatusBadge state={mode === "google_places" ? "configured" : "missing"}>
              {mode === "google_places" ? "Live Google Places" : "Seed fallback"}
            </StatusBadge>
          )}
        </div>
      </form>

      {warning && <div className="notice">{warning}</div>}

      {submitted && !busy && results.length === 0 && (
        <div className="empty">
          No restaurants matched <b>{query}</b>. Try a different query or
          <Link href="/restaurants/new" style={{ color: "var(--accent-deep)", marginLeft: 4 }}>
            register manually
          </Link>
          .
        </div>
      )}

      <div className="grid-3">
        {results.map((place) => (
          <article key={place.googlePlaceId} className="card">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={place.imageUrl ?? "/window.svg"}
              alt=""
              style={{ width: "100%", height: 160, objectFit: "cover", borderRadius: "var(--r-3) var(--r-3) 0 0", background: "var(--bg-sunken)" }}
            />
            <div className="card-body">
              <div className="row" style={{ justifyContent: "space-between", alignItems: "start" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: 16 }}>{place.name}</h3>
                  <p className="muted" style={{ margin: "4px 0 0", fontSize: 12.5 }}>{place.address}</p>
                </div>
                <StatusBadge state={place.source === "google_places" ? "configured" : "missing"}>
                  {place.source === "google_places" ? "Google" : "Seed"}
                </StatusBadge>
              </div>
              <div className="kv" style={{ marginTop: 10 }}>
                <span className="k">Rating</span>
                <span className="v">{place.rating ? `${place.rating} (${place.reviewCount ?? 0})` : "Not yet rated"}</span>
              </div>
              <div className="kv">
                <span className="k">Price</span>
                <span className="v">{place.price ?? "—"}</span>
              </div>
              <div className="kv">
                <span className="k">Cuisine</span>
                <span className="v">{place.cuisineCategories.slice(0, 3).join(", ") || "—"}</span>
              </div>
              <div className="kv">
                <span className="k">Status</span>
                <span className="v">{place.businessStatus ?? "OPERATIONAL"}</span>
              </div>
            </div>
            <div className="card-foot" style={{ justifyContent: "space-between" }}>
              <Link className="btn sm" href={`/restaurants/claim/${encodeURIComponent(place.googlePlaceId)}`}>
                View details
              </Link>
              <Link className="btn sm primary" href={`/restaurants/claim/${encodeURIComponent(place.googlePlaceId)}`}>
                Claim this restaurant <Ic.arrow />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
