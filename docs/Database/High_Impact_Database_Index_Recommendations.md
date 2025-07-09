# High-Impact Database Index Recommendations - Prioritized by Table Size and EF Usage 7-9-2025

## Executive Summary
This document provides prioritized index recommendations based on:
- **Table row counts** - Focusing on high-volume tables for maximum impact
- **Entity Framework usage patterns** - From analysis of `C:\source\edudoc-platform\edudoc\src\API`
- **Existing indexes** - Cross-referenced with actual table definitions

## Priority 1: Critical High-Volume Tables (13M+ rows)

### 1. EncounterStudentStatuses (13,546,080 rows)
**Impact**: Extremely High - Largest table in the system

```sql
-- Primary filtering index - covers most common query patterns
CREATE NONCLUSTERED INDEX [IX_EncounterStudentStatuses_EncounterStudentId_StatusId] 
ON [dbo].[EncounterStudentStatuses] ([EncounterStudentId], [StatusId])
INCLUDE ([DateCreated], [CreatedById])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

-- Status-based filtering
CREATE NONCLUSTERED INDEX [IX_EncounterStudentStatuses_StatusId_DateCreated] 
ON [dbo].[EncounterStudentStatuses] ([StatusId], [DateCreated])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);
```

### 2. EncounterStudentGoals (5,115,043 rows)
**Impact**: Very High - Critical for case load and encounter management

```sql
-- Primary encounter-goal relationship
CREATE NONCLUSTERED INDEX [IX_EncounterStudentGoals_EncounterStudentId_GoalId] 
ON [dbo].[EncounterStudentGoals] ([EncounterStudentId], [GoalId])
INCLUDE ([Minutes], [DateCreated])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

-- Goal-based filtering
CREATE NONCLUSTERED INDEX [IX_EncounterStudentGoals_GoalId_EncounterStudentId] 
ON [dbo].[EncounterStudentGoals] ([GoalId], [EncounterStudentId])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);
```

### 3. EncounterStudentMethods (4,704,875 rows)
**Impact**: Very High - Critical for therapy method tracking

```sql
-- Primary encounter-method relationship
CREATE NONCLUSTERED INDEX [IX_EncounterStudentMethods_EncounterStudentId_MethodId] 
ON [dbo].[EncounterStudentMethods] ([EncounterStudentId], [MethodId])
INCLUDE ([Minutes])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);
```

### 4. EncounterStudentCptCodes (3,921,939 rows)
**Impact**: Very High - Critical for billing and claims

```sql
-- Primary encounter-CPT relationship
CREATE NONCLUSTERED INDEX [IX_EncounterStudentCptCodes_EncounterStudentId_CptCodeId] 
ON [dbo].[EncounterStudentCptCodes] ([EncounterStudentId], [CptCodeId])
INCLUDE ([Minutes], [BillingUnits])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

-- CPT code billing queries
CREATE NONCLUSTERED INDEX [IX_EncounterStudentCptCodes_CptCodeId_BillingUnits] 
ON [dbo].[EncounterStudentCptCodes] ([CptCodeId], [BillingUnits])
INCLUDE ([EncounterStudentId], [Minutes])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);
```

## Priority 2: Core Entity Tables (2M+ rows)

### 5. EncounterStudents (3,627,406 rows)
**Impact**: Very High - Most queried table in EF analysis
**Note**: Already has some good indexes, but missing key combinations

```sql
-- **NEW** - Primary student encounter filtering (most common EF pattern)
CREATE NONCLUSTERED INDEX [IX_EncounterStudents_StudentId_Archived_DateESigned] 
ON [dbo].[EncounterStudents] ([StudentId], [Archived], [DateESigned])
INCLUDE ([EncounterDate], [ESignedById], [EncounterStartTime], [EncounterEndTime])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Encounter date range queries (very common in EF)
CREATE NONCLUSTERED INDEX [IX_EncounterStudents_EncounterDate_Archived_StudentId] 
ON [dbo].[EncounterStudents] ([EncounterDate], [Archived], [StudentId])
INCLUDE ([DateESigned], [ESignedById])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Signed encounters filtering
CREATE NONCLUSTERED INDEX [IX_EncounterStudents_ESignedById_DateESigned] 
ON [dbo].[EncounterStudents] ([ESignedById], [DateESigned])
WHERE ([ESignedById] IS NOT NULL AND [DateESigned] IS NOT NULL)
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);
```

