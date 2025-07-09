# Environment Setup Guide

This document will be populated with detailed steps for setting up a new environment as we progress through the staging environment setup.

## Environment Setup Steps

### Resource Group Creation

1. **Create a Resource Group for the Environment**
   Use the Azure CLI to create a new resource group for the environment. Set the resource group name as a variable to make this command reusable.
   ```powershell
   $resourceGroupName = "rg-<environment>-eastus2-EduDoc"
   az group create --name $resourceGroupName --location eastus2
   ```

   **Note**: Ensure you are logged into Azure CLI with an account that has sufficient permissions to create resources.

2. **Assign Contributor Role to Service Principal for CI/CD Permissions**
   Use the Azure CLI to assign the Contributor role to the service principal used in CI/CD pipelines to ensure it has the necessary permissions to manage resources within the resource group.
   ```powershell
   az role assignment create --role Contributor --assignee <service-principal-id> --scope /subscriptions/<subscription-id>/resourceGroups/$resourceGroupName
   ```

### Custom Domain Setup

1. **Access App Service Domains**
In the Azure Portal, use the search bar at the top to search for "App Service Domains". Select the "App Service Domains" service from the results.

2. **Create a New Domain**
Click on "+ Create" or "Add domain" to start the process of purchasing a new domain. Enter the desired domain name (e.g., `hpc-edudoc-<environment>.net`) in the search field to check availability. If available, follow the prompts to select the domain, agree to the terms, and provide necessary contact information for domain registration.

### Database Setup

1. **Create Azure SQL Server for the Environment**
   Use the Azure CLI to create an Azure SQL Server for the environment. Set the necessary variables for the server name and resource group.
   ```powershell
   $sqlServerName = "sql-edudoc-<environment>"
   $adminUser = "<admin-username>"
   $adminPassword = "<admin-password>"
   az sql server create --name $sqlServerName --resource-group $resourceGroupName --location eastus2 --admin-user $adminUser --admin-password $adminPassword
   ```

   **Note**: Store these credentials securely, ideally in Azure Key Vault, and avoid hardcoding them in scripts or documentation.

2. **Create Azure SQL Database for the Environment**
   Use the Azure CLI to create an Azure SQL Database within the SQL Server for the environment.
   ```powershell
   $databaseName = "edudoc.SQL"
   az sql db create --name $databaseName --resource-group $resourceGroupName --server $sqlServerName --service-objective S0
   ```

   **Note**: The `service-objective S0` specifies a basic performance tier; adjust this based on environment needs (e.g., higher tiers for staging or production).

3. **Allow Azure Services to Access the SQL Server**
   Use the Azure CLI to create a firewall rule that allows access from all Azure services to the SQL server.
   ```powershell
   az sql server firewall-rule create --resource-group $resourceGroupName --server $sqlServerName --name AllowAzureServices --start-ip-address 0.0.0.0 --end-ip-address 0.0.0.0
   ```

   **Note**: This special firewall rule with IP range 0.0.0.0 to 0.0.0.0 allows connections from any Azure service within the same Azure tenant, simplifying access for deployments and services hosted in Azure.

### App Services Setup

1. **Create App Service Plan for the Environment**
   Use the Azure CLI to create an App Service Plan for hosting the applications in the environment.
   ```powershell
   $appServicePlanName = "asp-edudoc-<environment>"
   az appservice plan create --name $appServicePlanName --resource-group $resourceGroupName --location eastus2 --sku B1
   ```

   **Note**: The `--sku B1` specifies a basic pricing tier for the App Service Plan; consider higher tiers like S1 or P1 for staging or production environments based on performance requirements.

2. **Create App Services for Legacy and V5 Applications**
   Use the Azure CLI to create separate App Services for the backend and frontend of both legacy (v4) and V5 applications.
   ```powershell
   $legacyBackendName = "app-edudoc-backend-<environment>"
   $legacyFrontendName = "app-edudoc-frontend-<environment>"
   $v5BackendName = "app-edudoc-v5-backend-<environment>"
   $v5FrontendName = "app-edudoc-v5-frontend-<environment>"
   az webapp create --name $legacyBackendName --resource-group $resourceGroupName --plan $appServicePlanName --runtime "dotnet:8"
   az webapp create --name $legacyFrontendName --resource-group $resourceGroupName --plan $appServicePlanName --runtime "NODE:20LTS"
   az webapp create --name $v5BackendName --resource-group $resourceGroupName --plan $appServicePlanName --runtime "dotnet:8"
   az webapp create --name $v5FrontendName --resource-group $resourceGroupName --plan $appServicePlanName --runtime "NODE:20LTS"
   ```

   **Note**: The `--runtime` parameter specifies the runtime stack for each App Service. `dotnet:8` is used for .NET backend applications, and `NODE:20LTS` for Angular frontend applications.

