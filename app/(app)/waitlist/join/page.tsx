import { redirect } from "next/navigation";
import { PageHead } from "@/components/restauranty-core";
import { WaitlistJoinForm } from "@/components/waitlist-join-form";
import { listDiners, listRestaurants } from "@/lib/repositories/store";
import { authLoginUrl, getSessionUser } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function WaitlistJoinPage({
  searchParams,
}: {
  searchParams: Promise<{ restaurantId?: string }>;
}) {
  const [user, search, restaurants, diners] = await Promise.all([
    getSessionUser(),
    searchParams,
    listRestaurants(),
    listDiners(),
  ]);
  if (!user) redirect(authLoginUrl("/waitlist/join"));

  const dinerProfile = diners.find(
    (d) => d.userId === user._id || d.email.toLowerCase() === user.email.toLowerCase(),
  );

  return (
    <div className="page" style={{ maxWidth: 980, margin: "0 auto" }}>
      <PageHead
        title="Join a verified waitlist"
        subtitle="Restauranty notifies you when a verified table opens up — only humans, no bots."
      />
      <WaitlistJoinForm
        restaurants={restaurants.map((r) => ({
          _id: r._id,
          name: r.name,
          neighborhood: r.neighborhood,
          cuisineCategories: r.cuisineCategories,
        }))}
        defaultRestaurantId={search.restaurantId ?? restaurants[0]?._id}
        defaultName={dinerProfile?.name ?? user.name}
        defaultEmail={dinerProfile?.email ?? user.email}
        defaultPhone={dinerProfile?.phone}
      />
    </div>
  );
}