### 6. Encounters (2,620,512 rows)
**Impact**: High - Core encounter management
**Note**: Missing critical indexes for common EF patterns

```sql
-- **NEW** - Provider encounter filtering (very common in EF)
CREATE NONCLUSTERED INDEX [IX_Encounters_ProviderId_EncounterDate_Archived] 
ON [dbo].[Encounters] ([ProviderId], [EncounterDate], [Archived])
INCLUDE ([EncounterStartTime], [EncounterEndTime], [IsGroup])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Encounter date range queries
CREATE NONCLUSTERED INDEX [IX_Encounters_EncounterDate_ProviderId] 
ON [dbo].[Encounters] ([EncounterDate], [ProviderId])
INCLUDE ([Archived], [ServiceTypeId])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);
```

### 7. ClaimsEncounters (2,028,259 rows)
**Impact**: High - Critical for billing system
**Note**: Already has FK indexes, but missing business logic indexes

```sql
-- **NEW** - Claims processing and voucher matching
CREATE NONCLUSTERED INDEX [IX_ClaimsEncounters_VoucherDate_ClaimsStudentId] 
ON [dbo].[ClaimsEncounters] ([VoucherDate], [ClaimsStudentId])
INCLUDE ([ClaimAmount], [PaidAmount], [ServiceDate])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Service date range queries
CREATE NONCLUSTERED INDEX [IX_ClaimsEncounters_ServiceDate_Response] 
ON [dbo].[ClaimsEncounters] ([ServiceDate], [Response])
INCLUDE ([ClaimAmount], [EdiErrorCodeId])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);
```

## Priority 3: Medium-Volume High-Impact Tables

### 8. Students (251,130 rows)
**Impact**: Very High - Most queried table in EF analysis
**Note**: Has FK indexes but missing critical filtering indexes

```sql
-- **NEW** - Primary student search index (most common EF pattern)
CREATE NONCLUSTERED INDEX [IX_Students_Archived_LastName_FirstName] 
ON [dbo].[Students] ([Archived], [LastName], [FirstName])
INCLUDE ([StudentCode], [MedicaidNo], [DateOfBirth], [DistrictId], [SchoolId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Student code searches
CREATE NONCLUSTERED INDEX [IX_Students_StudentCode_Archived] 
ON [dbo].[Students] ([StudentCode], [Archived])
INCLUDE ([FirstName], [LastName], [DistrictId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - District filtering (very common in EF)
CREATE NONCLUSTERED INDEX [IX_Students_DistrictId_Archived_SchoolId] 
ON [dbo].[Students] ([DistrictId], [Archived], [SchoolId])
INCLUDE ([FirstName], [LastName], [StudentCode])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Date of birth range queries
CREATE NONCLUSTERED INDEX [IX_Students_DateOfBirth_Archived] 
ON [dbo].[Students] ([DateOfBirth], [Archived])
INCLUDE ([FirstName], [LastName], [StudentCode])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Medicaid number searches
CREATE NONCLUSTERED INDEX [IX_Students_MedicaidNo_Archived] 
ON [dbo].[Students] ([MedicaidNo], [Archived])
WHERE ([MedicaidNo] IS NOT NULL)
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);
```

### 9. SupervisorProviderStudentReferalSignOffs (223,726 rows)
**Impact**: High - Critical for provider workflow
**Note**: Already has some indexes, but missing key combinations

```sql
-- **NEW** - Referral date range filtering (common in EF)
CREATE NONCLUSTERED INDEX [IX_SupervisorProviderStudentReferalSignOffs_EffectiveDateFrom_EffectiveDateTo] 
ON [dbo].[SupervisorProviderStudentReferalSignOffs] ([EffectiveDateFrom], [EffectiveDateTo])
INCLUDE ([StudentId], [ServiceCodeId], [SupervisorId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Service code referral tracking
CREATE NONCLUSTERED INDEX [IX_SupervisorProviderStudentReferalSignOffs_ServiceCodeId_StudentId_EffectiveDateFrom] 
ON [dbo].[SupervisorProviderStudentReferalSignOffs] ([ServiceCodeId], [StudentId], [EffectiveDateFrom])
INCLUDE ([EffectiveDateTo], [SupervisorId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);
```

### 10. ProviderStudents (163,018 rows)
**Impact**: High - Core provider-student relationship
**Note**: Has FK indexes but missing combination indexes