3. **Configure Environment Variables for App Services**
   Use the Azure CLI to set environment variables for the App Services to ensure the correct environment configuration is loaded and database connections are properly configured.
   ```powershell
   # Set environment variables for legacy backend
   az webapp config appsettings set --name $legacyBackendName --resource-group $resourceGroupName --settings "ASPNETCORE_ENVIRONMENT=<Environment>" "ConnectionStrings__Primary=<your-connection-string>"
   
   # Set environment variables for V5 backend
   az webapp config appsettings set --name $v5BackendName --resource-group $resourceGroupName --settings "ASPNETCORE_ENVIRONMENT=<Environment>" "ConnectionStrings__DefaultConnection=<your-connection-string>"
   ```

   **Note**: Replace `<your-staging-connection-string>` with the actual connection string for your staging database. These settings ensure that the applications run in the `Staging` environment and connect to the correct database. Store sensitive information like connection strings securely, ideally in Azure Key Vault, and reference them in the app settings if possible. These commands can be adapted for other environments (e.g., Test or Production) by changing the environment name and connection string accordingly.

### Application Gateway Setup

1. **Create Virtual Network and Subnet for Application Gateway**
   Use the Azure CLI to create a virtual network and subnet for the Application Gateway.
   ```powershell
   $vnetName = "vnet-edudoc-gateway-<environment>"
   $subnetName = "subnet-appgateway-<environment>"
   az network vnet create --name $vnetName --resource-group $resourceGroupName --location eastus2 --address-prefix 10.0.0.0/16 --subnet-name $subnetName --subnet-prefix 10.0.0.0/24
   az network public-ip create --name pip-appgateway-<environment> --resource-group $resourceGroupName --location eastus2 --allocation-method Static --sku Standard --zone 1 2 3
   ```

   **Note**: The `--address-prefix` and `--subnet-prefix` define the IP range for the virtual network and subnet. The `--allocation-method Static` and `--sku Standard` ensure a static public IP for the Application Gateway, which is necessary for DNS configuration.

2. **Create Application Gateway**
   Use the Azure CLI to create the Application Gateway for path-based routing.
   ```powershell
   $gatewayName = "agw-edudoc-<environment>"
   az network application-gateway create --name $gatewayName --resource-group $resourceGroupName --location eastus2 --vnet-name $vnetName --subnet $subnetName --public-ip-address pip-appgateway-<environment> --sku Standard_v2 --capacity 2 --priority 1
   ```

   **Note**: The `--sku Standard_v2` specifies a modern SKU for the Application Gateway with enhanced features. `--capacity 2` sets the instance count for scalability and availability. Detailed configuration of backend pools, health probes, listeners, and routing rules will be covered in subsequent steps.

3. **Configure Backend Pools for Application Gateway**
   Use the Azure CLI to create backend pools for routing traffic to the respective App Services.
   ```powershell
   $legacyBackendPool = "pool-legacy-backend"
   $legacyFrontendPool = "pool-legacy-frontend"
   $v5BackendPool = "pool-v5-backend"
   $v5FrontendPool = "pool-v5-frontend"
   az network application-gateway address-pool create --gateway-name $gatewayName --resource-group $resourceGroupName --name $legacyBackendPool
   az network application-gateway address-pool create --gateway-name $gatewayName --resource-group $resourceGroupName --name $legacyFrontendPool
   az network application-gateway address-pool create --gateway-name $gatewayName --resource-group $resourceGroupName --name $v5BackendPool
   az network application-gateway address-pool create --gateway-name $gatewayName --resource-group $resourceGroupName --name $v5FrontendPool
   az network application-gateway address-pool update --gateway-name $gatewayName --resource-group $resourceGroupName --name $legacyBackendPool --servers "$legacyBackendName.azurewebsites.net"
   az network application-gateway address-pool update --gateway-name $gatewayName --resource-group $resourceGroupName --name $legacyFrontendPool --servers "$legacyFrontendName.azurewebsites.net"
   az network application-gateway address-pool update --gateway-name $gatewayName --resource-group $resourceGroupName --name $v5BackendPool --servers "$v5BackendName.azurewebsites.net"
   az network application-gateway address-pool update --gateway-name $gatewayName --resource-group $resourceGroupName --name $v5FrontendPool --servers "$v5FrontendName.azurewebsites.net"
   ```

   **Note**: Backend pools are created for each App Service to route traffic accordingly. The `--servers` parameter links each pool to the respective App Service's default URL.

