import { redirect } from "next/navigation";
import { Ic, PageHead } from "@/components/restauranty-core";
import { OnboardingRolePicker } from "@/components/onboarding-role-picker";
import {
  authLoginUrl,
  defaultLandingForRole,
  getSession,
  getSessionUser,
  setSession,
  updateUserRole,
} from "@/lib/services/session";
import type { UserRole } from "@/lib/types";

export const dynamic = "force-dynamic";

function intentToRole(intent?: string): UserRole | null {
  if (!intent) return null;
  if (intent === "diner") return "diner";
  if (intent === "owner" || intent === "manager" || intent === "restaurant") return "restaurant_manager";
  return null;
}

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; intent?: string }>;
}) {
  const [user, search] = await Promise.all([getSessionUser(), searchParams]);
  if (!user) redirect(authLoginUrl(`/onboarding${search.intent ? `?intent=${search.intent}` : ""}`));

  const intentRole = intentToRole(search.intent);
  if (intentRole) {
    const session = await getSession();
    if (session && user.role !== intentRole) {
      await updateUserRole(user._id, intentRole);
      await setSession({ ...session, role: intentRole });
    }
    redirect(search.next || defaultLandingForRole(intentRole));
  }

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
            You can switch later from your profile. Restauranty never charges diners; we work for
            restaurants.
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
