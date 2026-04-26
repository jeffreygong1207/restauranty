import { ReservationForm } from "@/components/reservation-form";
import { PageHead } from "@/components/restauranty-core";
import { listDiners, listRestaurants } from "@/lib/repositories/store";

export const dynamic = "force-dynamic";

export default async function NewReservationPage() {
  const [restaurants, diners] = await Promise.all([listRestaurants(), listDiners()]);
  return (
    <div className="page">
      <PageHead title="Create Reservation" subtitle="Create or select diner, persist to MongoDB when configured, and recalculate risk deterministically." />
      <ReservationForm restaurants={restaurants} diners={diners} />
    </div>
  );
}
