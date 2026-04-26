import { redirect } from "next/navigation";
import { Ic, PageHead } from "@/components/restauranty-core";
import { OnboardingRolePicker } from "@/components/onboarding-role-picker";
import { authLoginUrl, defaultLandingForRole, getSessionUser } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const [user, search] = await Promise.all([getSessionUser(), searchParams]);
  if (!user) redirect(authLoginUrl("/onboarding"));

  return (
    <div className="page" style={{ maxWidth: 880, margin: "0 auto" }}>
      <PageHead
        title={`Welcome to Restauranty, ${user.name.split(" ")[0]}`}
        subtitle="Tell us how you'll use Restauranty so we can take you to the right place."
      />
      <div className="card flat" style={{ marginBottom: 14, background: "var(--bg-sunken)" }}>
        <div className="card-body row" style={{ gap: 12, alignItems: "center" }}>
          <Ic.shield />
          <div className="muted" style={{ fontSize: 12.5 }}>
            You can switch roles later from your profile. Restauranty never charges diners; we work
            for restaurants.
          </div>
        </div>
      </div>
      <OnboardingRolePicker
        currentRole={user.role}
        nextPath={search.next || defaultLandingForRole(user.role)}
      />
    </div>
  );
}
