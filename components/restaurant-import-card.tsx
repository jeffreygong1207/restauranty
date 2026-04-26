"use client";

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
  source: string;
};

export function RestaurantImportCard() {
  const [query, setQuery] = useState("sushi");
  const [location, setLocation] = useState("Los Angeles, CA");
  const [results, setResults] = useState<Place[]>([]);
  const [warning, setWarning] = useState<string | undefined>();
  const [busy, setBusy] = useState(false);
  const [imported, setImported] = useState<string | undefined>();

  async function search() {
    setBusy(true);
    setImported(undefined);
    const res = await fetch("/api/restaurants/search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query, location }),
    });
    const data = await res.json();
    setResults(data.results ?? []);
    setWarning(data.warning);
    setBusy(false);
  }

  async function importPlace(place: Place) {
    setBusy(true);
    const res = await fetch("/api/restaurants/import", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ place }),
    });
    const data = await res.json();
    setImported(data.restaurant?.name ?? place.name);
    setBusy(false);
  }

  return (
    <div className="card">
      <div className="card-head">
        <h3>Google Places import</h3>
        <span className="sub">Server-side search, details, and persistence</span>
      </div>
      <div className="card-body">
        <div className="form-grid">
          <div className="field">
            <label>Query</label>
            <input value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className="field">
            <label>Location</label>
            <input value={location} onChange={(event) => setLocation(event.target.value)} />
          </div>
        </div>
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn accent" onClick={search} disabled={busy}>
            <Ic.search /> {busy ? "Working..." : "Search places"}
          </button>
          {warning && <StatusBadge state="missing">Fallback</StatusBadge>}
          {imported && <StatusBadge state="configured">Imported {imported}</StatusBadge>}
        </div>
        {warning && <div className="notice" style={{ marginTop: 12 }}>{warning}</div>}
        <div className="col" style={{ marginTop: 14 }}>
          {results.map((place) => (
            <div key={place.googlePlaceId} className="cand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="restaurant-img" src={place.imageUrl ?? "/window.svg"} alt="" />
              <div>
                <div className="nm">{place.name}</div>
                <div className="meta">
                  <span>{place.address}</span>
                  {place.rating && <span>{place.rating} stars</span>}
                  {place.reviewCount && <span>{place.reviewCount} reviews</span>}
                  {place.price && <span>{place.price}</span>}
                </div>
                <div className="meta">
                  <span>Google Place ID: {place.googlePlaceId}</span>
                  <span>{place.cuisineCategories.slice(0, 3).join(", ")}</span>
                </div>
              </div>
              <div className="right">
                <StatusBadge state={place.source === "google_places" ? "configured" : "missing"}>
                  {place.source === "google_places" ? "Google Places" : "Seed fallback"}
                </StatusBadge>
                <button className="btn sm" onClick={() => importPlace(place)} disabled={busy}>
                  Import
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
