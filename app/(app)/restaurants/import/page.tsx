import { RestaurantImportCard } from "@/components/restaurant-import-card";
import { PageHead } from "@/components/restauranty-core";

export const dynamic = "force-dynamic";

export default function RestaurantImportPage() {
  return (
    <div className="page">
      <PageHead title="Restaurant Import" subtitle="Search Google Places server-side, import normalized restaurant records, and create default policies." />
      <RestaurantImportCard />
    </div>
  );
}
