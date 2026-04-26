import { IntegrationStatusCard, PageHead } from "@/components/restauranty-core";
import { integrationStatus } from "@/lib/env";

export default function IntegrationsPage() {
  const integrations = integrationStatus();
  return (
    <div className="page">
      <PageHead title="Integrations" subtitle="Configured, missing, enabled, disabled, and safe fallback state for every external service." />
      <div className="grid-3">
        {integrations.map((integration) => (
          <IntegrationStatusCard key={integration.provider} integration={integration} />
        ))}
      </div>
    </div>
  );
}
