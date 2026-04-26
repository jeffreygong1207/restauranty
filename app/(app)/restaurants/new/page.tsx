import Link from "next/link";
import { PageHead } from "@/components/restauranty-core";
import { RestaurantRegisterForm } from "@/components/restaurant-register-form";
import { getSessionUser } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function NewRestaurantPage() {
  const user = await getSessionUser();
  return (
    <div className="page" style={{ maxWidth: 900, margin: "0 auto" }}>
      <PageHead
        title="Register a new restaurant"
        subtitle="For venues without a Google Places listing. You can update details anytime."
        actions={
          <Link className="btn" href="/restaurants/search">
            Search Google Places instead
          </Link>
        }
      />
      <RestaurantRegisterForm signedIn={Boolean(user)} />
    </div>
  );
}
