import { PageHead } from "@/components/restauranty-core";

export default function SettingsPage() {
  return (
    <div className="page">
      <PageHead title="Settings" subtitle="Operational defaults for demo auth, feature flags, and restaurant approval behavior." />
      <div className="card">
        <div className="card-body">
          <div className="notice">Runtime settings are controlled by environment variables and shown on the Integrations page. Demo role switching is available in the top bar when Auth0 is not wired into a session.</div>
        </div>
      </div>
    </div>
  );
}
