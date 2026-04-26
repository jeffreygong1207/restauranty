import { PolicyEditor } from "@/components/policy-editor";
import { Ic, PageHead } from "@/components/restauranty-core";
import { policyPageData } from "@/lib/view-models";

export const dynamic = "force-dynamic";

export default async function PoliciesPage() {
  const { restaurants, policies } = await policyPageData();
  const policy = policies[0];
  return (
    <div className="page">
      <PageHead title="Restaurant Policies" subtitle="Your house, your rules. Every agent operates inside these constraints." />
      <div style={{ padding: 14, marginBottom: 18, background: "var(--accent-soft)", borderRadius: 10, fontSize: 12.5, color: "var(--accent-deep)", display: "flex", gap: 10, alignItems: "center" }}>
        <Ic.shield />
        <div><b>Restauranty is restaurant-controlled by design.</b> Paid resale is disabled. Human verification is locked on for replacement diners.</div>
      </div>
      {policy && <PolicyEditor restaurants={restaurants} policy={policy} />}
    </div>
  );
}