4. **Configure Health Probes for Backend Pools**
   Use the Azure CLI to create health probes for monitoring the health of the App Services in each backend pool.
   ```powershell
   $legacyBackendProbe = "probe-legacy-backend"
   $legacyFrontendProbe = "probe-legacy-frontend"
   $v5BackendProbe = "probe-v5-backend"
   $v5FrontendProbe = "probe-v5-frontend"
   az network application-gateway probe create --gateway-name $gatewayName --resource-group $resourceGroupName --name $legacyBackendProbe --protocol Http --host "$legacyBackendName.azurewebsites.net" --path "/api/breck-health-check" --interval 30 --timeout 30 --threshold 3
   az network application-gateway probe create --gateway-name $gatewayName --resource-group $resourceGroupName --name $legacyFrontendProbe --protocol Http --host "$legacyFrontendName.azurewebsites.net" --path "/" --interval 30 --timeout 30 --threshold 3
   az network application-gateway probe create --gateway-name $gatewayName --resource-group $resourceGroupName --name $v5BackendProbe --protocol Http --host "$v5BackendName.azurewebsites.net" --path "/api/health" --interval 30 --timeout 30 --threshold 3
   az network application-gateway probe create --gateway-name $gatewayName --resource-group $resourceGroupName --name $v5FrontendProbe --protocol Http --host "$v5FrontendName.azurewebsites.net" --path "/" --interval 30 --timeout 30 --threshold 3
   ```

   **Note**: Health probes monitor the availability of the App Services by sending HTTP requests to the specified path. `--interval 30` sets the check frequency to every 30 seconds, `--timeout 30` sets the response timeout to 30 seconds, and `--threshold 3` defines the number of failed attempts before marking a backend as unhealthy.

5. **Configure HTTP Settings for Backend Pools**
   Use the Azure CLI to create HTTP settings for routing traffic to the backend pools.
   ```powershell
   $legacyHttpSettings = "http-settings-legacy"
   $v5HttpSettings = "http-settings-v5"
   $legacyFrontendHttpSettings = "http-settings-legacy-frontend"
   $v5FrontendHttpSettings = "http-settings-v5-frontend"
   az network application-gateway http-settings create --gateway-name $gatewayName --resource-group $resourceGroupName --name $legacyHttpSettings --port 80 --protocol Http --cookie-based-affinity Disabled --host-name-from-backend-pool true --probe $legacyBackendProbe --timeout 60
   az network application-gateway http-settings create --gateway-name $gatewayName --resource-group $resourceGroupName --name $v5HttpSettings --port 80 --protocol Http --cookie-based-affinity Disabled --host-name-from-backend-pool true --probe $v5BackendProbe --timeout 60
   az network application-gateway http-settings create --gateway-name $gatewayName --resource-group $resourceGroupName --name $legacyFrontendHttpSettings --port 80 --protocol Http --cookie-based-affinity Disabled --host-name-from-backend-pool true --probe $legacyFrontendProbe --timeout 60
   az network application-gateway http-settings create --gateway-name $gatewayName --resource-group $resourceGroupName --name $v5FrontendHttpSettings --port 80 --protocol Http --cookie-based-affinity Disabled --host-name-from-backend-pool true --probe $v5FrontendProbe --timeout 60
   ```

   **Note**: HTTP settings define how traffic is routed to the backend pools. `--port 80` and `--protocol Http` specify the communication protocol and port. `--cookie-based-affinity Disabled` ensures stateless routing, and `--host-name-from-backend-pool true` sends the original host header to the backend. Separate HTTP settings are created for frontend and backend to ensure independent health monitoring.

