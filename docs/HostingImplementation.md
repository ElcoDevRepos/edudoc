# Implementation Progress

## Current Focus: Testing Environment Setup

### 1. Database Deployment Pipeline _(Completed)_
- [x] Create initial GitHub Actions workflow
- [x] Review and understand workflow components
- [x] Create improved test.publish.xml profile
- [x] Set up Azure SQL resources
  - [x] Determine region (East US 2)
  - [x] Decide on minimal initial sizing
  - [x] Create resources
- [x] Configure GitHub environment and secrets
- [x] Test initial deployment

**📋 Database Resources Created:**
- **Resource Group**: `rg-test-eastus2-EduDoc`
- **SQL Server**: `sql-edudoc-test`
- **Database**: `edudoc.SQL`
- **GitHub Environment**: `test`
- **GitHub Secrets**: `AZURE_SQL_CONNECTION_STRING`
- **Deployment Pipeline**: `.github/workflows/database-test-deploy.yml`

### 2. Legacy Application (edudoc) _(In Progress)_
- [x] **Azure App Service resources setup**
  - [x] App Service Plan (`asp-edudoc-test`) - Created
  - [x] Backend App Service (`app-edudoc-backend-test`) - Created
  - [x] Frontend App Service (`app-edudoc-frontend-test`) - Created
- [x] **Backend deployment workflow** _(Completed)_
  - [x] .NET 8.0 API deployment
  - [x] Path-based triggers (only builds when backend code changes)
  - [x] Fixed SPA configuration issues (removed problematic UseBreckenridgeAzure)
  - [x] Configured for pure API backend (no static file serving)
  - [x] Successfully deployed and tested
  - [x] Cleaned up workflow file
  - [ ] WebJobs deployment (deferred until later)
- [x] **Frontend deployment workflow** _(Completed)_
  - [x] Created minimal workflow file with workflow_dispatch
  - [x] Angular build and deployment steps
  - [x] Environment-specific configuration
  - [x] Successfully deployed and tested
- [ ] **Domain and Routing Configuration** _(Current Focus)_
  - [ ] Set up Application Gateway
  - [ ] Configure custom domain (hpc-edudoc-test.net)
  - [ ] Set up path-based routing rules
  - [ ] Configure SSL certificate
  - [ ] Update frontend base paths
  - [ ] Test routing configuration
- [x] **Test deployments and integration**

**📋 Legacy App Resources Created:**
- **Resource Group**: `rg-test-eastus2-EduDoc` (shared)
- **App Service Plan**: `asp-edudoc-test` (Windows, B1 SKU)
- **Backend App Service**: `app-edudoc-backend-test` (dotnet:8 runtime)
  - **URL**: https://app-edudoc-backend-test.azurewebsites.net
  - **Purpose**: .NET 8.0 API + Azure WebJobs
- **Frontend App Service**: `app-edudoc-frontend-test` (NODE:20LTS runtime)
  - **URL**: https://app-edudoc-frontend-test.azurewebsites.net
  - **Purpose**: Angular SPA hosting
- **GitHub Environment**: `test` (shared with database)
- **Deployment Pipelines**:
  - Backend: `.github/workflows/backend-test-deploy.yml` - Created
  - Frontend: `.github/workflows/frontend-test-deploy.yml` - Created (minimal)
  - V5 Backend: `.github/workflows/v5-backend-test-deploy.yml` - Created (minimal)
  - V5 Frontend: `.github/workflows/v5-frontend-test-deploy.yml` - Created (minimal)

### 3. V5 Application (edudoc-v5) _(In Progress)_
- [ ] **Backend deployment workflow** _(Current Focus)_
  - [x] Created minimal workflow file with workflow_dispatch
  - [x] Build and deployment steps
  - [x] Environment-specific configuration
  - [x] Azure resources setup
  - [ ] Test deployment
- [x] **Frontend deployment workflow** 
  - [x] Created minimal workflow file with workflow_dispatch
  - [ ] Angular build and deployment steps
- [ ] Test deployments

**📋 V5 App Resources Created:**
- **Resource Group**: `rg-test-eastus2-EduDoc` (shared)
- **App Service Plan**: `asp-edudoc-test` (shared)
- **Backend App Service**: `app-edudoc-v5-backend-test` (dotnet:8 runtime)
  - **URL**: https://app-edudoc-v5-backend-test.azurewebsites.net
  - **Purpose**: .NET 8.0 API
- **Frontend App Service**: `app-edudoc-v5-frontend-test` (NODE:20LTS runtime)
  - **URL**: https://app-edudoc-v5-frontend-test.azurewebsites.net
  - **Purpose**: Angular SPA hosting
- **GitHub Environment**: `test` (shared)
- **GitHub Secrets**:
  - `AZURE_WEBAPP_PUBLISH_PROFILE_BACKEND_V5`
  - `AZURE_WEBAPP_PUBLISH_PROFILE_FRONTEND_V5`
- **Deployment Pipelines**:
  - Backend: `.github/workflows/v5-backend-test-deploy.yml` - Updated
  - Frontend: `.github/workflows/v5-frontend-test-deploy.yml` - Created (minimal)

### 4. Integration Testing _(Not Started)_
- [ ] Path-based routing verification
- [ ] iframe integration verification
- [ ] Background jobs verification
- [ ] End-to-end testing

## Completed Steps
- Created database deployment workflow in GitHub Actions
- Created and reviewed safer database publish profile
- Decided on East US region for resources
- Decided on minimal initial resource sizing for test environment
- **Completed database deployment pipeline for test environment**
- **Successfully deployed database using GitHub Actions**
- **Configured Azure SQL resources and GitHub environment secrets**

## Next Actions
1. **Set up Application Gateway and Domain Configuration** _(Current Focus)_
   - Create Application Gateway
   - Configure custom domain
   - Set up path-based routing
   - Configure SSL certificate
2. **Update Frontend Configurations**
   - Configure base paths for both frontends
   - Update API endpoints
   - Test routing
3. **Test V5 backend deployment workflow**
   - Trigger manual deployment
   - Verify API functionality
4. **Complete V5 frontend deployment workflow**
   - Angular build and deployment steps
   - Environment-specific configuration
5. **Test end-to-end V5 application**
   - Backend API + Frontend integration
   - CORS configuration verification
6. **Add WebJobs back to legacy backend**
7. **Set up staging environment**

## Notes and Decisions
- Using GitHub Actions for CI/CD
- Starting with test environment setup
- Database deployment as first component
- East US region for all resources
- Starting with minimal performance tier for test environment
- Browser-based access needed for internal employees
- Using Azure CLI for resource creation
- **Background jobs will run as Azure WebJobs within the backend App Service**
- **Legacy app architecture: 2 separate App Services (backend + frontend)**
- **Backend App Service will host both .NET API and WebJobs**
- **Single domain (hpc-edudoc-test.net) with path-based routing**
- **Application Gateway for routing management**
- **Version-specific base paths (/v4, /v5)** 