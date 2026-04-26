export const designSourceFiles = [
  "restauranty design/Restauranty.html",
  "restauranty design/styles.css",
  "restauranty design/app.jsx",
  "restauranty design/core.jsx",
  "restauranty design/page-landing.jsx",
  "restauranty design/page-overview.jsx",
  "restauranty design/page-detail.jsx",
  "restauranty design/page-recovery.jsx",
  "restauranty design/page-waitlist.jsx",
  "restauranty design/page-policies.jsx",
  "restauranty design/page-agents.jsx",
  "restauranty design/page-diner.jsx",
  "restauranty design/page-trust.jsx",
  "restauranty design/tweaks-panel.jsx",
] as const;

export const designRouteMap = [
  ["page-landing.jsx", "/"],
  ["page-overview.jsx", "/dashboard"],
  ["page-detail.jsx", "/reservations/[id]"],
  ["page-recovery.jsx", "/recovery/[id]"],
  ["page-waitlist.jsx", "/waitlist"],
  ["page-policies.jsx", "/policies"],
  ["page-agents.jsx", "/agents"],
  ["page-diner.jsx", "/diner"],
  ["page-trust.jsx", "/trust and /admin"],
] as const;
