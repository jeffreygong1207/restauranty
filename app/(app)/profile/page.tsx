import Link from "next/link";
import { redirect } from "next/navigation";
import { Ic, PageHead, StatusBadge } from "@/components/restauranty-core";
import { ProfileRoleForm } from "@/components/profile-role-form";
import {
  listDiners,
  listRestaurantsByOwner,
  listReservations,
} from "@/lib/repositories/store";
import {
  authLoginUrl,
  authLogoutUrl,
  getSessionUser,
  isAuth0Configured,
} from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const user = await getSessionUser();
  if (!user) redirect(authLoginUrl("/profile"));

  const [diners, ownerRestaurants, reservations] = await Promise.all([
    listDiners(),
    listRestaurantsByOwner(user._id),
    listReservations(),
  ]);

  const dinerProfile = diners.find(
    (d) => d.userId === user._id || d.email.toLowerCase() === user.email.toLowerCase(),
  );
  const myReservations = dinerProfile
    ? reservations.filter((r) => r.dinerId === dinerProfile._id)
    : [];

  return (
    <div className="page" style={{ maxWidth: 980, margin: "0 auto" }}>
      <PageHead
        title={user.name}
        subtitle={user.email}
        actions={
          <a className="btn" href={authLogoutUrl("/")}>
            Sign out
          </a>
        }
      />

      <div className="grid-cards">
        <div className="card">
          <div className="card-head">
            <h3>Account</h3>
            <StatusBadge state={user.authProvider === "auth0" ? "configured" : "warning"}>
              {user.authProvider === "auth0" ? "Auth0" : "Demo"}
            </StatusBadge>
          </div>
          <div className="card-body">
            <div className="kv">
              <span className="k">Email</span>
              <span className="v">{user.email}</span>
            </div>
            <div className="kv">
              <span className="k">Role</span>
              <span className="v">{user.role.replaceAll("_", " ")}</span>
            </div>
            <div className="kv">
              <span className="k">Sign-in provider</span>
              <span className="v">
                {user.authProvider === "auth0" ? "Auth0" : "Demo session"}
                {!isAuth0Configured() && " · Auth0 keys not set"}
              </span>
            </div>
            <div className="kv">
              <span className="k">Member since</span>
              <span className="v">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Diner profile</h3>
            {dinerProfile && (
              <StatusBadge state={dinerProfile.verifiedHuman ? "configured" : "warning"}>
                {dinerProfile.verifiedHuman ? "Human verified" : "Unverified"}
              </StatusBadge>
            )}
          </div>
          <div className="card-body">
            {dinerProfile ? (
              <>
                <div className="kv">
                  <span className="k">Name</span>
                  <span className="v">{dinerProfile.name}</span>
                </div>
                <div className="kv">
                  <span className="k">Phone</span>
                  <span className="v">{dinerProfile.phone}</span>
                </div>
                <div className="kv">
                  <span className="k">Trust score</span>
                  <span className="v">{dinerProfile.trustScore}</span>
                </div>
                <div className="kv">
                  <span className="k">Reservations</span>
                  <span className="v">
                    {myReservations.length} total · {dinerProfile.completedReservations} completed
                  </span>
                </div>
              </>
            ) : (
              <div className="muted" style={{ fontSize: 13 }}>
                You don&apos;t have a diner profile yet — book a reservation or join a waitlist to
                create one.
              </div>
            )}
          </div>
        </div>

        {ownerRestaurants.length > 0 && (
          <div className="card">
            <div className="card-head">
              <h3>Restaurants you manage</h3>
              <span className="sub">{ownerRestaurants.length}</span>
            </div>
            <div className="card-body col" style={{ gap: 8 }}>
              {ownerRestaurants.map((restaurant) => (
                <Link
                  key={restaurant._id}
                  href={`/restaurants/${restaurant._id}/dashboard`}
                  className="kv"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span className="k">{restaurant.name}</span>
                  <span className="v">
                    <StatusBadge state={restaurant.claimStatus === "verified" ? "configured" : "warning"}>
                      {restaurant.claimStatus === "verified" ? "Verified" : "Pending"}
                    </StatusBadge>
                    <Ic.arrow />
                  </span>
                </Link>
              ))}
            </div>
            <div className="card-foot">
              <Link className="btn sm" href="/restaurants/search">
                Add another via Google Places
              </Link>
            </div>
          </div>
        )}
      </div>

      <div style={{ marginTop: 14 }}>
        <ProfileRoleForm currentRole={user.role} />
      </div>
    </div>
  );
}
