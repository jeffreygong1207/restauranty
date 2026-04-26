import Link from "next/link";
import { Ic, SponsorTrackCard, fmtMoney } from "@/components/restauranty-core";
import { dashboardData } from "@/lib/view-models";
import { authLoginUrl, defaultLandingForRole, getSessionUser } from "@/lib/services/session";

export const dynamic = "force-dynamic";

export default async function LandingPage() {
  const [user, data] = await Promise.all([getSessionUser(), dashboardData()]);

  const signedInTarget = user ? defaultLandingForRole(user.role) : null;
  const heroPrimary = signedInTarget ?? "/api/auth/login?returnTo=/onboarding";
  const heroPrimaryLabel = user ? `Open ${heroPrimary === "/restaurant-dashboard" ? "your dashboard" : "Restauranty"}` : "Get started";

  const atRiskRows = data.rows
    .filter((row) => row.reservation.riskScore >= 50)
    .slice(0, 4);
  const recentReservations = data.rows.slice(0, 4);
  const heroRows = (atRiskRows.length ? atRiskRows : recentReservations).map((row) => ({
    time: row.reservation.startTime,
    name: row.restaurant?.name ?? row.reservation.restaurantId,
    risk: row.reservation.riskScore,
  }));

  return (
    <div className="lp">
      <div className="nav">
        <div className="brand-mark">R</div>
        <div className="brand-name">
          Restauranty<span className="dot">.</span>
        </div>
        <div className="links">
          <Link href="#product">Product</Link>
          <Link href="#restaurants">For restaurants</Link>
          <Link href="#diners">For diners</Link>
          <Link href="/trust">Trust</Link>
        </div>
        <div className="right">
          {user ? (
            <Link className="btn ghost sm" href={signedInTarget!}>
              Open Restauranty <Ic.arrow />
            </Link>
          ) : (
            <a className="btn ghost sm" href={authLoginUrl("/onboarding")}>
              Sign in
            </a>
          )}
          <Link className="btn sm primary" href="/restaurants/search">
            Find your restaurant
          </Link>
        </div>
      </div>

      <div className="hero">
        <div>
          <span className="tag-pill">
            <span className="b-dot" style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--accent)" }} />
            Reservation operations for the no-show era
          </span>
          <h1>
            Recover at-risk reservations <em>before</em> they become empty tables.
          </h1>
          <p className="lede">
            Restauranty pairs deterministic agents with restaurant policies and verified waitlists
            to prevent no-shows and refill tables in time — without becoming a resale market.
          </p>
          <div className="ctas">
            <Link className="btn accent lg" href={heroPrimary}>
              {heroPrimaryLabel} <Ic.arrow />
            </Link>
            <Link className="btn lg" href="/restaurants/search">
              Search a restaurant
            </Link>
          </div>
          <div className="row" style={{ marginTop: 24, gap: 14, color: "var(--ink-3)", fontSize: 12.5 }}>
            <span className="row" style={{ gap: 6 }}><Ic.shield /> Restaurant-controlled policies</span>
            <span className="row" style={{ gap: 6 }}><Ic.check /> No paid scalping</span>
            <span className="row" style={{ gap: 6 }}><Ic.check /> Human verification</span>
          </div>
        </div>
        <HeroArt rows={heroRows} />
      </div>

      <div className="metric-strip">
        <div>
          <div className="v">{data.metrics.atRisk}</div>
          <div className="l">At-risk reservations tonight</div>
        </div>
        <div>
          <div className="v">{data.metrics.recoveryReadyCovers}</div>
          <div className="l">Recovery-ready covers</div>
        </div>
        <div>
          <div className="v">{fmtMoney(data.metrics.revenueAtRisk)}</div>
          <div className="l">Revenue at risk</div>
        </div>
        <div>
          <div className="v">{data.metrics.suspiciousBlocked}</div>
          <div className="l">Suspicious transfers blocked</div>
        </div>
      </div>

      <div id="product" className="feature-grid">
        <SponsorTrackCard title="Agentverse Recovery Agent" sponsor="Fetch.ai" desc="A local Chat Protocol endpoint turns manager intent into risk analysis, policy checks, and waitlist matching." />
        <SponsorTrackCard title="Atlas operational store" sponsor="MongoDB" desc="Restaurants, policies, reservations, recovery requests, agent runs, audit logs, and sponsor events persist in MongoDB when configured." />
        <SponsorTrackCard title="Proof-of-human gates" sponsor="World ID" desc="Replacement diners can be verified through World ID, with safe demo simulation when credentials are missing." />
        <SponsorTrackCard title="Augmented reliable agents" sponsor="Cognition" desc="Deterministic logic, smoke tests, audit traces, and manager approvals make agent execution inspectable." />
      </div>

      <div id="restaurants" style={{ marginTop: 64, display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 36, alignItems: "center" }}>
        <div>
          <div className="sect-title" style={{ color: "var(--accent-deep)" }}>The recovery loop</div>
          <h2 style={{ fontSize: 28, letterSpacing: "-0.025em", margin: "6px 0 14px", fontWeight: 600 }}>Seven agents. One outcome.</h2>
          <p className="lede" style={{ fontSize: 14.5 }}>
            Each agent has a narrow responsibility: risk scoring, policy enforcement, replacement
            matching, fairness review, approval routing, settlement, and explanation.
          </p>
          <Link className="btn" style={{ marginTop: 14 }} href="/agents">Meet the agents <Ic.arrow /></Link>
        </div>
        <div className="card">
          <div className="card-body" style={{ padding: 20 }}>
            <MiniFlow />
          </div>
        </div>
      </div>

      <div id="diners" style={{ marginTop: 56, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 36, alignItems: "center" }}>
        <div className="card">
          <div className="card-body col" style={{ gap: 10, fontSize: 13.5 }}>
            <h3 style={{ margin: 0 }}>For diners</h3>
            <p className="muted" style={{ margin: 0 }}>
              Free for diners — always. View your reservations, confirm or release responsibly,
              and join verified waitlists when the place you want is full.
            </p>
            <ul style={{ margin: "8px 0 0 16px", padding: 0, color: "var(--ink-2)", fontSize: 13 }}>
              <li>Confirm in one tap</li>
              <li>Release without penalty when the restaurant policy allows it</li>
              <li>Join waitlists with optional World ID verification</li>
            </ul>
          </div>
          <div className="card-foot">
            <Link className="btn primary" href={user ? "/home" : authLoginUrl("/home")}>
              Continue as a diner <Ic.arrow />
            </Link>
          </div>
        </div>
        <div className="card">
          <div className="card-body col" style={{ gap: 10, fontSize: 13.5 }}>
            <h3 style={{ margin: 0 }}>For restaurants</h3>
            <p className="muted" style={{ margin: 0 }}>
              Claim your venue from Google Places, set your reservation policy, and watch
              Restauranty triage tonight&apos;s book in real time.
            </p>
            <ul style={{ margin: "8px 0 0 16px", padding: 0, color: "var(--ink-2)", fontSize: 13 }}>
              <li>Real-time risk monitor with deterministic scoring</li>
              <li>Verified waitlist refill — no resale, no markup</li>
              <li>Audit log + manager approvals on every recovery</li>
            </ul>
          </div>
          <div className="card-foot">
            <Link
              className="btn primary"
              href={user ? "/restaurant-dashboard" : authLoginUrl("/restaurant-dashboard")}
            >
              Open restaurant dashboard <Ic.arrow />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function HeroArt({ rows }: { rows: { time: string; name: string; risk: number }[] }) {
  return (
    <div className="hero-art">
      <div className="hero-pane">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h4>At-risk tonight</h4>
          <span className="chip"><span className="live-dot" /> Live</span>
        </div>
        {rows.length === 0 && (
          <div className="muted" style={{ fontSize: 12 }}>No reservations yet — claim a restaurant to see it light up.</div>
        )}
        {rows.map((row, i) => (
          <div
            key={`${row.name}-${i}`}
            className="row"
            style={{ gap: 10, padding: "7px 0", borderTop: i ? "1px solid var(--line)" : "none" }}
          >
            <span className="mono" style={{ fontSize: 11.5, color: "var(--ink-3)", width: 38 }}>{row.time}</span>
            <span style={{ fontSize: 12.5, fontWeight: 500, flex: 1 }}>{row.name}</span>
            <span className="risk-pill">{row.risk}</span>
          </div>
        ))}
      </div>
      <div className="hero-pane">
        <div className="row" style={{ justifyContent: "space-between" }}>
          <h4>Agent timeline</h4>
          <span className="chip">Recovery flow</span>
        </div>
        {["Risk Agent", "Policy Agent", "Confirmation", "Waitlist Agent", "Restaurant"].map((agent, i) => (
          <div key={agent} className="row" style={{ padding: "5px 0" }}>
            <span className="live-dot" style={{ background: i < 3 ? "var(--success)" : "var(--accent)" }} />
            <div>
              <div style={{ fontSize: 11.5, fontWeight: 600 }}>{agent}</div>
              <div style={{ fontSize: 11, color: "var(--ink-3)" }}>{i < 3 ? "Completed" : "Running"}</div>
            </div>
          </div>
        ))}
        <div style={{ marginTop: "auto", padding: 10, background: "var(--accent-soft)", borderRadius: 8, fontSize: 12, color: "var(--accent-deep)", display: "flex", gap: 8, alignItems: "center" }}>
          <Ic.bolt />
          <span><b>Recommend:</b> activate waitlist refill</span>
        </div>
      </div>
    </div>
  );
}

function MiniFlow() {
  const stages = ["Risk detected", "Policy checked", "Diner contacted", "Replacement matched", "Approval", "Settled"];
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 6 }}>
      {stages.map((stage, i) => (
        <div key={stage} style={{ textAlign: "center", flex: 1 }}>
          <div style={{ width: 30, height: 30, borderRadius: "50%", margin: "0 auto 6px", background: i < 3 ? "var(--success)" : i === 3 ? "var(--accent)" : "var(--bg-sunken)", color: i < 4 ? "white" : "var(--ink-4)", display: "grid", placeItems: "center", fontSize: 12, fontWeight: 600 }}>{i < 3 ? "✓" : i + 1}</div>
          <div style={{ fontSize: 11, color: "var(--ink-2)", fontWeight: 500 }}>{stage}</div>
        </div>
      ))}
    </div>
  );
}
