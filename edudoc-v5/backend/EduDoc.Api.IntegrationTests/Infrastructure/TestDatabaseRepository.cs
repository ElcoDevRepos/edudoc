using EduDoc.Api.EF;
using EduDoc.Api.EF.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EduDoc.Api.IntegrationTests.Infrastructure
{
    public class TestDatabaseRepository
    {
        private readonly EdudocSqlContext _dbContext;

        public TestDatabaseRepository(EdudocSqlContext dbContext)
        {
            _dbContext = dbContext;
        }

        private async Task WithIdentityInsert(string table, Func<Task> action)
        {
            await using var transaction = await _dbContext.Database.BeginTransactionAsync();
#pragma warning disable EF1002 // Risk of vulnerability to SQL injection.
            await _dbContext.Database.ExecuteSqlRawAsync($"SET IDENTITY_INSERT dbo.{table} ON");
            await action();
            await _dbContext.SaveChangesAsync();
            await _dbContext.Database.ExecuteSqlRawAsync($"SET IDENTITY_INSERT dbo.{table} OFF");
#pragma warning restore EF1002 // Risk of vulnerability to SQL injection.
            await transaction.CommitAsync();
        }

        // 1. Acknowledgements
        public async Task<Acknowledgement> InsertAcknowledgementAsync(Acknowledgement entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Acknowledgements), async () =>
            {
                await _dbContext.Acknowledgements.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Acknowledgement>> InsertAcknowledgementsAsync(List<Acknowledgement> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Acknowledgements), async () =>
            {
                await _dbContext.Acknowledgements.AddRangeAsync(entities);
            });
            return entities;
        }

        // 2. ActivitySummaries
        public async Task<ActivitySummary> InsertActivitySummaryAsync(ActivitySummary entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ActivitySummaries), async () =>
            {
                await _dbContext.ActivitySummaries.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ActivitySummary>> InsertActivitySummariesAsync(List<ActivitySummary> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ActivitySummaries), async () =>
            {
                await _dbContext.ActivitySummaries.AddRangeAsync(entities);
            });
            return entities;
        }

        // 3. ActivitySummaryDistricts
        public async Task<ActivitySummaryDistrict> InsertActivitySummaryDistrictAsync(ActivitySummaryDistrict entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ActivitySummaryDistricts), async () =>
            {
                await _dbContext.ActivitySummaryDistricts.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ActivitySummaryDistrict>> InsertActivitySummaryDistrictsAsync(List<ActivitySummaryDistrict> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ActivitySummaryDistricts), async () =>
            {
                await _dbContext.ActivitySummaryDistricts.AddRangeAsync(entities);
            });
            return entities;
        }

        // 4. ActivitySummaryProviders
        public async Task<ActivitySummaryProvider> InsertActivitySummaryProviderAsync(ActivitySummaryProvider entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ActivitySummaryProviders), async () =>
            {
                await _dbContext.ActivitySummaryProviders.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ActivitySummaryProvider>> InsertActivitySummaryProvidersAsync(List<ActivitySummaryProvider> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ActivitySummaryProviders), async () =>
            {
                await _dbContext.ActivitySummaryProviders.AddRangeAsync(entities);
            });
            return entities;
        }

        // 5. ActivitySummaryServiceAreas
        public async Task<ActivitySummaryServiceArea> InsertActivitySummaryServiceAreaAsync(ActivitySummaryServiceArea entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ActivitySummaryServiceAreas), async () =>
            {
                await _dbContext.ActivitySummaryServiceAreas.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ActivitySummaryServiceArea>> InsertActivitySummaryServiceAreasAsync(List<ActivitySummaryServiceArea> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ActivitySummaryServiceAreas), async () =>
            {
                await _dbContext.ActivitySummaryServiceAreas.AddRangeAsync(entities);
            });
            return entities;
        }

        // 6. Addresses
        public async Task<Address> InsertAddressAsync(Address entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Addresses), async () =>
            {
                await _dbContext.Addresses.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Address>> InsertAddressesAsync(List<Address> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Addresses), async () =>
            {
                await _dbContext.Addresses.AddRangeAsync(entities);
            });
            return entities;
        }

        // 7. AdminSchoolDistricts
        public async Task<AdminSchoolDistrict> InsertAdminSchoolDistrictAsync(AdminSchoolDistrict entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AdminSchoolDistricts), async () =>
            {
                await _dbContext.AdminSchoolDistricts.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<AdminSchoolDistrict>> InsertAdminSchoolDistrictsAsync(List<AdminSchoolDistrict> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AdminSchoolDistricts), async () =>
            {
                await _dbContext.AdminSchoolDistricts.AddRangeAsync(entities);
            });
            return entities;
        }

        // 8. Agencies
        public async Task<Agency> InsertAgencyAsync(Agency entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Agencies), async () =>
            {
                await _dbContext.Agencies.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Agency>> InsertAgenciesAsync(List<Agency> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Agencies), async () =>
            {
                await _dbContext.Agencies.AddRangeAsync(entities);
            });
            return entities;
        }

        // 9. AgencyTypes
        public async Task<AgencyType> InsertAgencyTypeAsync(AgencyType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AgencyTypes), async () =>
            {
                await _dbContext.AgencyTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<AgencyType>> InsertAgencyTypesAsync(List<AgencyType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AgencyTypes), async () =>
            {
                await _dbContext.AgencyTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 10. AnnualEntries
        public async Task<AnnualEntry> InsertAnnualEntryAsync(AnnualEntry entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AnnualEntries), async () =>
            {
                await _dbContext.AnnualEntries.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<AnnualEntry>> InsertAnnualEntriesAsync(List<AnnualEntry> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AnnualEntries), async () =>
            {
                await _dbContext.AnnualEntries.AddRangeAsync(entities);
            });
            return entities;
        }

        // 11. AnnualEntryStatuses
        public async Task<AnnualEntryStatus> InsertAnnualEntryStatusAsync(AnnualEntryStatus entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AnnualEntryStatuses), async () =>
            {
                await _dbContext.AnnualEntryStatuses.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<AnnualEntryStatus>> InsertAnnualEntryStatusesAsync(List<AnnualEntryStatus> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AnnualEntryStatuses), async () =>
            {
                await _dbContext.AnnualEntryStatuses.AddRangeAsync(entities);
            });
            return entities;
        }

        // 12. AuditLogDetails
        public async Task<AuditLogDetail> InsertAuditLogDetailAsync(AuditLogDetail entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuditLogDetails), async () =>
            {
                await _dbContext.AuditLogDetails.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<AuditLogDetail>> InsertAuditLogDetailsAsync(List<AuditLogDetail> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuditLogDetails), async () =>
            {
                await _dbContext.AuditLogDetails.AddRangeAsync(entities);
            });
            return entities;
        }

        // 13. AuditLogRelationships
        public async Task<AuditLogRelationship> InsertAuditLogRelationshipAsync(AuditLogRelationship entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuditLogRelationships), async () =>
            {
                await _dbContext.AuditLogRelationships.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<AuditLogRelationship>> InsertAuditLogRelationshipsAsync(List<AuditLogRelationship> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuditLogRelationships), async () =>
            {
                await _dbContext.AuditLogRelationships.AddRangeAsync(entities);
            });
            return entities;
        }

        // 14. AuditLogs
        public async Task<AuditLog> InsertAuditLogAsync(AuditLog entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuditLogs), async () =>
            {
                await _dbContext.AuditLogs.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<AuditLog>> InsertAuditLogsAsync(List<AuditLog> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuditLogs), async () =>
            {
                await _dbContext.AuditLogs.AddRangeAsync(entities);
            });
            return entities;
        }

        // 15. AuthApplicationTypes
        public async Task<AuthApplicationType> InsertAuthApplicationTypeAsync(AuthApplicationType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuthApplicationTypes), async () =>
            {
                await _dbContext.AuthApplicationTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<AuthApplicationType>> InsertAuthApplicationTypesAsync(List<AuthApplicationType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuthApplicationTypes), async () =>
            {
                await _dbContext.AuthApplicationTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 16. AuthClients
        public async Task<AuthClient> InsertAuthClientAsync(AuthClient entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuthClients), async () =>
            {
                await _dbContext.AuthClients.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<AuthClient>> InsertAuthClientsAsync(List<AuthClient> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuthClients), async () =>
            {
                await _dbContext.AuthClients.AddRangeAsync(entities);
            });
            return entities;
        }

        // 17. AuthTokens
        public async Task<AuthToken> InsertAuthTokenAsync(AuthToken entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuthTokens), async () =>
            {
                await _dbContext.AuthTokens.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<AuthToken>> InsertAuthTokensAsync(List<AuthToken> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuthTokens), async () =>
            {
                await _dbContext.AuthTokens.AddRangeAsync(entities);
            });
            return entities;
        }

        // 18. AuthUsers
        public async Task<AuthUser> InsertAuthUserAsync(AuthUser entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuthUsers), async () =>
            {
                await _dbContext.AuthUsers.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<AuthUser>> InsertAuthUsersAsync(List<AuthUser> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AuthUsers), async () =>
            {
                await _dbContext.AuthUsers.AddRangeAsync(entities);
            });
            return entities;
        }

        // 19. BillingFailureReasons
        public async Task<BillingFailureReason> InsertBillingFailureReasonAsync(BillingFailureReason entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingFailureReasons), async () =>
            {
                await _dbContext.BillingFailureReasons.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<BillingFailureReason>> InsertBillingFailureReasonsAsync(List<BillingFailureReason> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingFailureReasons), async () =>
            {
                await _dbContext.BillingFailureReasons.AddRangeAsync(entities);
            });
            return entities;
        }

        // 20. BillingFailures
        public async Task<BillingFailure> InsertBillingFailureAsync(BillingFailure entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingFailures), async () =>
            {
                await _dbContext.BillingFailures.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<BillingFailure>> InsertBillingFailuresAsync(List<BillingFailure> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingFailures), async () =>
            {
                await _dbContext.BillingFailures.AddRangeAsync(entities);
            });
            return entities;
        }

        // 21. BillingFiles
        public async Task<BillingFile> InsertBillingFileAsync(BillingFile entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingFiles), async () =>
            {
                await _dbContext.BillingFiles.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<BillingFile>> InsertBillingFilesAsync(List<BillingFile> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingFiles), async () =>
            {
                await _dbContext.BillingFiles.AddRangeAsync(entities);
            });
            return entities;
        }

        // 22. BillingResponseFiles
        public async Task<BillingResponseFile> InsertBillingResponseFileAsync(BillingResponseFile entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingResponseFiles), async () =>
            {
                await _dbContext.BillingResponseFiles.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<BillingResponseFile>> InsertBillingResponseFilesAsync(List<BillingResponseFile> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingResponseFiles), async () =>
            {
                await _dbContext.BillingResponseFiles.AddRangeAsync(entities);
            });
            return entities;
        }

        // 23. BillingScheduleAdminNotifications
        public async Task<BillingScheduleAdminNotification> InsertBillingScheduleAdminNotificationAsync(BillingScheduleAdminNotification entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingScheduleAdminNotifications), async () =>
            {
                await _dbContext.BillingScheduleAdminNotifications.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<BillingScheduleAdminNotification>> InsertBillingScheduleAdminNotificationsAsync(List<BillingScheduleAdminNotification> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingScheduleAdminNotifications), async () =>
            {
                await _dbContext.BillingScheduleAdminNotifications.AddRangeAsync(entities);
            });
            return entities;
        }

        // 24. BillingScheduleDistricts
        public async Task<BillingScheduleDistrict> InsertBillingScheduleDistrictAsync(BillingScheduleDistrict entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingScheduleDistricts), async () =>
            {
                await _dbContext.BillingScheduleDistricts.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<BillingScheduleDistrict>> InsertBillingScheduleDistrictsAsync(List<BillingScheduleDistrict> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingScheduleDistricts), async () =>
            {
                await _dbContext.BillingScheduleDistricts.AddRangeAsync(entities);
            });
            return entities;
        }

        // 25. BillingScheduleExcludedCptCodes
        public async Task<BillingScheduleExcludedCptCode> InsertBillingScheduleExcludedCptCodeAsync(BillingScheduleExcludedCptCode entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingScheduleExcludedCptCodes), async () =>
            {
                await _dbContext.BillingScheduleExcludedCptCodes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<BillingScheduleExcludedCptCode>> InsertBillingScheduleExcludedCptCodesAsync(List<BillingScheduleExcludedCptCode> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingScheduleExcludedCptCodes), async () =>
            {
                await _dbContext.BillingScheduleExcludedCptCodes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 26. BillingScheduleExcludedProviders
        public async Task<BillingScheduleExcludedProvider> InsertBillingScheduleExcludedProviderAsync(BillingScheduleExcludedProvider entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingScheduleExcludedProviders), async () =>
            {
                await _dbContext.BillingScheduleExcludedProviders.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<BillingScheduleExcludedProvider>> InsertBillingScheduleExcludedProvidersAsync(List<BillingScheduleExcludedProvider> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingScheduleExcludedProviders), async () =>
            {
                await _dbContext.BillingScheduleExcludedProviders.AddRangeAsync(entities);
            });
            return entities;
        }

        // 27. BillingScheduleExcludedServiceCodes
        public async Task<BillingScheduleExcludedServiceCode> InsertBillingScheduleExcludedServiceCodeAsync(BillingScheduleExcludedServiceCode entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingScheduleExcludedServiceCodes), async () =>
            {
                await _dbContext.BillingScheduleExcludedServiceCodes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<BillingScheduleExcludedServiceCode>> InsertBillingScheduleExcludedServiceCodesAsync(List<BillingScheduleExcludedServiceCode> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingScheduleExcludedServiceCodes), async () =>
            {
                await _dbContext.BillingScheduleExcludedServiceCodes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 28. BillingSchedules
        public async Task<BillingSchedule> InsertBillingScheduleAsync(BillingSchedule entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingSchedules), async () =>
            {
                await _dbContext.BillingSchedules.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<BillingSchedule>> InsertBillingSchedulesAsync(List<BillingSchedule> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.BillingSchedules), async () =>
            {
                await _dbContext.BillingSchedules.AddRangeAsync(entities);
            });
            return entities;
        }

        // 29. CaseLoadCptCodes
        public async Task<CaseLoadCptCode> InsertCaseLoadCptCodeAsync(CaseLoadCptCode entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CaseLoadCptCodes), async () =>
            {
                await _dbContext.CaseLoadCptCodes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<CaseLoadCptCode>> InsertCaseLoadCptCodesAsync(List<CaseLoadCptCode> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CaseLoadCptCodes), async () =>
            {
                await _dbContext.CaseLoadCptCodes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 30. CaseLoadGoals
        public async Task<CaseLoadGoal> InsertCaseLoadGoalAsync(CaseLoadGoal entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CaseLoadGoals), async () =>
            {
                await _dbContext.CaseLoadGoals.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<CaseLoadGoal>> InsertCaseLoadGoalsAsync(List<CaseLoadGoal> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CaseLoadGoals), async () =>
            {
                await _dbContext.CaseLoadGoals.AddRangeAsync(entities);
            });
            return entities;
        }

        // 31. CaseLoadMethods
        public async Task<CaseLoadMethod> InsertCaseLoadMethodAsync(CaseLoadMethod entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CaseLoadMethods), async () =>
            {
                await _dbContext.CaseLoadMethods.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<CaseLoadMethod>> InsertCaseLoadMethodsAsync(List<CaseLoadMethod> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CaseLoadMethods), async () =>
            {
                await _dbContext.CaseLoadMethods.AddRangeAsync(entities);
            });
            return entities;
        }

        // 32. CaseLoads
        public async Task<CaseLoad> InsertCaseLoadAsync(CaseLoad entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CaseLoads), async () =>
            {
                await _dbContext.CaseLoads.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<CaseLoad>> InsertCaseLoadsAsync(List<CaseLoad> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CaseLoads), async () =>
            {
                await _dbContext.CaseLoads.AddRangeAsync(entities);
            });
            return entities;
        }

        // 33. CaseLoadScriptGoals
        public async Task<CaseLoadScriptGoal> InsertCaseLoadScriptGoalAsync(CaseLoadScriptGoal entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CaseLoadScriptGoals), async () =>
            {
                await _dbContext.CaseLoadScriptGoals.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<CaseLoadScriptGoal>> InsertCaseLoadScriptGoalsAsync(List<CaseLoadScriptGoal> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CaseLoadScriptGoals), async () =>
            {
                await _dbContext.CaseLoadScriptGoals.AddRangeAsync(entities);
            });
            return entities;
        }

        // 34. CaseLoadScripts
        public async Task<CaseLoadScript> InsertCaseLoadScriptAsync(CaseLoadScript entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CaseLoadScripts), async () =>
            {
                await _dbContext.CaseLoadScripts.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<CaseLoadScript>> InsertCaseLoadScriptsAsync(List<CaseLoadScript> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CaseLoadScripts), async () =>
            {
                await _dbContext.CaseLoadScripts.AddRangeAsync(entities);
            });
            return entities;
        }

        // 35. ClaimsDistricts
        public async Task<ClaimsDistrict> InsertClaimsDistrictAsync(ClaimsDistrict entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ClaimsDistricts), async () =>
            {
                await _dbContext.ClaimsDistricts.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ClaimsDistrict>> InsertClaimsDistrictsAsync(List<ClaimsDistrict> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ClaimsDistricts), async () =>
            {
                await _dbContext.ClaimsDistricts.AddRangeAsync(entities);
            });
            return entities;
        }

        // 36. ClaimsEncounters
        public async Task<ClaimsEncounter> InsertClaimsEncounterAsync(ClaimsEncounter entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ClaimsEncounters), async () =>
            {
                await _dbContext.ClaimsEncounters.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ClaimsEncounter>> InsertClaimsEncountersAsync(List<ClaimsEncounter> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ClaimsEncounters), async () =>
            {
                await _dbContext.ClaimsEncounters.AddRangeAsync(entities);
            });
            return entities;
        }

        // 37. ClaimsStudents
        public async Task<ClaimsStudent> InsertClaimsStudentAsync(ClaimsStudent entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ClaimsStudents), async () =>
            {
                await _dbContext.ClaimsStudents.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ClaimsStudent>> InsertClaimsStudentsAsync(List<ClaimsStudent> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ClaimsStudents), async () =>
            {
                await _dbContext.ClaimsStudents.AddRangeAsync(entities);
            });
            return entities;
        }

        // 38. ClaimTypes
        public async Task<ClaimType> InsertClaimTypeAsync(ClaimType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ClaimTypes), async () =>
            {
                await _dbContext.ClaimTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ClaimType>> InsertClaimTypesAsync(List<ClaimType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ClaimTypes), async () =>
            {
                await _dbContext.ClaimTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 39. ClaimValues
        public async Task<ClaimValue> InsertClaimValueAsync(ClaimValue entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ClaimValues), async () =>
            {
                await _dbContext.ClaimValues.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ClaimValue>> InsertClaimValuesAsync(List<ClaimValue> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ClaimValues), async () =>
            {
                await _dbContext.ClaimValues.AddRangeAsync(entities);
            });
            return entities;
        }

        // 40. ClearedAuthTokens
        public async Task<ClearedAuthToken> InsertClearedAuthTokenAsync(ClearedAuthToken entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ClearedAuthTokens), async () =>
            {
                await _dbContext.ClearedAuthTokens.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ClearedAuthToken>> InsertClearedAuthTokensAsync(List<ClearedAuthToken> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ClearedAuthTokens), async () =>
            {
                await _dbContext.ClearedAuthTokens.AddRangeAsync(entities);
            });
            return entities;
        }

        // 41. ConsoleJobLogs
        public async Task<ConsoleJobLog> InsertConsoleJobLogAsync(ConsoleJobLog entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ConsoleJobLogs), async () =>
            {
                await _dbContext.ConsoleJobLogs.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ConsoleJobLog>> InsertConsoleJobLogsAsync(List<ConsoleJobLog> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ConsoleJobLogs), async () =>
            {
                await _dbContext.ConsoleJobLogs.AddRangeAsync(entities);
            });
            return entities;
        }

        // 42. ConsoleJobTypes
        public async Task<ConsoleJobType> InsertConsoleJobTypeAsync(ConsoleJobType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ConsoleJobTypes), async () =>
            {
                await _dbContext.ConsoleJobTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ConsoleJobType>> InsertConsoleJobTypesAsync(List<ConsoleJobType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ConsoleJobTypes), async () =>
            {
                await _dbContext.ConsoleJobTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 43. ContactPhones
        public async Task<ContactPhone> InsertContactPhoneAsync(ContactPhone entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ContactPhones), async () =>
            {
                await _dbContext.ContactPhones.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ContactPhone>> InsertContactPhonesAsync(List<ContactPhone> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ContactPhones), async () =>
            {
                await _dbContext.ContactPhones.AddRangeAsync(entities);
            });
            return entities;
        }

        // 44. ContactRoles
        public async Task<ContactRole> InsertContactRoleAsync(ContactRole entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ContactRoles), async () =>
            {
                await _dbContext.ContactRoles.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ContactRole>> InsertContactRolesAsync(List<ContactRole> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ContactRoles), async () =>
            {
                await _dbContext.ContactRoles.AddRangeAsync(entities);
            });
            return entities;
        }

        // 45. Contacts
        public async Task<Contact> InsertContactAsync(Contact entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Contacts), async () =>
            {
                await _dbContext.Contacts.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Contact>> InsertContactsAsync(List<Contact> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Contacts), async () =>
            {
                await _dbContext.Contacts.AddRangeAsync(entities);
            });
            return entities;
        }

        // 46. ContactStatuses
        public async Task<ContactStatus> InsertContactStatusAsync(ContactStatus entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ContactStatuses), async () =>
            {
                await _dbContext.ContactStatuses.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ContactStatus>> InsertContactStatusesAsync(List<ContactStatus> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ContactStatuses), async () =>
            {
                await _dbContext.ContactStatuses.AddRangeAsync(entities);
            });
            return entities;
        }

        // 47. Counties
        public async Task<County> InsertCountyAsync(County entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Counties), async () =>
            {
                await _dbContext.Counties.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<County>> InsertCountiesAsync(List<County> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Counties), async () =>
            {
                await _dbContext.Counties.AddRangeAsync(entities);
            });
            return entities;
        }

        // 48. Countries
        public async Task<Country> InsertCountryAsync(Country entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Countries), async () =>
            {
                await _dbContext.Countries.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Country>> InsertCountriesAsync(List<Country> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Countries), async () =>
            {
                await _dbContext.Countries.AddRangeAsync(entities);
            });
            return entities;
        }

        // 49. CPTCodeAssocations
        public async Task<CptcodeAssocation> InsertCptcodeAssocationAsync(CptcodeAssocation entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CptcodeAssocations), async () =>
            {
                await _dbContext.CptcodeAssocations.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<CptcodeAssocation>> InsertCptcodeAssocationsAsync(List<CptcodeAssocation> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.CptcodeAssocations), async () =>
            {
                await _dbContext.CptcodeAssocations.AddRangeAsync(entities);
            });
            return entities;
        }

        // 50. CPTCodes
        public async Task<Cptcode> InsertCptcodeAsync(Cptcode entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Cptcodes), async () =>
            {
                await _dbContext.Cptcodes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Cptcode>> InsertCptcodesAsync(List<Cptcode> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Cptcodes), async () =>
            {
                await _dbContext.Cptcodes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 51. DiagnosisCodeAssociations
        public async Task<DiagnosisCodeAssociation> InsertDiagnosisCodeAssociationAsync(DiagnosisCodeAssociation entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.DiagnosisCodeAssociations), async () =>
            {
                await _dbContext.DiagnosisCodeAssociations.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<DiagnosisCodeAssociation>> InsertDiagnosisCodeAssociationsAsync(List<DiagnosisCodeAssociation> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.DiagnosisCodeAssociations), async () =>
            {
                await _dbContext.DiagnosisCodeAssociations.AddRangeAsync(entities);
            });
            return entities;
        }

        // 52. DiagnosisCodes
        public async Task<DiagnosisCode> InsertDiagnosisCodeAsync(DiagnosisCode entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.DiagnosisCodes), async () =>
            {
                await _dbContext.DiagnosisCodes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<DiagnosisCode>> InsertDiagnosisCodesAsync(List<DiagnosisCode> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.DiagnosisCodes), async () =>
            {
                await _dbContext.DiagnosisCodes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 53. DisabilityCodes
        public async Task<DisabilityCode> InsertDisabilityCodeAsync(DisabilityCode entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.DisabilityCodes), async () =>
            {
                await _dbContext.DisabilityCodes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<DisabilityCode>> InsertDisabilityCodesAsync(List<DisabilityCode> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.DisabilityCodes), async () =>
            {
                await _dbContext.DisabilityCodes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 54. DistrictProgressReportDates
        public async Task<DistrictProgressReportDate> InsertDistrictProgressReportDateAsync(DistrictProgressReportDate entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.DistrictProgressReportDates), async () =>
            {
                await _dbContext.DistrictProgressReportDates.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<DistrictProgressReportDate>> InsertDistrictProgressReportDatesAsync(List<DistrictProgressReportDate> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.DistrictProgressReportDates), async () =>
            {
                await _dbContext.DistrictProgressReportDates.AddRangeAsync(entities);
            });
            return entities;
        }

        // 55. Documents
        public async Task<Document> InsertDocumentAsync(Document entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Documents), async () =>
            {
                await _dbContext.Documents.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Document>> InsertDocumentsAsync(List<Document> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Documents), async () =>
            {
                await _dbContext.Documents.AddRangeAsync(entities);
            });
            return entities;
        }

        // 56. DocumentTypes
        public async Task<DocumentType> InsertDocumentTypeAsync(DocumentType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.DocumentTypes), async () =>
            {
                await _dbContext.DocumentTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<DocumentType>> InsertDocumentTypesAsync(List<DocumentType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.DocumentTypes), async () =>
            {
                await _dbContext.DocumentTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 57. EdiErrorCodeAdminNotifications
        public async Task<EdiErrorCodeAdminNotification> InsertEdiErrorCodeAdminNotificationAsync(EdiErrorCodeAdminNotification entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EdiErrorCodeAdminNotifications), async () =>
            {
                await _dbContext.EdiErrorCodeAdminNotifications.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EdiErrorCodeAdminNotification>> InsertEdiErrorCodeAdminNotificationsAsync(List<EdiErrorCodeAdminNotification> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EdiErrorCodeAdminNotifications), async () =>
            {
                await _dbContext.EdiErrorCodeAdminNotifications.AddRangeAsync(entities);
            });
            return entities;
        }

        // 58. EdiErrorCodes
        public async Task<EdiErrorCode> InsertEdiErrorCodeAsync(EdiErrorCode entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EdiErrorCodes), async () =>
            {
                await _dbContext.EdiErrorCodes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EdiErrorCode>> InsertEdiErrorCodesAsync(List<EdiErrorCode> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EdiErrorCodes), async () =>
            {
                await _dbContext.EdiErrorCodes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 59. EdiFileTypes
        public async Task<EdiFileType> InsertEdiFileTypeAsync(EdiFileType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EdiFileTypes), async () =>
            {
                await _dbContext.EdiFileTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EdiFileType>> InsertEdiFileTypesAsync(List<EdiFileType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EdiFileTypes), async () =>
            {
                await _dbContext.EdiFileTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 60. EdiMetaDatas
        public async Task<EdiMetaData> InsertEdiMetaDataAsync(EdiMetaData entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EdiMetaDatas), async () =>
            {
                await _dbContext.EdiMetaDatas.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EdiMetaData>> InsertEdiMetaDatasAsync(List<EdiMetaData> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EdiMetaDatas), async () =>
            {
                await _dbContext.EdiMetaDatas.AddRangeAsync(entities);
            });
            return entities;
        }

        // 61. EncounterIdentifiers
        public async Task<EncounterIdentifier> InsertEncounterIdentifierAsync(EncounterIdentifier entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterIdentifiers), async () =>
            {
                await _dbContext.EncounterIdentifiers.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EncounterIdentifier>> InsertEncounterIdentifiersAsync(List<EncounterIdentifier> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterIdentifiers), async () =>
            {
                await _dbContext.EncounterIdentifiers.AddRangeAsync(entities);
            });
            return entities;
        }

        // 62. EncounterLocations
        public async Task<EncounterLocation> InsertEncounterLocationAsync(EncounterLocation entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterLocations), async () =>
            {
                await _dbContext.EncounterLocations.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EncounterLocation>> InsertEncounterLocationsAsync(List<EncounterLocation> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterLocations), async () =>
            {
                await _dbContext.EncounterLocations.AddRangeAsync(entities);
            });
            return entities;
        }

        // 63. EncounterReasonForReturn
        public async Task<EncounterReasonForReturn> InsertEncounterReasonForReturnAsync(EncounterReasonForReturn entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterReasonForReturns), async () =>
            {
                await _dbContext.EncounterReasonForReturns.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EncounterReasonForReturn>> InsertEncounterReasonForReturnsAsync(List<EncounterReasonForReturn> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterReasonForReturns), async () =>
            {
                await _dbContext.EncounterReasonForReturns.AddRangeAsync(entities);
            });
            return entities;
        }

        // 64. EncounterReturnReasonCategories
        public async Task<EncounterReturnReasonCategory> InsertEncounterReturnReasonCategoryAsync(EncounterReturnReasonCategory entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterReturnReasonCategories), async () =>
            {
                await _dbContext.EncounterReturnReasonCategories.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EncounterReturnReasonCategory>> InsertEncounterReturnReasonCategoriesAsync(List<EncounterReturnReasonCategory> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterReturnReasonCategories), async () =>
            {
                await _dbContext.EncounterReturnReasonCategories.AddRangeAsync(entities);
            });
            return entities;
        }

        // 65. Encounters
        public async Task<Encounter> InsertEncounterAsync(Encounter entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Encounters), async () =>
            {
                await _dbContext.Encounters.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Encounter>> InsertEncountersAsync(List<Encounter> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Encounters), async () =>
            {
                await _dbContext.Encounters.AddRangeAsync(entities);
            });
            return entities;
        }

        // 66. EncounterStatuses
        public async Task<EncounterStatus> InsertEncounterStatusAsync(EncounterStatus entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterStatuses), async () =>
            {
                await _dbContext.EncounterStatuses.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EncounterStatus>> InsertEncounterStatusesAsync(List<EncounterStatus> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterStatuses), async () =>
            {
                await _dbContext.EncounterStatuses.AddRangeAsync(entities);
            });
            return entities;
        }

        // 67. EncounterStudentCptCodes
        public async Task<EncounterStudentCptCode> InsertEncounterStudentCptCodeAsync(EncounterStudentCptCode entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterStudentCptCodes), async () =>
            {
                await _dbContext.EncounterStudentCptCodes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EncounterStudentCptCode>> InsertEncounterStudentCptCodesAsync(List<EncounterStudentCptCode> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterStudentCptCodes), async () =>
            {
                await _dbContext.EncounterStudentCptCodes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 68. EncounterStudentGoals
        public async Task<EncounterStudentGoal> InsertEncounterStudentGoalAsync(EncounterStudentGoal entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterStudentGoals), async () =>
            {
                await _dbContext.EncounterStudentGoals.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EncounterStudentGoal>> InsertEncounterStudentGoalsAsync(List<EncounterStudentGoal> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterStudentGoals), async () =>
            {
                await _dbContext.EncounterStudentGoals.AddRangeAsync(entities);
            });
            return entities;
        }

        // 69. EncounterStudentMethods
        public async Task<EncounterStudentMethod> InsertEncounterStudentMethodAsync(EncounterStudentMethod entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterStudentMethods), async () =>
            {
                await _dbContext.EncounterStudentMethods.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EncounterStudentMethod>> InsertEncounterStudentMethodsAsync(List<EncounterStudentMethod> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterStudentMethods), async () =>
            {
                await _dbContext.EncounterStudentMethods.AddRangeAsync(entities);
            });
            return entities;
        }

        // 70. EncounterStudents
        public async Task<EncounterStudent> InsertEncounterStudentAsync(EncounterStudent entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterStudents), async () =>
            {
                await _dbContext.EncounterStudents.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EncounterStudent>> InsertEncounterStudentsAsync(List<EncounterStudent> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterStudents), async () =>
            {
                await _dbContext.EncounterStudents.AddRangeAsync(entities);
            });
            return entities;
        }

        // 71. EncounterStudentStatuses
        public async Task<EncounterStudentStatus> InsertEncounterStudentStatusAsync(EncounterStudentStatus entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterStudentStatuses), async () =>
            {
                await _dbContext.EncounterStudentStatuses.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EncounterStudentStatus>> InsertEncounterStudentStatusesAsync(List<EncounterStudentStatus> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EncounterStudentStatuses), async () =>
            {
                await _dbContext.EncounterStudentStatuses.AddRangeAsync(entities);
            });
            return entities;
        }

        // 72. Escs
        public async Task<Esc> InsertEscAsync(Esc entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Escs), async () =>
            {
                await _dbContext.Escs.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Esc>> InsertEscsAsync(List<Esc> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Escs), async () =>
            {
                await _dbContext.Escs.AddRangeAsync(entities);
            });
            return entities;
        }

        // 73. EscSchoolDistricts
        public async Task<EscSchoolDistrict> InsertEscSchoolDistrictAsync(EscSchoolDistrict entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EscSchoolDistricts), async () =>
            {
                await _dbContext.EscSchoolDistricts.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EscSchoolDistrict>> InsertEscSchoolDistrictsAsync(List<EscSchoolDistrict> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EscSchoolDistricts), async () =>
            {
                await _dbContext.EscSchoolDistricts.AddRangeAsync(entities);
            });
            return entities;
        }

        // 74. ESignatureContents
        public async Task<EsignatureContent> InsertEsignatureContentAsync(EsignatureContent entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EsignatureContents), async () =>
            {
                await _dbContext.EsignatureContents.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EsignatureContent>> InsertEsignatureContentsAsync(List<EsignatureContent> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EsignatureContents), async () =>
            {
                await _dbContext.EsignatureContents.AddRangeAsync(entities);
            });
            return entities;
        }

        // 75. EvaluationTypes
        public async Task<EvaluationType> InsertEvaluationTypeAsync(EvaluationType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EvaluationTypes), async () =>
            {
                await _dbContext.EvaluationTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EvaluationType>> InsertEvaluationTypesAsync(List<EvaluationType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EvaluationTypes), async () =>
            {
                await _dbContext.EvaluationTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 76. EvaluationTypesDiagnosisCodes
        public async Task<EvaluationTypesDiagnosisCode> InsertEvaluationTypesDiagnosisCodeAsync(EvaluationTypesDiagnosisCode entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EvaluationTypesDiagnosisCodes), async () =>
            {
                await _dbContext.EvaluationTypesDiagnosisCodes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<EvaluationTypesDiagnosisCode>> InsertEvaluationTypesDiagnosisCodesAsync(List<EvaluationTypesDiagnosisCode> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.EvaluationTypesDiagnosisCodes), async () =>
            {
                await _dbContext.EvaluationTypesDiagnosisCodes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 77. Goals
        public async Task<Goal> InsertGoalAsync(Goal entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Goals), async () =>
            {
                await _dbContext.Goals.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Goal>> InsertGoalsAsync(List<Goal> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Goals), async () =>
            {
                await _dbContext.Goals.AddRangeAsync(entities);
            });
            return entities;
        }

        // 78. GoalServiceCodes
        //public async Task<GoalServiceCode> InsertGoalServiceCodeAsync(GoalServiceCode entity)
        //{
        //    await WithIdentityInsert(nameof(EdudocSqlContext.GoalServiceCodes), async () =>
        //    {
        //        await _dbContext.GoalServiceCodes.AddAsync(entity);
        //    });
        //    return entity;
        //}
        //public async Task<List<GoalServiceCode>> InsertGoalServiceCodesAsync(List<GoalServiceCode> entities)
        //{
        //    await WithIdentityInsert(nameof(EdudocSqlContext.GoalServiceCodes), async () =>
        //    {
        //        await _dbContext.GoalServiceCodes.AddRangeAsync(entities);
        //    });
        //    return entities;
        //}

        // 79. HealthCareClaims
        public async Task<HealthCareClaim> InsertHealthCareClaimAsync(HealthCareClaim entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.HealthCareClaims), async () =>
            {
                await _dbContext.HealthCareClaims.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<HealthCareClaim>> InsertHealthCareClaimsAsync(List<HealthCareClaim> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.HealthCareClaims), async () =>
            {
                await _dbContext.HealthCareClaims.AddRangeAsync(entities);
            });
            return entities;
        }

        // 80. IEPServices
        public async Task<Iepservice> InsertIepserviceAsync(Iepservice entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Iepservices), async () =>
            {
                await _dbContext.Iepservices.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Iepservice>> InsertIepservicesAsync(List<Iepservice> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Iepservices), async () =>
            {
                await _dbContext.Iepservices.AddRangeAsync(entities);
            });
            return entities;
        }

        // 81. Images
        public async Task<Image> InsertImageAsync(Image entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Images), async () =>
            {
                await _dbContext.Images.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Image>> InsertImagesAsync(List<Image> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Images), async () =>
            {
                await _dbContext.Images.AddRangeAsync(entities);
            });
            return entities;
        }

        // 82. ImpersonationLogs
        public async Task<ImpersonationLog> InsertImpersonationLogAsync(ImpersonationLog entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ImpersonationLogs), async () =>
            {
                await _dbContext.ImpersonationLogs.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ImpersonationLog>> InsertImpersonationLogsAsync(List<ImpersonationLog> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ImpersonationLogs), async () =>
            {
                await _dbContext.ImpersonationLogs.AddRangeAsync(entities);
            });
            return entities;
        }

        // 83. JobsAudit
        public async Task<JobsAudit> InsertJobsAuditAsync(JobsAudit entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.JobsAudits), async () =>
            {
                await _dbContext.JobsAudits.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<JobsAudit>> InsertJobsAuditsAsync(List<JobsAudit> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.JobsAudits), async () =>
            {
                await _dbContext.JobsAudits.AddRangeAsync(entities);
            });
            return entities;
        }

        // 84. LogMetadata
        public async Task<LogMetadatum> InsertLogMetadatumAsync(LogMetadatum entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.LogMetadata), async () =>
            {
                await _dbContext.LogMetadata.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<LogMetadatum>> InsertLogMetadataAsync(List<LogMetadatum> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.LogMetadata), async () =>
            {
                await _dbContext.LogMetadata.AddRangeAsync(entities);
            });
            return entities;
        }

        // 85. MergedStudents
        public async Task<MergedStudent> InsertMergedStudentAsync(MergedStudent entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.MergedStudents), async () =>
            {
                await _dbContext.MergedStudents.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<MergedStudent>> InsertMergedStudentsAsync(List<MergedStudent> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.MergedStudents), async () =>
            {
                await _dbContext.MergedStudents.AddRangeAsync(entities);
            });
            return entities;
        }

        // 86. MessageDocuments
        public async Task<MessageDocument> InsertMessageDocumentAsync(MessageDocument entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.MessageDocuments), async () =>
            {
                await _dbContext.MessageDocuments.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<MessageDocument>> InsertMessageDocumentsAsync(List<MessageDocument> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.MessageDocuments), async () =>
            {
                await _dbContext.MessageDocuments.AddRangeAsync(entities);
            });
            return entities;
        }

        // 87. MessageFilterTypes
        public async Task<MessageFilterType> InsertMessageFilterTypeAsync(MessageFilterType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.MessageFilterTypes), async () =>
            {
                await _dbContext.MessageFilterTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<MessageFilterType>> InsertMessageFilterTypesAsync(List<MessageFilterType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.MessageFilterTypes), async () =>
            {
                await _dbContext.MessageFilterTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 88. MessageLinks
        public async Task<MessageLink> InsertMessageLinkAsync(MessageLink entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.MessageLinks), async () =>
            {
                await _dbContext.MessageLinks.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<MessageLink>> InsertMessageLinksAsync(List<MessageLink> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.MessageLinks), async () =>
            {
                await _dbContext.MessageLinks.AddRangeAsync(entities);
            });
            return entities;
        }

        // 89. Messages
        public async Task<Message> InsertMessageAsync(Message entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Messages), async () =>
            {
                await _dbContext.Messages.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Message>> InsertMessagesAsync(List<Message> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Messages), async () =>
            {
                await _dbContext.Messages.AddRangeAsync(entities);
            });
            return entities;
        }

        // 90. Methods
        public async Task<Method> InsertMethodAsync(Method entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Methods), async () =>
            {
                await _dbContext.Methods.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Method>> InsertMethodsAsync(List<Method> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Methods), async () =>
            {
                await _dbContext.Methods.AddRangeAsync(entities);
            });
            return entities;
        }

        // 91. Migration_ProviderCaseNotesHistory
        public async Task<MigrationProviderCaseNotesHistory> InsertMigrationProviderCaseNotesHistoryAsync(MigrationProviderCaseNotesHistory entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.MigrationProviderCaseNotesHistories), async () =>
            {
                await _dbContext.MigrationProviderCaseNotesHistories.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<MigrationProviderCaseNotesHistory>> InsertMigrationProviderCaseNotesHistoriesAsync(List<MigrationProviderCaseNotesHistory> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.MigrationProviderCaseNotesHistories), async () =>
            {
                await _dbContext.MigrationProviderCaseNotesHistories.AddRangeAsync(entities);
            });
            return entities;
        }

        // 92. NonMspServices
        public async Task<NonMspService> InsertNonMspServiceAsync(NonMspService entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.NonMspServices), async () =>
            {
                await _dbContext.NonMspServices.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<NonMspService>> InsertNonMspServicesAsync(List<NonMspService> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.NonMspServices), async () =>
            {
                await _dbContext.NonMspServices.AddRangeAsync(entities);
            });
            return entities;
        }

        // 93. Notes
        public async Task<Note> InsertNoteAsync(Note entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Notes), async () =>
            {
                await _dbContext.Notes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Note>> InsertNotesAsync(List<Note> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Notes), async () =>
            {
                await _dbContext.Notes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 94. NursingGoalResponse
        public async Task<NursingGoalResponse> InsertNursingGoalResponseAsync(NursingGoalResponse entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.NursingGoalResponses), async () =>
            {
                await _dbContext.NursingGoalResponses.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<NursingGoalResponse>> InsertNursingGoalResponsesAsync(List<NursingGoalResponse> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.NursingGoalResponses), async () =>
            {
                await _dbContext.NursingGoalResponses.AddRangeAsync(entities);
            });
            return entities;
        }

        // 95. NursingGoalResponseResults
        //public async Task<NursingGoalResponseResult> InsertNursingGoalResponseResultAsync(NursingGoalResponseResult entity)
        //{
        //    await WithIdentityInsert(nameof(EdudocSqlContext.NursingGoalResponseResults), async () =>
        //    {
        //        await _dbContext.NursingGoalResponseResults.AddAsync(entity);
        //    });
        //    return entity;
        //}
        //public async Task<List<NursingGoalResponseResult>> InsertNursingGoalResponseResultsAsync(List<NursingGoalResponseResult> entities)
        //{
        //    await WithIdentityInsert(nameof(EdudocSqlContext.NursingGoalResponseResults), async () =>
        //    {
        //        await _dbContext.NursingGoalResponseResults.AddRangeAsync(entities);
        //    });
        //    return entities;
        //}

        // 96. NursingGoalResults
        public async Task<NursingGoalResult> InsertNursingGoalResultAsync(NursingGoalResult entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.NursingGoalResults), async () =>
            {
                await _dbContext.NursingGoalResults.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<NursingGoalResult>> InsertNursingGoalResultsAsync(List<NursingGoalResult> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.NursingGoalResults), async () =>
            {
                await _dbContext.NursingGoalResults.AddRangeAsync(entities);
            });
            return entities;
        }

        // 97. PendingReferralReportJobRuns
        public async Task<PendingReferralReportJobRun> InsertPendingReferralReportJobRunAsync(PendingReferralReportJobRun entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.PendingReferralReportJobRuns), async () =>
            {
                await _dbContext.PendingReferralReportJobRuns.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<PendingReferralReportJobRun>> InsertPendingReferralReportJobRunsAsync(List<PendingReferralReportJobRun> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.PendingReferralReportJobRuns), async () =>
            {
                await _dbContext.PendingReferralReportJobRuns.AddRangeAsync(entities);
            });
            return entities;
        }

        // 98. PendingReferrals
        public async Task<PendingReferral> InsertPendingReferralAsync(PendingReferral entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.PendingReferrals), async () =>
            {
                await _dbContext.PendingReferrals.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<PendingReferral>> InsertPendingReferralsAsync(List<PendingReferral> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.PendingReferrals), async () =>
            {
                await _dbContext.PendingReferrals.AddRangeAsync(entities);
            });
            return entities;
        }

        // 99. PhoneTypes
        public async Task<PhoneType> InsertPhoneTypeAsync(PhoneType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.PhoneTypes), async () =>
            {
                await _dbContext.PhoneTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<PhoneType>> InsertPhoneTypesAsync(List<PhoneType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.PhoneTypes), async () =>
            {
                await _dbContext.PhoneTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 100. ProgressReports
        public async Task<ProgressReport> InsertProgressReportAsync(ProgressReport entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProgressReports), async () =>
            {
                await _dbContext.ProgressReports.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProgressReport>> InsertProgressReportsAsync(List<ProgressReport> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProgressReports), async () =>
            {
                await _dbContext.ProgressReports.AddRangeAsync(entities);
            });
            return entities;
        }

        // 101. ProviderAcknowledgmentLogs
        public async Task<ProviderAcknowledgmentLog> InsertProviderAcknowledgmentLogAsync(ProviderAcknowledgmentLog entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderAcknowledgmentLogs), async () =>
            {
                await _dbContext.ProviderAcknowledgmentLogs.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderAcknowledgmentLog>> InsertProviderAcknowledgmentLogsAsync(List<ProviderAcknowledgmentLog> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderAcknowledgmentLogs), async () =>
            {
                await _dbContext.ProviderAcknowledgmentLogs.AddRangeAsync(entities);
            });
            return entities;
        }

        // 102. ProviderCaseUploadDocuments
        public async Task<ProviderCaseUploadDocument> InsertProviderCaseUploadDocumentAsync(ProviderCaseUploadDocument entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderCaseUploadDocuments), async () =>
            {
                await _dbContext.ProviderCaseUploadDocuments.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderCaseUploadDocument>> InsertProviderCaseUploadDocumentsAsync(List<ProviderCaseUploadDocument> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderCaseUploadDocuments), async () =>
            {
                await _dbContext.ProviderCaseUploadDocuments.AddRangeAsync(entities);
            });
            return entities;
        }

        // 103. ProviderCaseUploads
        public async Task<ProviderCaseUpload> InsertProviderCaseUploadAsync(ProviderCaseUpload entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderCaseUploads), async () =>
            {
                await _dbContext.ProviderCaseUploads.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderCaseUpload>> InsertProviderCaseUploadsAsync(List<ProviderCaseUpload> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderCaseUploads), async () =>
            {
                await _dbContext.ProviderCaseUploads.AddRangeAsync(entities);
            });
            return entities;
        }

        // 104. ProviderDoNotBillReasons
        public async Task<ProviderDoNotBillReason> InsertProviderDoNotBillReasonAsync(ProviderDoNotBillReason entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderDoNotBillReasons), async () =>
            {
                await _dbContext.ProviderDoNotBillReasons.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderDoNotBillReason>> InsertProviderDoNotBillReasonsAsync(List<ProviderDoNotBillReason> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderDoNotBillReasons), async () =>
            {
                await _dbContext.ProviderDoNotBillReasons.AddRangeAsync(entities);
            });
            return entities;
        }

        // 105. ProviderEmploymentTypes
        public async Task<ProviderEmploymentType> InsertProviderEmploymentTypeAsync(ProviderEmploymentType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderEmploymentTypes), async () =>
            {
                await _dbContext.ProviderEmploymentTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderEmploymentType>> InsertProviderEmploymentTypesAsync(List<ProviderEmploymentType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderEmploymentTypes), async () =>
            {
                await _dbContext.ProviderEmploymentTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 106. ProviderEscAssignments
        public async Task<ProviderEscAssignment> InsertProviderEscAssignmentAsync(ProviderEscAssignment entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderEscAssignments), async () =>
            {
                await _dbContext.ProviderEscAssignments.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderEscAssignment>> InsertProviderEscAssignmentsAsync(List<ProviderEscAssignment> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderEscAssignments), async () =>
            {
                await _dbContext.ProviderEscAssignments.AddRangeAsync(entities);
            });
            return entities;
        }

        // 107. ProviderEscSchoolDistricts
        public async Task<ProviderEscSchoolDistrict> InsertProviderEscSchoolDistrictAsync(ProviderEscSchoolDistrict entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderEscSchoolDistricts), async () =>
            {
                await _dbContext.ProviderEscSchoolDistricts.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderEscSchoolDistrict>> InsertProviderEscSchoolDistrictsAsync(List<ProviderEscSchoolDistrict> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderEscSchoolDistricts), async () =>
            {
                await _dbContext.ProviderEscSchoolDistricts.AddRangeAsync(entities);
            });
            return entities;
        }

        // 108. ProviderInactivityDates
        public async Task<ProviderInactivityDate> InsertProviderInactivityDateAsync(ProviderInactivityDate entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderInactivityDates), async () =>
            {
                await _dbContext.ProviderInactivityDates.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderInactivityDate>> InsertProviderInactivityDatesAsync(List<ProviderInactivityDate> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderInactivityDates), async () =>
            {
                await _dbContext.ProviderInactivityDates.AddRangeAsync(entities);
            });
            return entities;
        }

        // 109. ProviderInactivityReasons
        public async Task<ProviderInactivityReason> InsertProviderInactivityReasonAsync(ProviderInactivityReason entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderInactivityReasons), async () =>
            {
                await _dbContext.ProviderInactivityReasons.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderInactivityReason>> InsertProviderInactivityReasonsAsync(List<ProviderInactivityReason> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderInactivityReasons), async () =>
            {
                await _dbContext.ProviderInactivityReasons.AddRangeAsync(entities);
            });
            return entities;
        }

        // 110. ProviderLicenses
        public async Task<ProviderLicense> InsertProviderLicenseAsync(ProviderLicense entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderLicenses), async () =>
            {
                await _dbContext.ProviderLicenses.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderLicense>> InsertProviderLicensesAsync(List<ProviderLicense> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderLicenses), async () =>
            {
                await _dbContext.ProviderLicenses.AddRangeAsync(entities);
            });
            return entities;
        }

        // 111. ProviderODECertifications
        public async Task<ProviderOdecertification> InsertProviderOdecertificationAsync(ProviderOdecertification entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderOdecertifications), async () =>
            {
                await _dbContext.ProviderOdecertifications.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderOdecertification>> InsertProviderOdecertificationsAsync(List<ProviderOdecertification> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderOdecertifications), async () =>
            {
                await _dbContext.ProviderOdecertifications.AddRangeAsync(entities);
            });
            return entities;
        }

        // 112. Providers
        public async Task<Provider> InsertProviderAsync(Provider entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Providers), async () =>
            {
                await _dbContext.Providers.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Provider>> InsertProvidersAsync(List<Provider> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Providers), async () =>
            {
                await _dbContext.Providers.AddRangeAsync(entities);
            });
            return entities;
        }

        // 113. ProviderStudentHistories
        public async Task<ProviderStudentHistory> InsertProviderStudentHistoryAsync(ProviderStudentHistory entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderStudentHistories), async () =>
            {
                await _dbContext.ProviderStudentHistories.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderStudentHistory>> InsertProviderStudentHistoriesAsync(List<ProviderStudentHistory> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderStudentHistories), async () =>
            {
                await _dbContext.ProviderStudentHistories.AddRangeAsync(entities);
            });
            return entities;
        }

        // 114. ProviderStudents
        public async Task<ProviderStudent> InsertProviderStudentAsync(ProviderStudent entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderStudents), async () =>
            {
                await _dbContext.ProviderStudents.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderStudent>> InsertProviderStudentsAsync(List<ProviderStudent> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderStudents), async () =>
            {
                await _dbContext.ProviderStudents.AddRangeAsync(entities);
            });
            return entities;
        }

        // 115. ProviderStudentSupervisors
        public async Task<ProviderStudentSupervisor> InsertProviderStudentSupervisorAsync(ProviderStudentSupervisor entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderStudentSupervisors), async () =>
            {
                await _dbContext.ProviderStudentSupervisors.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderStudentSupervisor>> InsertProviderStudentSupervisorsAsync(List<ProviderStudentSupervisor> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderStudentSupervisors), async () =>
            {
                await _dbContext.ProviderStudentSupervisors.AddRangeAsync(entities);
            });
            return entities;
        }

        // 116. ProviderTitles
        public async Task<ProviderTitle> InsertProviderTitleAsync(ProviderTitle entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderTitles), async () =>
            {
                await _dbContext.ProviderTitles.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderTitle>> InsertProviderTitlesAsync(List<ProviderTitle> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderTitles), async () =>
            {
                await _dbContext.ProviderTitles.AddRangeAsync(entities);
            });
            return entities;
        }

        // 117. ProviderTrainings
        public async Task<ProviderTraining> InsertProviderTrainingAsync(ProviderTraining entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderTrainings), async () =>
            {
                await _dbContext.ProviderTrainings.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ProviderTraining>> InsertProviderTrainingsAsync(List<ProviderTraining> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ProviderTrainings), async () =>
            {
                await _dbContext.ProviderTrainings.AddRangeAsync(entities);
            });
            return entities;
        }

        // 118. ReadMessages
        public async Task<ReadMessage> InsertReadMessageAsync(ReadMessage entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ReadMessages), async () =>
            {
                await _dbContext.ReadMessages.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ReadMessage>> InsertReadMessagesAsync(List<ReadMessage> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ReadMessages), async () =>
            {
                await _dbContext.ReadMessages.AddRangeAsync(entities);
            });
            return entities;
        }

        // 119. RevokeAccess
        public async Task<RevokeAccess> InsertRevokeAccessAsync(RevokeAccess entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.RevokeAccesses), async () =>
            {
                await _dbContext.RevokeAccesses.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<RevokeAccess>> InsertRevokeAccessesAsync(List<RevokeAccess> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.RevokeAccesses), async () =>
            {
                await _dbContext.RevokeAccesses.AddRangeAsync(entities);
            });
            return entities;
        }

        // 120. RosterValidationDistricts
        public async Task<RosterValidationDistrict> InsertRosterValidationDistrictAsync(RosterValidationDistrict entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.RosterValidationDistricts), async () =>
            {
                await _dbContext.RosterValidationDistricts.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<RosterValidationDistrict>> InsertRosterValidationDistrictsAsync(List<RosterValidationDistrict> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.RosterValidationDistricts), async () =>
            {
                await _dbContext.RosterValidationDistricts.AddRangeAsync(entities);
            });
            return entities;
        }

        // 121. RosterValidationFiles
        public async Task<RosterValidationFile> InsertRosterValidationFileAsync(RosterValidationFile entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.RosterValidationFiles), async () =>
            {
                await _dbContext.RosterValidationFiles.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<RosterValidationFile>> InsertRosterValidationFilesAsync(List<RosterValidationFile> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.RosterValidationFiles), async () =>
            {
                await _dbContext.RosterValidationFiles.AddRangeAsync(entities);
            });
            return entities;
        }

        // 122. RosterValidationResponseFiles
        public async Task<RosterValidationResponseFile> InsertRosterValidationResponseFileAsync(RosterValidationResponseFile entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.RosterValidationResponseFiles), async () =>
            {
                await _dbContext.RosterValidationResponseFiles.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<RosterValidationResponseFile>> InsertRosterValidationResponseFilesAsync(List<RosterValidationResponseFile> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.RosterValidationResponseFiles), async () =>
            {
                await _dbContext.RosterValidationResponseFiles.AddRangeAsync(entities);
            });
            return entities;
        }

        // 123. RosterValidations
        public async Task<RosterValidation> InsertRosterValidationAsync(RosterValidation entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.RosterValidations), async () =>
            {
                await _dbContext.RosterValidations.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<RosterValidation>> InsertRosterValidationsAsync(List<RosterValidation> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.RosterValidations), async () =>
            {
                await _dbContext.RosterValidations.AddRangeAsync(entities);
            });
            return entities;
        }

        // 124. RosterValidationStudents
        public async Task<RosterValidationStudent> InsertRosterValidationStudentAsync(RosterValidationStudent entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.RosterValidationStudents), async () =>
            {
                await _dbContext.RosterValidationStudents.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<RosterValidationStudent>> InsertRosterValidationStudentsAsync(List<RosterValidationStudent> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.RosterValidationStudents), async () =>
            {
                await _dbContext.RosterValidationStudents.AddRangeAsync(entities);
            });
            return entities;
        }

        // 125. SchoolDistrictAdmins
        public async Task<AdminSchoolDistrict> InsertSchoolDistrictAdminAsync(AdminSchoolDistrict entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AdminSchoolDistricts), async () =>
            {
                await _dbContext.AdminSchoolDistricts.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<AdminSchoolDistrict>> InsertSchoolDistrictAdminsAsync(List<AdminSchoolDistrict> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.AdminSchoolDistricts), async () =>
            {
                await _dbContext.AdminSchoolDistricts.AddRangeAsync(entities);
            });
            return entities;
        }

        // 126. SchoolDistrictContacts
        //public async Task<SchoolDistrictContact> InsertSchoolDistrictContactAsync(SchoolDistrictContact entity)
        //{
        //    await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictContacts), async () =>
        //    {
        //        await _dbContext.SchoolDistrictContacts.AddAsync(entity);
        //    });
        //    return entity;
        //}
        //public async Task<List<SchoolDistrictContact>> InsertSchoolDistrictContactsAsync(List<SchoolDistrictContact> entities)
        //{
        //    await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictContacts), async () =>
        //    {
        //        await _dbContext.SchoolDistrictContacts.AddRangeAsync(entities);
        //    });
        //    return entities;
        //}

        // 127. SchoolDistrictProviderCaseNotes
        public async Task<SchoolDistrictProviderCaseNote> InsertSchoolDistrictProviderCaseNoteAsync(SchoolDistrictProviderCaseNote entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictProviderCaseNotes), async () =>
            {
                await _dbContext.SchoolDistrictProviderCaseNotes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<SchoolDistrictProviderCaseNote>> InsertSchoolDistrictProviderCaseNotesAsync(List<SchoolDistrictProviderCaseNote> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictProviderCaseNotes), async () =>
            {
                await _dbContext.SchoolDistrictProviderCaseNotes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 128. SchoolDistrictRosterDocuments
        public async Task<SchoolDistrictRosterDocument> InsertSchoolDistrictRosterDocumentAsync(SchoolDistrictRosterDocument entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictRosterDocuments), async () =>
            {
                await _dbContext.SchoolDistrictRosterDocuments.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<SchoolDistrictRosterDocument>> InsertSchoolDistrictRosterDocumentsAsync(List<SchoolDistrictRosterDocument> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictRosterDocuments), async () =>
            {
                await _dbContext.SchoolDistrictRosterDocuments.AddRangeAsync(entities);
            });
            return entities;
        }

        // 129. SchoolDistrictRosters
        public async Task<SchoolDistrictRoster> InsertSchoolDistrictRosterAsync(SchoolDistrictRoster entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictRosters), async () =>
            {
                await _dbContext.SchoolDistrictRosters.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<SchoolDistrictRoster>> InsertSchoolDistrictRostersAsync(List<SchoolDistrictRoster> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictRosters), async () =>
            {
                await _dbContext.SchoolDistrictRosters.AddRangeAsync(entities);
            });
            return entities;
        }

        // 130. SchoolDistricts
        public async Task<SchoolDistrict> InsertSchoolDistrictAsync(SchoolDistrict entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistricts), async () =>
            {
                await _dbContext.SchoolDistricts.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<SchoolDistrict>> InsertSchoolDistrictsAsync(List<SchoolDistrict> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistricts), async () =>
            {
                await _dbContext.SchoolDistricts.AddRangeAsync(entities);
            });
            return entities;
        }

        // 131. SchoolDistrictsAccountAssistants
        public async Task<SchoolDistrictsAccountAssistant> InsertSchoolDistrictsAccountAssistantAsync(SchoolDistrictsAccountAssistant entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictsAccountAssistants), async () =>
            {
                await _dbContext.SchoolDistrictsAccountAssistants.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<SchoolDistrictsAccountAssistant>> InsertSchoolDistrictsAccountAssistantsAsync(List<SchoolDistrictsAccountAssistant> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictsAccountAssistants), async () =>
            {
                await _dbContext.SchoolDistrictsAccountAssistants.AddRangeAsync(entities);
            });
            return entities;
        }

        // 132. SchoolDistrictsFinancialReps
        public async Task<SchoolDistrictsFinancialRep> InsertSchoolDistrictsFinancialRepAsync(SchoolDistrictsFinancialRep entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictsFinancialReps), async () =>
            {
                await _dbContext.SchoolDistrictsFinancialReps.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<SchoolDistrictsFinancialRep>> InsertSchoolDistrictsFinancialRepsAsync(List<SchoolDistrictsFinancialRep> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictsFinancialReps), async () =>
            {
                await _dbContext.SchoolDistrictsFinancialReps.AddRangeAsync(entities);
            });
            return entities;
        }

        // 133. SchoolDistrictsSchools
        public async Task<SchoolDistrictsSchool> InsertSchoolDistrictsSchoolAsync(SchoolDistrictsSchool entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictsSchools), async () =>
            {
                await _dbContext.SchoolDistrictsSchools.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<SchoolDistrictsSchool>> InsertSchoolDistrictsSchoolsAsync(List<SchoolDistrictsSchool> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SchoolDistrictsSchools), async () =>
            {
                await _dbContext.SchoolDistrictsSchools.AddRangeAsync(entities);
            });
            return entities;
        }

        // 134. Schools
        public async Task<School> InsertSchoolAsync(School entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Schools), async () =>
            {
                await _dbContext.Schools.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<School>> InsertSchoolsAsync(List<School> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Schools), async () =>
            {
                await _dbContext.Schools.AddRangeAsync(entities);
            });
            return entities;
        }

        // 135. ServiceCodes
        public async Task<ServiceCode> InsertServiceCodeAsync(ServiceCode entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ServiceCodes), async () =>
            {
                await _dbContext.ServiceCodes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ServiceCode>> InsertServiceCodesAsync(List<ServiceCode> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ServiceCodes), async () =>
            {
                await _dbContext.ServiceCodes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 136. ServiceOutcomes
        public async Task<ServiceOutcome> InsertServiceOutcomeAsync(ServiceOutcome entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ServiceOutcomes), async () =>
            {
                await _dbContext.ServiceOutcomes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ServiceOutcome>> InsertServiceOutcomesAsync(List<ServiceOutcome> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ServiceOutcomes), async () =>
            {
                await _dbContext.ServiceOutcomes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 137. ServiceTypes
        public async Task<ServiceType> InsertServiceTypeAsync(ServiceType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ServiceTypes), async () =>
            {
                await _dbContext.ServiceTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ServiceType>> InsertServiceTypesAsync(List<ServiceType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ServiceTypes), async () =>
            {
                await _dbContext.ServiceTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 138. ServiceUnitRules
        public async Task<ServiceUnitRule> InsertServiceUnitRuleAsync(ServiceUnitRule entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ServiceUnitRules), async () =>
            {
                await _dbContext.ServiceUnitRules.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ServiceUnitRule>> InsertServiceUnitRulesAsync(List<ServiceUnitRule> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ServiceUnitRules), async () =>
            {
                await _dbContext.ServiceUnitRules.AddRangeAsync(entities);
            });
            return entities;
        }

        // 139. ServiceUnitTimeSegments
        public async Task<ServiceUnitTimeSegment> InsertServiceUnitTimeSegmentAsync(ServiceUnitTimeSegment entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ServiceUnitTimeSegments), async () =>
            {
                await _dbContext.ServiceUnitTimeSegments.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<ServiceUnitTimeSegment>> InsertServiceUnitTimeSegmentsAsync(List<ServiceUnitTimeSegment> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.ServiceUnitTimeSegments), async () =>
            {
                await _dbContext.ServiceUnitTimeSegments.AddRangeAsync(entities);
            });
            return entities;
        }

        // 140. Settings
        public async Task<Setting> InsertSettingAsync(Setting entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Settings), async () =>
            {
                await _dbContext.Settings.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Setting>> InsertSettingsAsync(List<Setting> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Settings), async () =>
            {
                await _dbContext.Settings.AddRangeAsync(entities);
            });
            return entities;
        }

        // 141. States
        public async Task<State> InsertStateAsync(State entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.States), async () =>
            {
                await _dbContext.States.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<State>> InsertStatesAsync(List<State> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.States), async () =>
            {
                await _dbContext.States.AddRangeAsync(entities);
            });
            return entities;
        }

        // 142. StudentDeviationReasons
        public async Task<StudentDeviationReason> InsertStudentDeviationReasonAsync(StudentDeviationReason entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentDeviationReasons), async () =>
            {
                await _dbContext.StudentDeviationReasons.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<StudentDeviationReason>> InsertStudentDeviationReasonsAsync(List<StudentDeviationReason> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentDeviationReasons), async () =>
            {
                await _dbContext.StudentDeviationReasons.AddRangeAsync(entities);
            });
            return entities;
        }

        // 143. StudentDisabilityCodes
        public async Task<StudentDisabilityCode> InsertStudentDisabilityCodeAsync(StudentDisabilityCode entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentDisabilityCodes), async () =>
            {
                await _dbContext.StudentDisabilityCodes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<StudentDisabilityCode>> InsertStudentDisabilityCodesAsync(List<StudentDisabilityCode> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentDisabilityCodes), async () =>
            {
                await _dbContext.StudentDisabilityCodes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 144. StudentDistrictWithdrawals
        public async Task<StudentDistrictWithdrawal> InsertStudentDistrictWithdrawalAsync(StudentDistrictWithdrawal entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentDistrictWithdrawals), async () =>
            {
                await _dbContext.StudentDistrictWithdrawals.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<StudentDistrictWithdrawal>> InsertStudentDistrictWithdrawalsAsync(List<StudentDistrictWithdrawal> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentDistrictWithdrawals), async () =>
            {
                await _dbContext.StudentDistrictWithdrawals.AddRangeAsync(entities);
            });
            return entities;
        }

        // 145. StudentParentalConsents
        public async Task<StudentParentalConsent> InsertStudentParentalConsentAsync(StudentParentalConsent entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentParentalConsents), async () =>
            {
                await _dbContext.StudentParentalConsents.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<StudentParentalConsent>> InsertStudentParentalConsentsAsync(List<StudentParentalConsent> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentParentalConsents), async () =>
            {
                await _dbContext.StudentParentalConsents.AddRangeAsync(entities);
            });
            return entities;
        }

        // 146. StudentParentalConsentTypes
        public async Task<StudentParentalConsentType> InsertStudentParentalConsentTypeAsync(StudentParentalConsentType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentParentalConsentTypes), async () =>
            {
                await _dbContext.StudentParentalConsentTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<StudentParentalConsentType>> InsertStudentParentalConsentTypesAsync(List<StudentParentalConsentType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentParentalConsentTypes), async () =>
            {
                await _dbContext.StudentParentalConsentTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 147. Students
        public async Task<Student> InsertStudentAsync(Student entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Students), async () =>
            {
                await _dbContext.Students.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Student>> InsertStudentsAsync(List<Student> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Students), async () =>
            {
                await _dbContext.Students.AddRangeAsync(entities);
            });
            return entities;
        }

        // 148. StudentTherapies
        public async Task<StudentTherapy> InsertStudentTherapyAsync(StudentTherapy entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentTherapies), async () =>
            {
                await _dbContext.StudentTherapies.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<StudentTherapy>> InsertStudentTherapiesAsync(List<StudentTherapy> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentTherapies), async () =>
            {
                await _dbContext.StudentTherapies.AddRangeAsync(entities);
            });
            return entities;
        }

        // 149. StudentTherapySchedules
        public async Task<StudentTherapySchedule> InsertStudentTherapyScheduleAsync(StudentTherapySchedule entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentTherapySchedules), async () =>
            {
                await _dbContext.StudentTherapySchedules.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<StudentTherapySchedule>> InsertStudentTherapySchedulesAsync(List<StudentTherapySchedule> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentTherapySchedules), async () =>
            {
                await _dbContext.StudentTherapySchedules.AddRangeAsync(entities);
            });
            return entities;
        }

        // 150. StudentTypes
        public async Task<StudentType> InsertStudentTypeAsync(StudentType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentTypes), async () =>
            {
                await _dbContext.StudentTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<StudentType>> InsertStudentTypesAsync(List<StudentType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.StudentTypes), async () =>
            {
                await _dbContext.StudentTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 151. SupervisorProviderStudentReferalSignOffs
        public async Task<SupervisorProviderStudentReferalSignOff> InsertSupervisorProviderStudentReferalSignOffAsync(SupervisorProviderStudentReferalSignOff entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SupervisorProviderStudentReferalSignOffs), async () =>
            {
                await _dbContext.SupervisorProviderStudentReferalSignOffs.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<SupervisorProviderStudentReferalSignOff>> InsertSupervisorProviderStudentReferalSignOffsAsync(List<SupervisorProviderStudentReferalSignOff> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.SupervisorProviderStudentReferalSignOffs), async () =>
            {
                await _dbContext.SupervisorProviderStudentReferalSignOffs.AddRangeAsync(entities);
            });
            return entities;
        }

        // 152. TherapyCaseNotes
        public async Task<TherapyCaseNote> InsertTherapyCaseNoteAsync(TherapyCaseNote entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.TherapyCaseNotes), async () =>
            {
                await _dbContext.TherapyCaseNotes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<TherapyCaseNote>> InsertTherapyCaseNotesAsync(List<TherapyCaseNote> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.TherapyCaseNotes), async () =>
            {
                await _dbContext.TherapyCaseNotes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 153. TherapyGroups
        public async Task<TherapyGroup> InsertTherapyGroupAsync(TherapyGroup entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.TherapyGroups), async () =>
            {
                await _dbContext.TherapyGroups.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<TherapyGroup>> InsertTherapyGroupsAsync(List<TherapyGroup> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.TherapyGroups), async () =>
            {
                await _dbContext.TherapyGroups.AddRangeAsync(entities);
            });
            return entities;
        }

        // 154. TrainingTypes
        public async Task<TrainingType> InsertTrainingTypeAsync(TrainingType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.TrainingTypes), async () =>
            {
                await _dbContext.TrainingTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<TrainingType>> InsertTrainingTypesAsync(List<TrainingType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.TrainingTypes), async () =>
            {
                await _dbContext.TrainingTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 155. UnmatchedClaimDistricts
        public async Task<UnmatchedClaimDistrict> InsertUnmatchedClaimDistrictAsync(UnmatchedClaimDistrict entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.UnmatchedClaimDistricts), async () =>
            {
                await _dbContext.UnmatchedClaimDistricts.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<UnmatchedClaimDistrict>> InsertUnmatchedClaimDistrictsAsync(List<UnmatchedClaimDistrict> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.UnmatchedClaimDistricts), async () =>
            {
                await _dbContext.UnmatchedClaimDistricts.AddRangeAsync(entities);
            });
            return entities;
        }

        // 156. UnmatchedClaimResponses
        public async Task<UnmatchedClaimResponse> InsertUnmatchedClaimResponseAsync(UnmatchedClaimResponse entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.UnmatchedClaimResponses), async () =>
            {
                await _dbContext.UnmatchedClaimResponses.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<UnmatchedClaimResponse>> InsertUnmatchedClaimResponsesAsync(List<UnmatchedClaimResponse> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.UnmatchedClaimResponses), async () =>
            {
                await _dbContext.UnmatchedClaimResponses.AddRangeAsync(entities);
            });
            return entities;
        }

        // 157. UserDocuments
        //public async Task<UserDocument> InsertUserDocumentAsync(UserDocument entity)
        //{
        //    await WithIdentityInsert(nameof(EdudocSqlContext.UserDocuments), async () =>
        //    {
        //        await _dbContext.UserDocuments.AddAsync(entity);
        //    });
        //    return entity;
        //}
        //public async Task<List<UserDocument>> InsertUserDocumentsAsync(List<UserDocument> entities)
        //{
        //    await WithIdentityInsert(nameof(EdudocSqlContext.UserDocuments), async () =>
        //    {
        //        await _dbContext.UserDocuments.AddRangeAsync(entities);
        //    });
        //    return entities;
        //}

        // 158. UserPhones
        public async Task<UserPhone> InsertUserPhoneAsync(UserPhone entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.UserPhones), async () =>
            {
                await _dbContext.UserPhones.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<UserPhone>> InsertUserPhonesAsync(List<UserPhone> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.UserPhones), async () =>
            {
                await _dbContext.UserPhones.AddRangeAsync(entities);
            });
            return entities;
        }

        // 159. UserRoleClaims
        public async Task<UserRoleClaim> InsertUserRoleClaimAsync(UserRoleClaim entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.UserRoleClaims), async () =>
            {
                await _dbContext.UserRoleClaims.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<UserRoleClaim>> InsertUserRoleClaimsAsync(List<UserRoleClaim> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.UserRoleClaims), async () =>
            {
                await _dbContext.UserRoleClaims.AddRangeAsync(entities);
            });
            return entities;
        }

        // 160. UserRoles
        public async Task<UserRole> InsertUserRoleAsync(UserRole entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.UserRoles), async () =>
            {
                await _dbContext.UserRoles.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<UserRole>> InsertUserRolesAsync(List<UserRole> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.UserRoles), async () =>
            {
                await _dbContext.UserRoles.AddRangeAsync(entities);
            });
            return entities;
        }

        // 161. Users
        public async Task<User> InsertUserAsync(User entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Users), async () =>
            {
                await _dbContext.Users.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<User>> InsertUsersAsync(List<User> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Users), async () =>
            {
                await _dbContext.Users.AddRangeAsync(entities);
            });
            return entities;
        }

        // 162. UserTypes
        public async Task<UserType> InsertUserTypeAsync(UserType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.UserTypes), async () =>
            {
                await _dbContext.UserTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<UserType>> InsertUserTypesAsync(List<UserType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.UserTypes), async () =>
            {
                await _dbContext.UserTypes.AddRangeAsync(entities);
            });
            return entities;
        }

        // 163. UserTypesClaimTypes
        //public async Task<UserTypesClaimType> InsertUserTypesClaimTypeAsync(UserTypesClaimType entity)
        //{
        //    await WithIdentityInsert(nameof(EdudocSqlContext.UserTypesClaimTypes), async () =>
        //    {
        //        await _dbContext.UserTypesClaimTypes.AddAsync(entity);
        //    });
        //    return entity;
        //}
        //public async Task<List<UserTypesClaimType>> InsertUserTypesClaimTypesAsync(List<UserTypesClaimType> entities)
        //{
        //    await WithIdentityInsert(nameof(EdudocSqlContext.UserTypesClaimTypes), async () =>
        //    {
        //        await _dbContext.UserTypesClaimTypes.AddRangeAsync(entities);
        //    });
        //    return entities;
        //}

        // 164. VoucherBillingResponseFiles
        public async Task<VoucherBillingResponseFile> InsertVoucherBillingResponseFileAsync(VoucherBillingResponseFile entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.VoucherBillingResponseFiles), async () =>
            {
                await _dbContext.VoucherBillingResponseFiles.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<VoucherBillingResponseFile>> InsertVoucherBillingResponseFilesAsync(List<VoucherBillingResponseFile> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.VoucherBillingResponseFiles), async () =>
            {
                await _dbContext.VoucherBillingResponseFiles.AddRangeAsync(entities);
            });
            return entities;
        }

        // 165. Vouchers
        public async Task<Voucher> InsertVoucherAsync(Voucher entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Vouchers), async () =>
            {
                await _dbContext.Vouchers.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<Voucher>> InsertVouchersAsync(List<Voucher> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.Vouchers), async () =>
            {
                await _dbContext.Vouchers.AddRangeAsync(entities);
            });
            return entities;
        }

        // 166. VoucherTypes
        public async Task<VoucherType> InsertVoucherTypeAsync(VoucherType entity)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.VoucherTypes), async () =>
            {
                await _dbContext.VoucherTypes.AddAsync(entity);
            });
            return entity;
        }
        public async Task<List<VoucherType>> InsertVoucherTypesAsync(List<VoucherType> entities)
        {
            await WithIdentityInsert(nameof(EdudocSqlContext.VoucherTypes), async () =>
            {
                await _dbContext.VoucherTypes.AddRangeAsync(entities);
            });
            return entities;
        }
    }
} 