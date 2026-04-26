import Link from "next/link";
import { Ic, PageHead, ReservationTable } from "@/components/restauranty-core";
import { reservationRows } from "@/lib/view-models";

export const dynamic = "force-dynamic";

export default async function ReservationsPage() {
  const rows = await reservationRows();
  return (
    <div className="page">
      <PageHead title="Reservations" subtitle="CRUD surface with risk recalculation, status changes, and recovery activation." actions={<Link className="btn primary" href="/reservations/new"><Ic.plus /> New reservation</Link>} />
      <div className="card">
        <div className="card-head"><h3>Reservation table</h3><span className="sub">Filters: all statuses</span></div>
        <ReservationTable rows={rows} />
      </div>
    </div>
  );
}