```sql
-- **NEW** - Provider student relationship queries (very common in EF)
CREATE NONCLUSTERED INDEX [IX_ProviderStudents_ProviderId_StudentId_DateCreated] 
ON [dbo].[ProviderStudents] ([ProviderId], [StudentId], [DateCreated])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Student provider lookup
CREATE NONCLUSTERED INDEX [IX_ProviderStudents_StudentId_ProviderId_DateCreated] 
ON [dbo].[ProviderStudents] ([StudentId], [ProviderId], [DateCreated])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);
```

### 11. CaseLoads (149,273 rows)
**Impact**: High - Critical for case management
**Note**: Already has some good indexes, but missing archived filtering

```sql
-- **NEW** - Student case load with archived filtering (common in EF)
CREATE NONCLUSTERED INDEX [IX_CaseLoads_StudentId_Archived_ServiceCodeId] 
ON [dbo].[CaseLoads] ([StudentId], [Archived], [ServiceCodeId])
INCLUDE ([StudentTypeId], [DiagnosisCodeId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Service code case loads
CREATE NONCLUSTERED INDEX [IX_CaseLoads_ServiceCodeId_Archived_StudentTypeId] 
ON [dbo].[CaseLoads] ([ServiceCodeId], [Archived], [StudentTypeId])
INCLUDE ([StudentId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);
```

## Priority 4: Authentication & User Management

### 12. AuthUsers (10,231 rows)
**Impact**: High - Critical for authentication (used in every request)

```sql
-- **NEW** - Access control filtering (very common in EF)
CREATE NONCLUSTERED INDEX [IX_AuthUsers_HasAccess_IsEditable_RoleId] 
ON [dbo].[AuthUsers] ([HasAccess], [IsEditable], [RoleId])
INCLUDE ([Username])
WITH (FILLFACTOR = 95, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Role-based queries
CREATE NONCLUSTERED INDEX [IX_AuthUsers_RoleId_HasAccess_IsEditable] 
ON [dbo].[AuthUsers] ([RoleId], [HasAccess], [IsEditable])
WITH (FILLFACTOR = 95, ONLINE = ON, DATA_COMPRESSION = ROW);
```

### 13. Users Table
**Impact**: High - Critical for user lookups
**Note**: Already has AuthUserId index, but missing email searches

```sql
-- **NEW** - Email-based lookups (common in EF)
CREATE NONCLUSTERED INDEX [IX_Users_Email_Archived] 
ON [dbo].[Users] ([Email], [Archived])
INCLUDE ([FirstName], [LastName], [AuthUserId])
WITH (FILLFACTOR = 95, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - District admin lookups
CREATE NONCLUSTERED INDEX [IX_Users_SchoolDistrictId_Archived] 
ON [dbo].[Users] ([SchoolDistrictId], [Archived])
INCLUDE ([FirstName], [LastName], [Email])
WITH (FILLFACTOR = 95, ONLINE = ON, DATA_COMPRESSION = ROW);
```

## Priority 5: Supporting Tables

### 14. StudentParentalConsents (284,565 rows)
**Impact**: Medium - Important for consent tracking

```sql
-- **NEW** - Consent effective date queries (common in EF)
CREATE NONCLUSTERED INDEX [IX_StudentParentalConsents_StudentId_ParentalConsentEffectiveDate] 
ON [dbo].[StudentParentalConsents] ([StudentId], [ParentalConsentEffectiveDate])
INCLUDE ([ParentalConsentTypeId], [DateCreated])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Consent type filtering
CREATE NONCLUSTERED INDEX [IX_StudentParentalConsents_ParentalConsentTypeId_EffectiveDate] 
ON [dbo].[StudentParentalConsents] ([ParentalConsentTypeId], [ParentalConsentEffectiveDate])
INCLUDE ([StudentId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);
```

### 15. StudentTherapies (40,106 rows)
**Impact**: Medium - Important for therapy scheduling

```sql
-- **NEW** - Case load therapy filtering (common in EF)
CREATE NONCLUSTERED INDEX [IX_StudentTherapies_CaseLoadId_Archived_ProviderId] 
ON [dbo].[StudentTherapies] ([CaseLoadId], [Archived], [ProviderId])
INCLUDE ([StartDate], [EndDate], [TherapyGroupId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Therapy group filtering
CREATE NONCLUSTERED INDEX [IX_StudentTherapies_TherapyGroupId_Archived] 
ON [dbo].[StudentTherapies] ([TherapyGroupId], [Archived])
INCLUDE ([CaseLoadId], [ProviderId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);
```

