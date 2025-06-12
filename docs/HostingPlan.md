# Tentative Azure Hosting and Deployment Plan

## Overview

This document outlines the strategy for migrating hosting and deployment pipelines from a vendor's Azure tenant to our own tenant. The plan accounts for two distinct applications:
1. Legacy Application (edudoc)
   - .NET backend with background jobs
   - Angular frontend
2. New Application (edudoc-v5)
   - Modern .NET backend
   - Angular frontend
   - Integrated via iframe into legacy application

## Technology Stack

### Cloud Infrastructure
- **Azure Services**:
  - Azure App Service for web applications
  - Azure SQL Database for MSSQL
  - Azure Application Insights for monitoring
  - Azure Key Vault for secrets
  - Azure Front Door for routing (optional)

### Source Control and CI/CD
- **GitHub**:
  - Source code repository
  - GitHub Actions for CI/CD pipelines
  - Branch protection rules
  - Environment protection rules
  - Deployment environments

### Database
- **MSSQL Database**:
  - SQL Server Database Project (.sqlproj)
  - Dedicated publish profiles per environment
  - Post-deployment scripts
  - Database schema version control

## Environment Structure

### Testing Environment
- Dedicated Azure resources for QA and testing
- Single deployment slot
- Isolated from production data
- Used for feature testing and integration validation
- Separate app services for each application component:
  - Legacy Backend + Jobs
  - Legacy Frontend
  - V5 Backend
  - V5 Frontend
- Dedicated test database with publish profile (testserver.publish.xml)

### Staging Environment
- Blue/Green deployment configuration
- Mirrors production configuration
- Used for final validation before production deployment
- Helps verify deployment procedures
- Separate app services with deployment slots for each component
- Staging database with publish profile (staging.publish.xml)

### Production Environment
- Blue/Green deployment configuration
- High availability setup
- Production-grade monitoring and alerting
- Scalability configurations as needed
- Separate app services with deployment slots for each component
- Production database with publish profile (production.publish.xml)

## Pipeline Strategy

### GitHub Actions Workflow Structure
- Separate workflow files for:
  - Database deployment
  - Legacy backend deployment
  - Legacy frontend deployment
  - V5 backend deployment
  - V5 frontend deployment
- Environment-specific configurations
- Reusable workflow components
- Deployment approvals and gates

### 1. Testing Pipeline
- Separate pipelines for each component
- GitHub Actions triggers:
  - Pull request to develop branch
  - Push to develop branch
- Features:
  - Automated builds
  - Unit test execution
  - Integration test execution
  - Database deployment using SQL.Build
  - Application deployment
  - Post-deployment testing
  - Integration testing between applications

### 2. Staging Pipeline
- Coordinated deployment pipelines for all components
- GitHub Actions triggers:
  - Push to staging branch
  - Manual workflow dispatch
- Features:
  - Infrastructure validation
  - Database deployment with staging profile
  - Blue/Green deployment practice
  - Load testing capabilities
  - Security scanning
  - Integration verification
  - Background job validation
  - iframe integration testing

### 3. Production Pipeline
- Coordinated deployment pipelines for all components
- GitHub Actions triggers:
  - Push to main branch
  - Manual workflow dispatch with approvals
- Features:
  - Production infrastructure management
  - Database deployment with production profile
  - Blue/Green deployment
  - Required approval gates
  - Rollback capabilities
  - Post-deployment health checks
  - Job continuity verification

## Database Deployment Strategy

### Infrastructure Setup
- Azure SQL Database instances for each environment
- Database project deployment using SQL.Build
- Environment-specific publish profiles
- Schema version control through SQL.refactorlog
- Post-deployment data seeding

### Deployment Process
1. Deploy database changes using appropriate publish profile
2. Run post-deployment scripts
3. Verify database deployment
4. Deploy application components to inactive slots
5. Run integration tests
6. Coordinate slot swaps
7. Monitor for issues
8. Execute rollback if needed

## Migration Plan

### Phase 1: Testing Environment
1. Set up Azure resources
   - App Services
   - SQL Database
   - Key Vault
   - Application Insights
2. Configure GitHub environments and secrets
3. Create and test GitHub Actions workflows
4. Deploy database using SQL.Build
5. Deploy application components
6. Validate environment isolation
7. Establish monitoring and logging
8. Verify iframe integration
9. Test background job execution

### Phase 2: Staging Environment
1. Deploy staging infrastructure with Blue/Green capability for all components
2. Create coordinated staging deployment pipelines
3. Test Blue/Green deployment process
4. Validate monitoring and alerts
5. Test background job continuity during swaps
6. Verify iframe behavior during deployments

### Phase 3: Production Pipeline
1. Create new production pipelines for all components
2. Set up approval processes
3. Configure production-grade monitoring
4. Establish coordinated deployment procedures
5. Document rollback processes
6. Create job failover procedures

### Phase 4: Cutover
1. Validate entire deployment flow
2. Coordinate with vendor for transition
3. Execute production deployment
4. Verify all systems and integrations
5. Confirm background job execution
6. Decommission vendor pipelines

## Key Considerations

### Application Integration
- iframe communication and security
- Version compatibility management
- URL and routing coordination
- Shared authentication/authorization

### Background Jobs
- Job continuity during deployments
- Job state management
- Monitoring and alerting
- Failover procedures

### Security
- Access control and authentication
- Secrets management
- Security scanning in pipelines
- Compliance requirements
- iframe security considerations

### Monitoring
- Application health metrics for all components
- Infrastructure metrics
- Background job monitoring
- iframe integration monitoring
- Cost monitoring
- Alert configuration

### Disaster Recovery
- Backup strategies
- Recovery procedures
- Regular DR testing
- Documentation requirements
- Job recovery procedures

### Documentation Needs
- Environment configurations
- Deployment procedures
- Troubleshooting guides
- Rollback procedures
- Emergency contacts
- Job management procedures

## Next Steps
1. Set up GitHub environments and secrets
2. Create initial GitHub Actions workflows
3. Configure Azure resources
4. Review specific requirements for background jobs
5. Document iframe integration specifications
6. Define detailed technical specifications for each component
7. Create implementation timeline
8. Identify resource requirements
9. Plan job migration strategy
10. Set up database deployment automation

---
Note: This plan will be updated with additional application-specific details as they are reviewed and documented. 