6. **Set Up SSL Certificate with Let's Encrypt for Application Gateway**
   Before configuring listeners and SSL, set up an auto-renewing SSL certificate using Let's Encrypt for secure traffic. This involves creating a Key Vault, setting up a managed identity, deploying an ACME bot for automation, configuring DNS provider permissions, enabling authentication for the bot, and generating the certificate.

   **Phase 1: Create Core Resources (Key Vault & Managed Identity)**
   First, create a Key Vault to store the certificate and a User-Assigned Managed Identity to grant the Application Gateway secure access to it.
   ```powershell
   $keyVaultName = "kv-edudoc-<environment>"
   $identityName = "id-appgateway-<environment>"
   az keyvault create --name $keyVaultName --resource-group $resourceGroupName --location eastus2 --enable-rbac-authorization false
   az identity create --name $identityName --resource-group $resourceGroupName --location eastus2
   ```

   **Phase 2: Configure Access and Permissions**
   Assign the new identity to the Application Gateway and grant it permission to read secrets from the Key Vault.
   ```powershell
   $identityId = (az identity show --name $identityName --resource-group $resourceGroupName --query id --output tsv)
   $gatewayId = (az network application-gateway show --name $gatewayName --resource-group $resourceGroupName --query id --output tsv)
   $identityPrincipalId = (az identity show --name $identityName --resource-group $resourceGroupName --query principalId --output tsv)
   az network application-gateway identity assign --gateway-name $gatewayName --resource-group $resourceGroupName --identity $identityId
   az keyvault set-policy --name $keyVaultName --resource-group $resourceGroupName --object-id $identityPrincipalId --secret-permissions get list
   ```

   **Phase 3: Deploy the Automation Service (ACME Bot)**
   Deploy a pre-built, community-trusted Azure Function for certificate automation.
   - Go to the `keyvault-acmebot` GitHub repository: [https://github.com/shibayan/keyvault-acmebot](https://github.com/shibayan/keyvault-acmebot)
   - Click the "Deploy to Azure" button in the project's `README.md` file.
   - In the Azure Portal Custom Deployment screen, fill in the required fields:
     - **Resource group**: Select the existing `$resourceGroupName` group.
     - **App Name Prefix**: Enter a unique name prefix, e.g., `<environment>-acmebot`. The Function App created will have a name like `func-<environment>-acmebot-<suffix>`.
     - **Mail Address**: Enter your email address for Let's Encrypt notifications.
     - **Create With Key Vault**: Change this from `true` to **`false`** to use the existing Key Vault.
     - **Key Vault Base Url**: Provide the URI of the Key Vault created in Phase 1. Get it with:
       ```powershell
       az keyvault show --name $keyVaultName --resource-group $resourceGroupName --query properties.vaultUri --output tsv
       ```
   - Click "Review + create" and then "Create". This will take a few minutes to deploy.

   **Phase 3.1: Enable Function App Authentication and Obtain Admin Consent**
   Protect the ACME bot dashboard with Azure AD authentication and ensure admin consent is granted for the app registration.
   - Navigate to your Function App (`$functionAppName`) in the Azure Portal.
   - Under "Settings", click on "Authentication".
   - Click "Add identity provider", select "Microsoft", leave default settings (including Client secret expiration), ensure "Require authentication" is selected, and click "Add".
   - **Note for Admin Consent**: When you configure authentication, Azure automatically creates an app registration in Azure Active Directory. In many organizations, company policy requires an administrator's consent before any new application can be granted permissions, even for basic sign-in and profile reading. If you encounter a "Need admin approval" error when trying to access the dashboard later, follow these steps:
     - **Request Admin Consent**: Contact an Azure AD administrator for your tenant to grant consent for the app registration associated with your Function App.
     - **Locate the App Registration**: The administrator can find the app registration in the Azure Portal under **Azure Active Directory** > **Enterprise Applications**. Search for an application with a name similar to your Function App (e.g., `func-stage-acmebot-dbii`).
     - **Grant Consent**: On the app registration page, under the **Permissions** tab, the administrator should click **Grant admin consent for [Your Organization]**. This will allow the application to sign in users and read their profiles, which is necessary for accessing the dashboard.

   **Note**: If you are not an Azure AD administrator, you will need to coordinate with one to complete this step.

   **Phase 3.2: Grant Key Vault Permissions to the Bot**
   After deployment and setting up authentication, give the new Function App permission to write certificates to the Key Vault.
   ```powershell
   $functionAppName = "func-<environment>-acmebot-<suffix>"
   $functionPrincipalId = (az functionapp identity show --name $functionAppName --resource-group $resourceGroupName --query principalId --output tsv)
   az keyvault set-policy --name $keyVaultName --resource-group $resourceGroupName --object-id $functionPrincipalId --certificate-permissions create delete get import list update --secret-permissions set
   ```

   **Phase 3.3: Assign Managed Identities to Backend App Services for Key Vault Access**
   Use the Azure CLI to assign system-assigned managed identities to the backend App Services. This is necessary for the backend applications to securely access Key Vault for secrets and configurations.
   ```powershell
   az webapp identity assign --name $legacyBackendName --resource-group $resourceGroupName --role system
   az webapp identity assign --name $v5BackendName --resource-group $resourceGroupName --role system
   ```

   **Note**: System-assigned managed identities are automatically managed by Azure and tied to the lifecycle of the App Service. This allows secure access to resources like Key Vault without managing credentials manually. Frontend App Services typically do not require Key Vault access for secrets, so they are excluded.

   **Phase 3.4: Set Key Vault Access Policies for Backend App Services**
   After assigning managed identities, grant the necessary permissions to these identities to access the Key Vault. Replace `<principalId>` with the `principalId` of each backend App Service's managed identity, which can be retrieved using `az webapp identity show`.
   ```powershell
   $legacyBackendPrincipalId = (az webapp identity show --name $legacyBackendName --resource-group $resourceGroupName --query principalId --output tsv)
   $v5BackendPrincipalId = (az webapp identity show --name $v5BackendName --resource-group $resourceGroupName --query principalId --output tsv)
   az keyvault set-policy --name $keyVaultName --resource-group $resourceGroupName --object-id $legacyBackendPrincipalId --secret-permissions get list
   az keyvault set-policy --name $keyVaultName --resource-group $resourceGroupName --object-id $v5BackendPrincipalId --secret-permissions get list
   ```

   **Note**: The permissions `get` and `list` allow the backend App Services to retrieve secrets from Key Vault. Ensure the `$keyVaultName` variable matches the Key Vault created for the environment (e.g., `kv-edudoc-<environment>`). If additional permissions are needed (e.g., for certificates or keys), adjust the `--secret-permissions` parameter accordingly.

   **Phase 3.5: Generate and Store JWT Key for Backend Authentication in Key Vault**
   Generate a secure random key for JWT (JSON Web Token) authentication and store it in the Key Vault for use by the backend applications. This key is critical for signing and validating tokens in the environment.
   ```powershell
   $randomBytes = New-Object byte[] 64
   [System.Security.Cryptography.RandomNumberGenerator]::Create().GetBytes($randomBytes)
   $jwtKey = [Convert]::ToBase64String($randomBytes)
   az keyvault secret set --vault-name $keyVaultName --name "jwtSettings--JWTKey" --value $jwtKey
   ```

   **Phase 3.6: Tag Resources Created by Let's Encrypt Deployment**
   After deploying the ACME bot, tag all related resources to identify them as part of the Let's Encrypt setup for the environment. This helps in resource management and tracking.
   - Identify the resources created during the deployment. These typically include:
     - Function App (e.g., `func-staging-acmebot-dbii`)
     - App Service Plan (e.g., `plan-stage-acmebot-dbii`)
     - Storage Account (e.g., `stdbiiszqmxz2vufunc` or similar)
     - Application Insights (e.g., `appi-stage-acmebot-dbii`)
     - Log Analytics Workspace (e.g., `log-stage-acmebot-dbii`)
   - Apply a custom tag to these resources using the Azure CLI.
     ```powershell
     $tagKey = "Purpose"
     $tagValue = "LetsEncryptBot<Environment>"
     az resource tag --tags "$tagKey=$tagValue" --resource-group $resourceGroupName --name $functionAppName --resource-type Microsoft.Web/sites
     az resource tag --tags "$tagKey=$tagValue" --resource-group $resourceGroupName --name plan-stage-acmebot-dbii --resource-type Microsoft.Web/serverfarms
     az resource tag --tags "$tagKey=$tagValue" --resource-group $resourceGroupName --name stdbiiszqmxz2vufunc --resource-type Microsoft.Storage/storageAccounts
     az resource tag --tags "$tagKey=$tagValue" --resource-group $resourceGroupName --name appi-stage-acmebot-dbii --resource-type Microsoft.Insights/components
     az resource tag --tags "$tagKey=$tagValue" --resource-group $resourceGroupName --name log-stage-acmebot-dbii --resource-type Microsoft.OperationalInsights/workspaces
     ```

   **Note**: The resource names (e.g., `stdbiiszqmxz2vufunc`) may vary based on the deployment; ensure you use the correct names as shown in the Azure Portal or via `az resource list --resource-group $resourceGroupName`. Tagging helps in filtering and managing resources associated with the Let's Encrypt setup for the staging environment.

   **Phase 4: Configure DNS Provider**
   The ACME bot needs to create a temporary TXT record in your domain's DNS zone to prove ownership to Let's Encrypt. This guide assumes you are using Azure DNS.
   - **Verify Your Azure DNS Zone Exists**: Since the domain was purchased through Azure, a DNS Zone named `hpc-edudoc-staging.net` should exist in your resource group. If not, create it with:
     ```powershell
     az network dns zone create --name hpc-edudoc-<environment>.net --resource-group $resourceGroupName
     ```
        - **Important**: Ensure there are no `ReadOnly` or `CanNotDelete` resource locks on the DNS Zone (`hpc-edudoc-<environment>.net`) to allow the ACME bot to create and delete temporary records.
   - **Grant DNS Permissions to the Bot**: Assign the `DNS Zone Contributor` role to the ACME bot's managed identity.
     ```powershell
     $dnsZoneId = (az network dns zone show --name hpc-edudoc-<environment>.net --resource-group $resourceGroupName --query id --output tsv)
     az role assignment create --assignee-object-id $functionPrincipalId --assignee-principal-type ServicePrincipal --role "DNS Zone Contributor" --scope $dnsZoneId
     ```
   - **Add Application Settings**: Configure the ACME bot to use Azure DNS.
     ```powershell
     $subscriptionId = (az account show --query id --output tsv)
     az functionapp config appsettings set --name $functionAppName --resource-group $resourceGroupName --settings "Acmebot:AzureDns:SubscriptionId=$subscriptionId" "Acmebot:AzureDns:ResourceGroupName=$resourceGroupName" "Acmebot:AzureDns:ZoneName=hpc-edudoc-staging.net"
     ```

   **Phase 5: Generate the First Certificate**
   - **Access the Dashboard**: Navigate to `https://$functionAppName.azurewebsites.net/dashboard` in your browser.
   - **Log In**: Sign in with your Azure account. If you encounter a "Need admin approval" error, ensure that admin consent has been granted as described in Phase 3.1.
   - **Request Certificate**: On the dashboard, click "Add". Leave the "DNS Names" text box blank and click the blue "Add" button next to it to add your root domain (`hpc-edudoc-staging.net`). Click the green "Add" button to submit the request.
   - **Verify**: Within a few minutes, a new certificate for `hpc-edudoc-staging.net` will be generated and stored in your Key Vault. Verify this in the "Certificates" section of your Key Vault in the Azure Portal.

   **Note**: This process ensures an auto-renewing SSL certificate for `hpc-edudoc-staging.net` is stored in Azure Key Vault, ready for use by the Application Gateway.

7. **Configure Listeners and SSL for Application Gateway**
   Use the Azure CLI to configure HTTP and HTTPS listeners for the Application Gateway, and link it to the SSL certificate set up in the previous step for secure traffic.
   ```powershell
   $secretId = (az keyvault certificate show --vault-name $keyVaultName --name hpc-edudoc-staging-net --query sid --output tsv)
   $appGatewaySslCertName = "cert-kv-hpc-edudoc-staging-net"
   az network application-gateway http-listener update --gateway-name $gatewayName --resource-group $resourceGroupName --name appGatewayHttpListener --host-name hpc-edudoc-staging.net
   az network application-gateway frontend-port create --gateway-name $gatewayName --resource-group $resourceGroupName --name appGatewayHttpsPort --port 443
   az network application-gateway ssl-cert create --gateway-name $gatewayName --resource-group $resourceGroupName --name $appGatewaySslCertName --key-vault-secret-id $secretId
   az network application-gateway http-listener create --gateway-name $gatewayName --resource-group $resourceGroupName --name appGatewayHttpsListener --frontend-port appGatewayHttpsPort --host-name hpc-edudoc-staging.net --ssl-cert $appGatewaySslCertName
   ```

   **Note**: The `appGatewayHttpListener` is updated to use the correct hostname. A new HTTPS listener is created on port 443 and associated with the SSL certificate from Key Vault for secure traffic handling. Ensure that the certificate for `hpc-edudoc-staging.net` is already set up in the Key Vault as per the previous step.

8. **Configure Path-Based Routing Rules for Application Gateway**
   Use the Azure CLI to create a URL path map and define routing rules for directing traffic to the appropriate backend pools based on URL paths.
   ```powershell
   $pathMapName = "path-map-main"
   az network application-gateway url-path-map create --gateway-name $gatewayName --resource-group $resourceGroupName --name $pathMapName --rule-name rule-path-v4-api --paths /v4/api/* /v4/docs/* /v4/swagger/* --address-pool $legacyBackendPool --http-settings $legacyHttpSettings --default-address-pool $legacyFrontendPool --default-http-settings $legacyFrontendHttpSettings
   az network application-gateway url-path-map rule create --gateway-name $gatewayName --resource-group $resourceGroupName --path-map-name $pathMapName --name rule-path-v4-frontend --paths /v4/* --address-pool $legacyFrontendPool --http-settings $legacyFrontendHttpSettings
   az network application-gateway url-path-map rule create --gateway-name $gatewayName --resource-group $resourceGroupName --path-map-name $pathMapName --name rule-path-v5-api --paths /v5/api/* /v5/swagger/* --address-pool $v5BackendPool --http-settings $v5HttpSettings
   az network application-gateway url-path-map rule create --gateway-name $gatewayName --resource-group $resourceGroupName --path-map-name $pathMapName --name rule-path-v5-frontend --paths /v5/* --address-pool $v5FrontendPool --http-settings $v5FrontendHttpSettings
   ```

   **Note**: The `url-path-map create` command sets up the initial map with the most specific rule for legacy backend API paths and defaults to the legacy frontend. Subsequent `rule create` commands add rules for other paths. The order of rule creation ensures more specific paths are evaluated before general ones. Separate HTTP settings for frontend and backend ensure accurate health monitoring.

9. **Create Routing Rule for HTTPS Traffic**
   Use the Azure CLI to create a routing rule that directs HTTPS traffic to the URL path map.
   ```powershell
   $httpsRuleName = "rule-https-path-based"
   az network application-gateway rule create --gateway-name $gatewayName --resource-group $resourceGroupName --name $httpsRuleName --http-listener appGatewayHttpsListener --rule-type PathBasedRouting --url-path-map $pathMapName --priority 100 --address-pool $legacyFrontendPool --http-settings $legacyFrontendHttpSettings
   ```

   **Note**: The `--rule-type PathBasedRouting` specifies that the rule uses the URL path map for routing decisions. The `--priority 100` ensures this rule is evaluated before others if multiple rules exist.

10. **Configure HTTP-to-HTTPS Redirection**
    Use the Azure CLI to set up a redirect configuration to send HTTP traffic to HTTPS.
    ```powershell
    $redirectHttpName = "redirect-http-to-https"
    az network application-gateway redirect-config create --gateway-name $gatewayName --resource-group $resourceGroupName --name $redirectHttpName --type Permanent --target-listener appGatewayHttpsListener --include-query-string true
    az network application-gateway rule delete --name rule1 --gateway-name $gatewayName --resource-group $resourceGroupName
    $httpRuleName = "rule-http-redirect"
    az network application-gateway rule create --gateway-name $gatewayName --resource-group $resourceGroupName --name $httpRuleName --http-listener appGatewayHttpListener --rule-type Basic --redirect-config $redirectHttpName --priority 200
    ```

    **Note**: The default `rule1` is deleted as it cannot be updated to use a redirect. A new rule is created to handle HTTP-to-HTTPS redirection with a lower priority (200) than the HTTPS rule.

11. **Clean Up Default Resources in Application Gateway**
    Use the Azure CLI to remove default backend pools and HTTP settings that are no longer needed after custom configurations are in place.
    ```powershell
    az network application-gateway address-pool delete --name appGatewayBackendPool --gateway-name $gatewayName --resource-group $resourceGroupName
    az network application-gateway http-settings delete --name appGatewayBackendHttpSettings --gateway-name $gatewayName --resource-group $resourceGroupName
    ```

    **Note**: Cleaning up default resources prevents confusion and ensures only custom-configured resources are used for routing.

12. **DNS Configuration for Custom Domain**
    After setting up the Application Gateway, point your custom domain to its public IP address using Azure CLI.
    ```powershell
    $gatewayIp = (az network public-ip show --name pip-appgateway-staging --resource-group $resourceGroupName --query ipAddress --output tsv)
    az network dns record-set a create --name "@" --zone-name hpc-edudoc-staging.net --resource-group $resourceGroupName --ttl 3600
    az network dns record-set a add-record --record-set-name "@" --zone-name hpc-edudoc-staging.net --resource-group $resourceGroupName --ipv4-address $gatewayIp
    ```

    **Note**: DNS propagation may take a few minutes to hours. This step ensures your custom domain resolves to the Application Gateway's public IP. The `--name "@"` specifies the root domain. If the record set already exists, the `add-record` command will update it with the new IP address.

13. **Secure Backend App Services with Access Restrictions**
    Restrict access to App Services so they can only be reached through the Application Gateway.
    ```powershell
    $AppGatewayIp = (az network public-ip show --name pip-appgateway-staging --resource-group $resourceGroupName --query ipAddress --output tsv)
    $AppGatewayCidr = "$AppGatewayIp/32"
    az webapp config access-restriction add --resource-group $resourceGroupName --name $legacyBackendName --rule-name "Allow-AppGateway" --action Allow --ip-address $AppGatewayCidr --priority 100
    az webapp config access-restriction add --resource-group $resourceGroupName --name $legacyFrontendName --rule-name "Allow-AppGateway" --action Allow --ip-address $AppGatewayCidr --priority 100
    az webapp config access-restriction add --resource-group $resourceGroupName --name $v5BackendName --rule-name "Allow-AppGateway" --action Allow --ip-address $AppGatewayCidr --priority 100
    az webapp config access-restriction add --resource-group $resourceGroupName --name $v5FrontendName --rule-name "Allow-AppGateway" --action Allow --ip-address $AppGatewayCidr --priority 100
    ```

    **Note**: This sets an 'Allow' rule for the Application Gateway's IP, implicitly denying all other traffic with a lower priority. Repeat for all App Services to ensure they are only accessible via the gateway.

14. **Disable ARR Affinity (Session Affinity) on App Services**
    Disable ARR Affinity on all App Services to prevent domain mismatch errors in browsers. This is a separate setting from the cookie-based affinity disabled in Application Gateway HTTP settings (step 5).
    - For each App Service (`$legacyBackendName`, `$legacyFrontendName`, `$v5BackendName`, `$v5FrontendName`):
      - Navigate to the App Service in the Azure Portal.
      - Under **Settings**, click **Configuration**.
      - Select the **General settings** tab.
      - Set **Session affinity** to **Off**.
      - Click **Save**.

    **Note**: ARR Affinity can cause issues with stateless applications by setting cookies that lead to domain mismatches. Disabling it is recommended for SPA and API setups. This setting is specific to App Services and must be configured separately from Application Gateway settings.

15. **Testing of Application Gateway Setup**
    After DNS propagation, test the setup to ensure everything is configured correctly.
    - Open a browser and navigate to `http://hpc-edudoc-staging.net`.
    - Verify automatic redirection to `https://hpc-edudoc-staging.net`.
    - Check for a valid lock icon in the browser, confirming the SSL certificate is working.

16. **Set Up GitHub Actions for CI/CD in Staging Environment**
    Configure GitHub Actions workflows for automated deployment to the staging environment by referencing the structure used in the test environment workflows.
    - **Create GitHub Environment and Secrets**:
      - In your GitHub repository, navigate to **Settings** > **Environments**.
      - Add a new environment named `staging`.
      - Add secrets required for deployment:
        - `AZURE_CREDENTIALS`: JSON credentials for Azure login.
        - `AZURE_SQL_CONNECTION_STRING`: Connection string for the staging database.
        - `AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND`: Publish profile for the legacy backend App Service.
        - `AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND`: Publish profile for the legacy frontend App Service.
        - `AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND_V5`: Publish profile for the V5 backend App Service.
        - `AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND_V5`: Publish profile for the V5 frontend App Service.

    - **Create Workflow Files for Staging Deployment**:
      Reference the existing test environment workflow files in `.github/workflows/` (e.g., `database-test-deploy.yml`, `backend-test-deploy.yml`, `frontend-test-deploy.yml`, `v5-backend-test-deploy.yml`, `v5-frontend-test-deploy.yml`) and create similar files for staging with the following changes:
      - Update the file names to reflect staging (e.g., `database-staging-deploy.yml`).
      - Change the `environment` field from `test` to `staging`.
      - Update the `branches` trigger from `develop` to `staging`.
      - Modify `app-name` in deployment steps to use staging App Service names (e.g., `app-edudoc-backend-staging` instead of `app-edudoc-backend-test`).
      - Update `resource-group` in app settings configuration to `rg-staging-eastus2-EduDoc`.
      - Adjust environment settings like `ASPNETCORE_ENVIRONMENT` to `Staging` instead of `Test`.
      - For build configurations (e.g., Angular apps), ensure the `--configuration` flag uses `staging` instead of `test`.

    **Note**: Ensure that the publish profiles and connection strings are correctly set in GitHub secrets for the staging environment. For the backend deployment, include WebJobs deployment steps, mirroring the test setup in `backend-test-deploy.yml`. Use the test workflows as templates to maintain consistency in build and deployment processes.

### Logging Setup

We use Application Insights for logging and monitoring in our environments.

#### Setup Steps

1. **Create a Log Analytics Workspace**
   - Create a Log Analytics Workspace in your resource group
   - This will serve as the central repository for all logs

2. **Create an Application Insights Instance**
   - Create an Application Insights instance in your resource group
   - During creation, you will have the option to select a workspace
   - Use the Log Analytics Workspace you created in step 1

3. **Configure App Service Diagnostic Settings**
   - Navigate to your App Service
   - Go to **Monitoring** → **Diagnostic Settings**
   - Add a new diagnostic setting called "all logs"
   - Select the following log types:
     - HTTP Logs
     - App Service Console Logs
     - App Service Application Logs
     - App Service Platform Logs
     - All Metrics
   - Check "Send to Log Analytics Workspace" and select the workspace you created earlier

4. **Update Application Insights Connection String**
   - Update the Application Insights connection string in your service settings
   - This enables your application to send telemetry data to Application Insights 

## Environment-Specific Configuration Files

For a new environment to function correctly, several environment-specific configuration files need to be created or updated. These files ensure that the applications and services point to the correct resources and use appropriate settings for the target environment. Below is a list of the necessary files, with placeholders for environment-specific values (replace `<environment>` with the name of your target environment, e.g., 'staging', 'test', or 'production'):

### Database Configuration
- **File**: `database/SQL/<environment>.publish.xml`
  - **Purpose**: Defines the database deployment settings for the target environment.


### Backend API Configuration (v4)
- **File**: `edudoc/src/API/appsettings.<Environment>.json`
  - **Purpose**: Configuration for the v4 backend API in the target environment.

### Backend API Configuration (v5)
- **File**: `edudoc-v5/backend/EduDoc.Api/appsettings.<Environment>.json`
  - **Purpose**: Configuration for the v5 backend API in the target environment.

### Frontend Configuration (v4)
- **File**: `edudoc/src/app/common/environments/environment.<environment>.ts`
  - **Purpose**: Defines environment settings for the v4 Angular frontend in the target environment.
- **File**: `edudoc/angular.json`
  - **Purpose**: Build configuration for the v4 Angular app.
  - **Update**: Add an `<environment>` configuration under `projects:edudoc:architect:build:configurations` and `serve:configurations`, referencing `environment.<environment>.ts`.

### Frontend Configuration (v5)
- **File**: `edudoc-v5/frontend/edudoc-v5/src/environments/environment.<environment>.ts`
  - **Purpose**: Defines environment settings for the v5 Angular frontend in the target environment.
- **File**: `edudoc-v5/frontend/edudoc-v5/angular.json`
  - **Purpose**: Build configuration for the v5 Angular app.
  - **Update**: Add an `<environment>` configuration under `projects:edudoc-v5:architect:build:configurations` and `serve:configurations`, referencing `environment.<environment>.ts`.

### WebJobs Configuration (v4)
For each of the following WebJobs, create or update the `appsettings.<Environment>.json` file to match the structure of the corresponding `appsettings.Test.json`, with environment-specific values:
- `edudoc/src/ActivitySummaryJob/appsettings.<Environment>.json`
- `edudoc/src/AnnualTrainingsJob/appsettings.<Environment>.json`
- `edudoc/src/BillingSchedulesJob/appsettings.<Environment>.json`
- `edudoc/src/EscReportJob/appsettings.<Environment>.json`
- `edudoc/src/PendingReferralsJob/appsettings.<Environment>.json`
- `edudoc/src/RosterUploadJob/appsettings.<Environment>.json`
- `edudoc/src/TherapySchedulesJob/appsettings.<Environment>.json`

Ensure all these files are committed to the repository and used in the CI/CD pipelines for the target environment deployments.- Adjust environment settings like `ASPNETCORE_ENVIRONMENT`