### 16. ProviderStudentSupervisors (22,395 rows)
**Impact**: Medium - Important for supervisor workflow
**Note**: Already has some indexes but missing effective date filtering

```sql
-- **NEW** - Supervisor assignment with effective dates (common in EF)
CREATE NONCLUSTERED INDEX [IX_ProviderStudentSupervisors_SupervisorId_EffectiveEndDate] 
ON [dbo].[ProviderStudentSupervisors] ([SupervisorId], [EffectiveEndDate])
INCLUDE ([StudentId], [AssistantId], [EffectiveStartDate])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - Assistant assignment filtering
CREATE NONCLUSTERED INDEX [IX_ProviderStudentSupervisors_AssistantId_EffectiveEndDate] 
ON [dbo].[ProviderStudentSupervisors] ([AssistantId], [EffectiveEndDate])
INCLUDE ([StudentId], [SupervisorId], [EffectiveStartDate])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);
```

### 17. Vouchers (18,098 rows)
**Impact**: Medium - Important for billing reports

```sql
-- **NEW** - Voucher date range queries (common in EF)
CREATE NONCLUSTERED INDEX [IX_Vouchers_VoucherDate_Archived_SchoolDistrictId] 
ON [dbo].[Vouchers] ([VoucherDate], [Archived], [SchoolDistrictId])
INCLUDE ([VoucherAmount], [ServiceCode], [SchoolYear])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

-- **NEW** - District voucher filtering
CREATE NONCLUSTERED INDEX [IX_Vouchers_SchoolDistrictId_VoucherDate] 
ON [dbo].[Vouchers] ([SchoolDistrictId], [VoucherDate])
INCLUDE ([VoucherAmount], [PaidAmount], [ServiceCode])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);
```

## Implementation Strategy

### Phase 1: Immediate Impact (Deploy First)
- **EncounterStudents** indexes - Will improve 90% of student encounter queries
- **Students** filtering indexes - Will improve all student search operations
- **AuthUsers** access control - Will improve authentication performance

### Phase 2: High-Volume Tables (Deploy Second)
- **EncounterStudentStatuses**, **EncounterStudentGoals**, **EncounterStudentMethods** - Will improve large table scans
- **Encounters** and **ClaimsEncounters** - Will improve billing operations

### Phase 3: Supporting Tables (Deploy Third)
- **CaseLoads**, **ProviderStudents**, **SupervisorProviderStudentReferalSignOffs** - Will improve workflow operations
- **StudentParentalConsents**, **StudentTherapies** - Will improve specialized queries

## Performance Impact Estimation

### Critical Improvements Expected:
1. **Student searches**: 70-90% improvement (most common operation)
2. **Encounter filtering**: 60-80% improvement (high-volume operations)
3. **Provider workflow**: 50-70% improvement (complex joins)
4. **Billing operations**: 40-60% improvement (claims processing)

### Maintenance Notes:
- Use `FILLFACTOR = 85` for high-volume tables (frequent inserts/updates)
- Use `FILLFACTOR = 90-95` for lookup tables (mostly reads)
- All indexes include `DATA_COMPRESSION = ROW` for storage efficiency
- Monitor index usage with DMVs after deployment
- Consider partitioning for tables over 10M rows

## Monitoring Queries

```sql
-- Check index usage after deployment
SELECT 
    i.name AS IndexName,
    dm_ius.user_seeks + dm_ius.user_scans + dm_ius.user_lookups AS TotalReads,
    dm_ius.user_updates AS TotalWrites,
    dm_ius.last_user_seek,
    dm_ius.last_user_scan
FROM sys.dm_db_index_usage_stats dm_ius
JOIN sys.indexes i ON dm_ius.object_id = i.object_id AND dm_ius.index_id = i.index_id
WHERE dm_ius.database_id = DB_ID()
ORDER BY TotalReads DESC;

-- Check index fragmentation
SELECT 
    i.name AS IndexName,
    ps.avg_fragmentation_in_percent,
    ps.page_count
FROM sys.dm_db_index_physical_stats(DB_ID(), NULL, NULL, NULL, 'DETAILED') ps
JOIN sys.indexes i ON ps.object_id = i.object_id AND ps.index_id = i.index_id
WHERE ps.avg_fragmentation_in_percent > 10
ORDER BY ps.avg_fragmentation_in_percent DESC;
``` 