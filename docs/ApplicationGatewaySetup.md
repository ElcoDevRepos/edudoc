# Application Gateway Setup for hpc-edudoc-test.net

## Overview
This document outlines the steps to set up Azure Application Gateway for routing traffic to our four applications under a single domain (hpc-edudoc-test.net) using path-based routing.

## Routing Structure
- /v4/api/* → Legacy backend
- /v4/docs/* → Legacy backend
- /v4/* → Legacy frontend
- /v5/api/* → V5 backend
- /v5/* → V5 frontend

## Setup Steps

### 1. Create Resource Group and Network
```powershell
# Note: Using existing resource group rg-test-eastus2-EduDoc
az network vnet create --name vnet-edudoc-gateway-test --resource-group rg-test-eastus2-EduDoc --location eastus2 --address-prefix 10.0.0.0/16 --subnet-name subnet-appgateway-test --subnet-prefix 10.0.0.0/24
az network public-ip create --name pip-appgateway-test --resource-group rg-test-eastus2-EduDoc --location eastus2 --allocation-method Static --sku Standard --zone 1 2 3
```

### 2. Create Application Gateway
```powershell
# Create the Application Gateway with a default rule (priority 1)
az network application-gateway create --name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --location eastus2 --vnet-name vnet-edudoc-gateway-test --subnet subnet-appgateway-test --public-ip-address pip-appgateway-test --sku Standard_v2 --capacity 2 --priority 1

# Note: The 'create' command automatically generates default components (e.g., appGatewayHttpListener, appGatewayFrontendPort, rule1, appGatewayBackendPool).
# We will create our own specific components and then remove these defaults in a later step.
```

### 3. Create Backend Pools
```powershell
# Note: We will not use the default 'appGatewayBackendPool'.
# Create specific backend pools for our services.
az network application-gateway address-pool create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name pool-legacy-frontend
az network application-gateway address-pool create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name pool-legacy-backend
az network application-gateway address-pool create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name pool-v5-frontend
az network application-gateway address-pool create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name pool-v5-backend

# Configure backend pool FQDNs
az network application-gateway address-pool update --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name pool-legacy-frontend --servers app-edudoc-frontend-test.azurewebsites.net
az network application-gateway address-pool update --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name pool-legacy-backend --servers app-edudoc-backend-test.azurewebsites.net
az network application-gateway address-pool update --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name pool-v5-frontend --servers app-edudoc-v5-frontend-test.azurewebsites.net
az network application-gateway address-pool update --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name pool-v5-backend --servers app-edudoc-v5-backend-test.azurewebsites.net
```

### 4. Configure Health Probes
```powershell
# Create health probes for all services
az network application-gateway probe create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name probe-legacy-frontend --protocol Http --host app-edudoc-frontend-test.azurewebsites.net --path / --interval 30 --timeout 30 --threshold 3
az network application-gateway probe create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name probe-legacy-backend --protocol Http --host app-edudoc-backend-test.azurewebsites.net --path /api/breck-health-check --interval 30 --timeout 30 --threshold 3
az network application-gateway probe create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name probe-v5-frontend --protocol Http --host app-edudoc-v5-frontend-test.azurewebsites.net --path / --interval 30 --timeout 30 --threshold 3
az network application-gateway probe create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name probe-v5-backend --protocol Http --host app-edudoc-v5-backend-test.azurewebsites.net --path /api/health --interval 30 --timeout 30 --threshold 3
```

### 5. Configure Listeners, SSL
```powershell
# We will use the default 'appGatewayFrontendPort' (port 80) and 'appGatewayHttpListener' created with the gateway.
# First, update the default HTTP listener to use the correct host name.
az network application-gateway http-listener update --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name appGatewayHttpListener --host-name hpc-edudoc-test.net

# Create a new frontend port for HTTPS traffic.
az network application-gateway frontend-port create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name appGatewayHttpsPort --port 443

#
# Link the Application Gateway to the certificate created via the LetsEncryptSetup.md guide.
#
# NOTE: Ensure you have already completed the LetsEncryptSetup.md guide and the certificate exists in Key Vault.
# Replace the placeholder value below with the actual name of your Key Vault.
$keyVaultName = "kv-edudoc-test-ee2be398" # e.g., kv-edudoc-test-xxxxxxxx
$secretId = (az keyvault certificate show --vault-name $keyVaultName --name hpc-edudoc-test-net --query sid --output tsv)

# Define a unique name for the SSL certificate resource on the Application Gateway
$appGatewaySslCertName = "cert-kv-hpc-edudoc-test-net"

# Create the SSL certificate resource on the gateway. This creates a reference to the certificate in Key Vault.
az network application-gateway ssl-cert create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name $appGatewaySslCertName --key-vault-secret-id $secretId

# Create a new HTTPS listener and associate it with the new Key Vault certificate resource.
az network application-gateway http-listener create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name appGatewayHttpsListener --frontend-port appGatewayHttpsPort --host-name hpc-edudoc-test.net --ssl-cert $appGatewaySslCertName

# The redirect configuration will be created after the main path-based rule is active to avoid conflicts.
```

### 6. Create Path Maps and Rules
```powershell
# Create HTTP settings
# Use --host-name-from-backend-pool to ensure the original host header is sent to the App Service backend
az network application-gateway http-settings create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name http-settings-legacy --port 80 --protocol Http --cookie-based-affinity Disabled --host-name-from-backend-pool true --probe probe-legacy-backend
az network application-gateway http-settings create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name http-settings-v5 --port 80 --protocol Http --cookie-based-affinity Disabled --host-name-from-backend-pool true --probe probe-v5-backend

# Create the main path map and its first rule (the most specific v4 rule) in a single command.
# This ensures that /v4/api/* and /v4/docs/* are evaluated before the more general /v4/* rule.
# This command also sets the default fallback rule to point to the legacy frontend.
az network application-gateway url-path-map create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name path-map-main --rule-name rule-path-v4-api --paths /v4/api/* /v4/docs/* --address-pool pool-legacy-backend --http-settings http-settings-legacy --default-address-pool pool-legacy-frontend --default-http-settings http-settings-legacy

# Add the remaining path rules to the path map, starting with the more general v4 rule.
az network application-gateway url-path-map rule create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --path-map-name path-map-main --name rule-path-v4-frontend --paths /v4/* --address-pool pool-legacy-frontend --http-settings http-settings-legacy
az network application-gateway url-path-map rule create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --path-map-name path-map-main --name rule-path-v5-api --paths /v5/api/* --address-pool pool-v5-backend --http-settings http-settings-v5
az network application-gateway url-path-map rule create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --path-map-name path-map-main --name rule-path-v5-frontend --paths /v5/* --address-pool pool-v5-frontend --http-settings http-settings-v5
```

> **Note on SPA Routing:** The default rule for this path map sends traffic from the root of the site (`/`) to the legacy frontend (`pool-legacy-frontend`). If this frontend is a Single-Page Application (SPA), it must be configured with a "base path" to handle being served from a subpath (e.g., `/v4/`). Without this, the SPA may unexpectedly rewrite the URL in the browser, removing the subpath after it loads. The recommended solution is to configure the SPA's router to be aware of its base path (e.g., `/v4/`).

### 7. Create Routing Rule
```powershell
# Create a new routing rule to direct traffic from the HTTPS listener to our path map.
# Note: Even for a PathBasedRouting rule, the CLI sometimes requires specifying the default pool 
# and settings from the path map to resolve ambiguity during creation.
az network application-gateway rule create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name rule-https-path-based --http-listener appGatewayHttpsListener --rule-type PathBasedRouting --url-path-map path-map-main --priority 100 --address-pool pool-legacy-frontend --http-settings http-settings-legacy
```

### 8. Configure Root Redirect to /v4
```powershell
# Create a redirect configuration to send traffic from the root (/) of the site to the /v4/ path.
az network application-gateway redirect-config create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name redirect-root-to-v4 --type Permanent --target-url /v4/

# Update the main path map to use this new redirect as its default action.
# This overrides the previous default of sending root traffic directly to the legacy frontend pool.
az network application-gateway url-path-map update --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name path-map-main --default-redirect-config redirect-root-to-v4
```

### 9. Configure HTTP-to-HTTPS Redirection
```powershell
# Create the redirect configuration object.
az network application-gateway redirect-config create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name redirect-http-to-https --type Permanent --target-listener appGatewayHttpsListener --include-query-string true
```

### 10. Recreate HTTP Rule for Redirection
```powershell
# The default 'rule1' is bound to a backend pool, which prevents it from being updated to use a redirect.
# The correct approach is to delete the old rule and create a new, clean one for the redirection.
# This is now safe to do because our primary path-based rule ('rule-https-path-based') is active.
az network application-gateway rule delete --name rule1 --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc

# Create a new basic rule that uses the redirect configuration.
az network application-gateway rule create --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc --name rule-http-redirect --http-listener appGatewayHttpListener --rule-type Basic --redirect-config redirect-http-to-https --priority 200
```

### 11. Clean Up Default Resources
```powershell
# Finally, remove the default resources that are no longer needed.
az network application-gateway address-pool delete --name appGatewayBackendPool --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc
az network application-gateway http-settings delete --name appGatewayBackendHttpSettings --gateway-name agw-edudoc-test --resource-group rg-test-eastus2-EduDoc
```

### 12. Get Public IP for DNS Configuration
```powershell
az network public-ip show --name pip-appgateway-test --resource-group rg-test-eastus2-EduDoc --query ipAddress --output tsv
```

## DNS Configuration
The final step is to point your domain name to the public IP address of the Application Gateway.

1.  **Copy the IP Address:** Run the command in Step 12 and copy the output IP address.
2.  **Navigate to your DNS Zone:** In the Azure Portal, go to the DNS Zone resource named `hpc-edudoc-test.net`.
3.  **Create a Record Set:**
    *   Click the **+ Record set** button at the top.
    *   **Name:** Leave this field blank to create a record for the root domain (`@`).
    *   **Type:** Select **A**.
    *   **TTL:** Leave the default of 1 Hour.
    *   **IP Address:** Paste the IP address you copied.
    *   Click **OK**.

## Final Testing
After waiting a few minutes for the DNS record to propagate, you can test the entire setup.

1.  Open a web browser and navigate to `http://hpc-edudoc-test.net`.
2.  You should be automatically redirected to `https://hpc-edudoc-test.net`.
3.  The browser should show a valid lock icon, indicating the Let's Encrypt certificate is working.
4.  The content displayed should be from the legacy frontend application, as it is the default backend for the root of the site.
5.  Test the specific paths (e.g., `/v5/api/some-endpoint`) to ensure path-based routing is working as expected.

## Final Configuration: Disable ARR Affinity
By default, Azure App Services enable a feature called ARR Affinity (also known as "sticky sessions"). This feature sets a cookie that can cause domain mismatch errors in the browser and is unnecessary for stateless applications. It is highly recommended to disable it.

1.  For **each** of the four App Services (legacy frontend, legacy backend, v5 frontend, v5 backend):
    *   Navigate to the App Service in the Azure Portal.
    *   In the left menu, under **Settings**, click on **Configuration**.
    *   Select the **General settings** tab.
    *   Set the **Session affinity** option to **Off**.
    *   Click **Save**.



