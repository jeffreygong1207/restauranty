import { PageHead, StatusBadge, WaitlistCandidateCard } from "@/components/restauranty-core";
import { recoveryDetailData } from "@/lib/view-models";

export const dynamic = "force-dynamic";

export default async function WaitlistPage() {
  const data = await recoveryDetailData("res_katsuya_815");
  return (
    <div className="page">
      <PageHead title="Verified Waitlist" subtitle="Replacement diners ranked by party size, human verification, ETA, distance, cuisine match, and commitment." actions={<StatusBadge state="configured">World ID demo-ready</StatusBadge>} />
      {data?.rankedCandidates[0] && (
        <div className="card" style={{ marginBottom: 16, borderColor: "var(--accent)", background: "color-mix(in oklab, var(--accent-soft) 50%, var(--bg-elev))" }}>
          <div className="card-body row" style={{ gap: 14 }}>
            <div className="cand av av-1" style={{ display: "grid", placeItems: "center", width: 44, height: 44, borderRadius: 12, color: "white", fontWeight: 600 }}>MC</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: "var(--accent-deep)", textTransform: "uppercase", letterSpacing: "0.08em" }}>Recommended replacement</div>
              <div style={{ fontSize: 16, fontWeight: 600, marginTop: 2 }}>{data.diners.find((diner) => diner._id === data.rankedCandidates[0].dinerId)?.name} - priority {data.rankedCandidates[0].priorityScore}</div>
              <div className="muted" style={{ fontSize: 12.5, marginTop: 2 }}>Party of {data.rankedCandidates[0].partySize} · {data.rankedCandidates[0].distanceMiles} mi away · {data.rankedCandidates[0].arrivalEtaMinutes} min ETA</div>
            </div>
            <a className="btn accent" href={`/recovery/${data.reservation._id}`}>Approve refill</a>
          </div>
        </div>
      )}
      <div className="card">
        <div className="card-head"><h3>All candidates</h3><span className="sub">{data?.rankedCandidates.length ?? 0} matches</span></div>
        <div className="card-body col">
          {data?.rankedCandidates.map((candidate, index) => (
            <WaitlistCandidateCard key={candidate._id} candidate={candidate} diner={data.diners.find((diner) => diner._id === candidate.dinerId)} recommended={index === 0} />
          ))}
        </div>
        <div className="card-foot">
          <span>Fairness Agent blocks unverified candidates when human verification is required.</span>
        </div>
      </div>
    </div>
  );
}
