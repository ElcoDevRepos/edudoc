# Nursing Student and Encounter Creation Flow

## Overview
This document captures the database operations that occur when a nurse creates a student and associated encounters through the application UI. This information will be used to ensure that data imported through the `EncounterImportService` matches what would be created manually.

## Flow Sequence
Below we'll document the SQL operations as captured by SQL Server Profiler when performing the following actions:
1. Creating a new student
2. Creating a case load for the student
3. Creating a case load script (required for nursing)
4. Creating an encounter for the student

## Database Operations
*The SQL operations below were captured during manual testing with SQL Server Profiler.*

### 1. Student Creation

#### 1.1 Create Address Record
```sql
INSERT [dbo].[Addresses]([Address1], [Address2], [City], [StateCode], [Zip], [CountryCode], [Province], [County])
VALUES (@Address1, @Address2, @City, @StateCode, @Zip, @CountryCode, @Province, @County)
```

**Columns populated:**
- ≡ƒöñ `Address1`: Street address (e.g., 'TestAddr1') - *manually entered*
- ≡ƒöñ `Address2`: Additional address info (e.g., 'TestAddr2') - *manually entered*
- ≡ƒöñ `City`: City name (e.g., 'TestCity') - *manually entered*
- ≡ƒöñ `StateCode`: Two-character state code (e.g., 'OH') - *manually entered*
- ≡ƒöñ `Zip`: Postal code (e.g., '37920') - *manually entered*
- ≡ƒöä `CountryCode`: Two-character country code (e.g., 'US') - *default value*
- ≡ƒöñ `Province`: Province name (optional, left empty in example) - *manually entered (empty)*
- ≡ƒöñ `County`: County name (e.g., 'TestCounty') - *manually entered*

**Notes:**
- The operation returns the newly created Address ID using `scope_identity()`
- This address record will be associated with the student record
- All string fields have specific length constraints (e.g., StateCode is char(2))

#### 1.2 Create Student Record
```sql
INSERT [dbo].[Students]([FirstName], [MiddleName], [LastName], [StudentCode], [MedicaidNo], [Grade], [DateOfBirth], [Notes], [AddressId], [SchoolId], [DistrictId], [EnrollmentDate], [EscId], [CreatedById], [ModifiedById], [DateCreated], [DateModified], [Archived])
VALUES (@FirstName, NULL, @LastName, @StudentCode, NULL, @Grade, @DateOfBirth, NULL, @AddressId, @SchoolId, @DistrictId, @EnrollmentDate, NULL, @CreatedById, NULL, @DateCreated, NULL, @Archived)
```

**Columns populated:**
- ≡ƒöñ `FirstName`: Student's first name (e.g., 'Flow') - *manually entered*
- ≡ƒöñ `MiddleName`: Middle name (NULL in example) - *not entered*
- ≡ƒöñ `LastName`: Last name (e.g., 'Test') - *manually entered*
- ≡ƒöñ `StudentCode`: Unique identifier for the student (e.g., '1234567890AB') - *manually entered*
- ≡ƒöñ `MedicaidNo`: Medicaid number (NULL in example) - *not entered*
- ≡ƒöñ `Grade`: Student's grade level (e.g., 'DI') - *manually entered*
- ≡ƒöñ `DateOfBirth`: Student's birth date (e.g., '2020-03-21') - *manually entered*
- ≡ƒöñ `Notes`: Additional notes (NULL in example) - *not entered*
- ≡ƒöä `AddressId`: Foreign key reference to the Address record created in step 1.1 - *auto-populated*
- ≡ƒöì `SchoolId`: Foreign key reference to the School (e.g., 1001) - *selected from UI dropdown*
- ≡ƒöä `DistrictId`: Foreign key reference to the District (e.g., 1) - *auto-populated from SchoolId*
- ≡ƒöä `EnrollmentDate`: When the student was enrolled (e.g., current date) - *auto-populated*
- ≡ƒöñ `EscId`: ESC identifier (NULL in example) - *not entered*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `ModifiedById`: User ID of the person who last modified the record (NULL for new records) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of last modification (NULL for new records) - *auto-populated*
- ≡ƒöä `Archived`: Boolean flag indicating if the record is archived (false/0) - *auto-populated*

**Notes:**
- The operation returns the newly created Student ID using `scope_identity()`
- The `AddressId` links to the address created in the previous step
- Several fields are left NULL initially (MiddleName, MedicaidNo, Notes, EscId, ModifiedById, DateModified)
- The `EnrollmentDate` is set to the current date by default
- The `CreatedById` corresponds to the logged-in user's ID
- The student record is linked to both a School and a District
- The DistrictId is inferred automatically from the selected School

**Legend:**
- ≡ƒöñ Manually entered value
- ≡ƒöì Selected from UI (dropdown, etc.)
- ≡ƒöä Auto-populated value

#### 1.3 Create Provider-Student Relationship
```sql
INSERT [dbo].[ProviderStudents]([ProviderId], [StudentId], [CreatedById], [DateCreated])
VALUES (@ProviderId, @StudentId, @CreatedById, @DateCreated)
```

**Columns populated:**
- ≡ƒöä `ProviderId`: Foreign key reference to the Provider record (e.g., 1) - *auto-populated from logged-in user*
- ≡ƒöä `StudentId`: Foreign key reference to the Student record created in step 1.2 (e.g., 2) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*

**Notes:**
- The operation returns the newly created relationship ID using `scope_identity()`
- This establishes the association between a provider and a student
- This relationship is created automatically when a provider creates a student
- No user input is required; it happens by virtue of being logged in as the provider
- The relationship is required before creating case loads and encounters
- No ModifiedById or DateModified fields are included, suggesting these may be added only when the record is updated

#### 1.4 Create Student Parental Consent
```sql
INSERT [dbo].[StudentParentalConsents]([StudentId], [ParentalConsentEffectiveDate], [ParentalConsentDateEntered], [ParentalConsentTypeId], [CreatedById], [ModifiedById], [DateCreated], [DateModified])
VALUES (@StudentId, @ParentalConsentEffectiveDate, @ParentalConsentDateEntered, @ParentalConsentTypeId, @CreatedById, NULL, @DateCreated, NULL)
```

**Columns populated:**
- ≡ƒöä `StudentId`: Foreign key reference to the Student record created in step 1.2 (e.g., 2) - *auto-populated*
- ≡ƒöä `ParentalConsentEffectiveDate`: When the consent becomes effective (e.g., current date/time) - *auto-populated*
- ≡ƒöä `ParentalConsentDateEntered`: When the consent was entered into the system (e.g., current date/time) - *auto-populated*
- ≡ƒöä `ParentalConsentTypeId`: Type of parental consent (e.g., 3) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `ModifiedById`: User ID of the person who last modified the record (NULL for new records) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of last modification (NULL for new records) - *auto-populated*

**Notes:**
- The operation returns the newly created consent ID using `scope_identity()`
- This record is automatically created as part of student creation without any user input
- The ParentalConsentTypeId of 3 likely corresponds to a default consent type in a lookup table
- Both effective date and entered date are automatically set to the current timestamp
- This appears to be a system-generated record created whenever a new student is added
- ModifiedById and DateModified are NULL initially and would be populated on update

### 2. Case Load Creation

#### 2.1 Create Case Load Record
```sql
INSERT [dbo].[CaseLoads]([StudentTypeId], [ServiceCodeId], [StudentId], [DiagnosisCodeId], [DisabilityCodeId], [IEPStartDate], [IEPEndDate], [Archived], [CreatedById], [ModifiedById], [DateCreated], [DateModified])
VALUES (@StudentTypeId, @ServiceCodeId, @StudentId, NULL, NULL, @IEPStartDate, @IEPEndDate, @Archived, @CreatedById, NULL, @DateCreated, NULL)
```

**Columns populated:**
- ≡ƒöì `StudentTypeId`: Type of student (e.g., 1) - *selected from UI dropdown*
- ≡ƒöä `ServiceCodeId`: Service code for the case load (e.g., 5 - nursing services) - *auto-populated from provider's title*
- ≡ƒöä `StudentId`: Foreign key reference to the Student record (e.g., 2) - *auto-populated*
- ≡ƒöñ `DiagnosisCodeId`: Foreign key reference to diagnosis code (NULL in example) - *not entered*
- ≡ƒöñ `DisabilityCodeId`: Foreign key reference to disability code (NULL in example) - *not entered*
- ≡ƒöñ `IEPStartDate`: Start date for the Individualized Education Program (e.g., '2025-03-20') - *manually entered*
- ≡ƒöñ `IEPEndDate`: End date for the Individualized Education Program (e.g., '2026-03-21') - *manually entered*
- ≡ƒöä `Archived`: Boolean flag indicating if the record is archived (false/0) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `ModifiedById`: User ID of the person who last modified the record (NULL for new records) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of last modification (NULL for new records) - *auto-populated*

**Notes:**
- The operation returns the newly created CaseLoad ID using `scope_identity()`
- This record represents a "Plan Type" in the UI, which appears to be a nursing service plan for this student
- The ServiceCodeId of 5 corresponds to nursing services, inferred from the provider's title
- DiagnosisCodeId and DisabilityCodeId are left NULL in this example but could be populated
- The IEP start and end dates establish the timeframe for this service
- ModifiedById and DateModified are NULL initially and would be populated on update

### 3. Case Load Script Creation

#### 3.1 Create Case Load Script Record
```sql
INSERT [dbo].[CaseLoadScripts]([NPI], [DiagnosisCodeId], [DoctorFirstName], [DoctorLastName], [InitiationDate], [ExpirationDate], [FileName], [FilePath], [CaseLoadId], [Archived], [UploadedById], [ModifiedById], [DateUpload], [DateModified])
VALUES (@NPI, @DiagnosisCodeId, @DoctorFirstName, @DoctorLastName, @InitiationDate, @ExpirationDate, @FileName, @FilePath, @CaseLoadId, @Archived, @UploadedById, NULL, @DateUpload, NULL)
```

**Columns populated:**
- ≡ƒöñ `NPI`: National Provider Identifier for the prescribing doctor (e.g., '1234567890') - *manually entered*
- ≡ƒöì `DiagnosisCodeId`: Foreign key reference to diagnosis code (e.g., 1) - *selected from UI dropdown*
- ≡ƒöñ `DoctorFirstName`: First name of the prescribing doctor (e.g., 'TestDoctorFirst') - *manually entered*
- ≡ƒöñ `DoctorLastName`: Last name of the prescribing doctor (e.g., 'TestDoctorLast') - *manually entered*
- ≡ƒöñ `InitiationDate`: Start date for the prescription (e.g., '2025-03-20') - *manually entered*
- ≡ƒöñ `ExpirationDate`: End date for the prescription (e.g., '2025-10-30') - *manually entered*
- ≡ƒöä `FileName`: Name of the uploaded prescription file (empty in this example) - *populated from uploaded file name, if any*
- ≡ƒöä `FilePath`: Path to the uploaded prescription file (empty in this example) - *auto-populated from system file storage path*
- ≡ƒöä `CaseLoadId`: Foreign key reference to the CaseLoad record created in step 2.1 (e.g., 2) - *auto-populated*
- ≡ƒöä `Archived`: Boolean flag indicating if the record is archived (false/0) - *auto-populated*
- ≡ƒöä `UploadedById`: User ID of the person who uploaded the script (e.g., 1007) - *auto-populated*
- ≡ƒöä `ModifiedById`: User ID of the person who last modified the record (NULL for new records) - *auto-populated*
- ≡ƒöä `DateUpload`: Timestamp of upload (current date/time) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of last modification (NULL for new records) - *auto-populated*

**Notes:**
- The operation returns the newly created CaseLoadScript ID using `scope_identity()`
- This record represents a doctor's prescription/authorization for the nursing services
- It's a critical component specifically for nursing providers (unlike some other provider types)
- The script has its own diagnosis code which may differ from the case load's diagnosis
- The script has its own date range (InitiationDate to ExpirationDate) which might be different from the IEP dates
- File upload is optional (FileName and FilePath are empty in this example) but would be populated from an uploaded file if provided
- ModifiedById and DateModified are NULL initially and would be populated on update

#### 3.2 Create Case Load Script Goal
```sql
INSERT [dbo].[CaseLoadScriptGoals]([CaseLoadScriptId], [GoalId], [MedicationName], [Archived], [CreatedById], [ModifiedById], [DateCreated], [DateModified])
VALUES (@CaseLoadScriptId, @GoalId, NULL, @Archived, @CreatedById, NULL, @DateCreated, NULL)
```

**Columns populated:**
- ≡ƒöä `CaseLoadScriptId`: Foreign key reference to the CaseLoadScript created in step 3.1 (e.g., 2) - *auto-populated*
- ≡ƒöì `GoalId`: Foreign key reference to a predefined goal (e.g., 1) - *selected from UI dropdown*
- ≡ƒöñ `MedicationName`: Name of medication (NULL in this example) - *not entered*
- ≡ƒöä `Archived`: Boolean flag indicating if the record is archived (false/0) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `ModifiedById`: User ID of the person who last modified the record (NULL for new records) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of last modification (NULL for new records) - *auto-populated*

**Notes:**
- The operation returns the newly created CaseLoadScriptGoal ID using `scope_identity()`
- This links a predefined goal (likely from a goals table) to the case load script
- For nursing providers, this represents a treatment goal or objective
- MedicationName is NULL in this example but could be populated for medication-related goals
- Multiple goals can be added by repeating this operation with different GoalId values
- The user only needs to select the goal(s) from a dropdown; all other fields are auto-populated

#### 3.3 Update Case Load Script with Modification Info
```sql
UPDATE [dbo].[CaseLoadScripts]
SET [ModifiedById] = @ModifiedById, [DateModified] = @DateModified
WHERE ([Id] = @Id)
```

**Columns updated:**
- `ModifiedById`: User ID of the person who modified the record (e.g., 1007)
- `DateModified`: Timestamp of modification (current date/time)

**Where condition:**
- `Id`: The ID of the CaseLoadScript to update (e.g., 2)

**Notes:**
- This update occurs immediately after creating the case load script and associated goals
- It's likely setting the modification information to track that the script has been fully configured
- The ModifiedById matches the original creator's ID in this example
- This update completes the script creation process

### 4. Encounter Creation

#### 4.1 Create Initial Encounter Record
```sql
INSERT [dbo].[Encounters]([ProviderId], [ServiceTypeId], [NonMspServiceTypeId], [EvaluationTypeId], [EncounterDate], [EncounterStartTime], [EncounterEndTime], [IsGroup], [AdditionalStudents], [FromSchedule], [DiagnosisCodeId], [Archived], [CreatedById], [ModifiedById], [DateCreated], [DateModified])
VALUES (@ProviderId, @ServiceTypeId, NULL, NULL, NULL, NULL, NULL, @IsGroup, @AdditionalStudents, @FromSchedule, NULL, @Archived, @CreatedById, NULL, @DateCreated, NULL)
```

**Columns populated:**
- ≡ƒöä `ProviderId`: Foreign key reference to the Provider record (e.g., 1) - *auto-populated from logged-in user*
- ≡ƒöä `ServiceTypeId`: Type of service (e.g., 3) - *auto-populated*
- ≡ƒöä `NonMspServiceTypeId`: NULL for initial encounter - *auto-populated*
- ≡ƒöä `EvaluationTypeId`: NULL for initial encounter - *auto-populated*
- ≡ƒöä `EncounterDate`: NULL initially - *auto-populated*
- ≡ƒöä `EncounterStartTime`: NULL initially - *auto-populated*
- ≡ƒöä `EncounterEndTime`: NULL initially - *auto-populated*
- ≡ƒöä `IsGroup`: Boolean flag indicating if this is a group encounter (false/0) - *auto-populated*
- ≡ƒöä `AdditionalStudents`: Number of additional students (0) - *auto-populated*
- ≡ƒöä `FromSchedule`: Boolean flag indicating if created from schedule (false/0) - *auto-populated*
- ≡ƒöä `DiagnosisCodeId`: NULL initially - *auto-populated*
- ≡ƒöä `Archived`: Boolean flag indicating if the record is archived (false/0) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `ModifiedById`: NULL for new records - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*
- ≡ƒöä `DateModified`: NULL for new records - *auto-populated*

**Notes:**
- The operation returns the newly created Encounter ID using `scope_identity()`
- This initial record is created automatically when navigating to the create encounter page
- No user input is required at this stage - all fields are populated automatically by the system
- The encounter is linked to the specific provider
- Date and time fields are left NULL initially, to be populated later
- The ServiceTypeId of 3 appears to be a default value for this type of encounter
- This is the first step in creating an encounter

#### 4.2 Update Encounter with Date and Time Details
```sql
UPDATE [dbo].[Encounters]
SET [EncounterDate] = @EncounterDate, [EncounterStartTime] = @EncounterStartTime, [EncounterEndTime] = @EncounterEndTime, [ModifiedById] = @ModifiedById, [DateModified] = @DateModified
WHERE ([Id] = @Id)
```

**Columns updated:**
- ≡ƒöñ `EncounterDate`: Date of the encounter (e.g., '2025-03-21') - *manually entered*
- ≡ƒöñ `EncounterStartTime`: Start time of the encounter (e.g., '16:00:00') - *manually entered*
- ≡ƒöñ `EncounterEndTime`: End time of the encounter (e.g., '16:30:00') - *manually entered*
- ≡ƒöä `ModifiedById`: User ID of the person who modified the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of modification (current date/time) - *auto-populated*

**Where condition:**
- ≡ƒöä `Id`: The ID of the Encounter to update (e.g., 9) - *auto-populated*

**Notes:**
- This update occurs when the user enters the basic encounter details in the UI
- The initially auto-populated date and time fields are now replaced with user-specified values
- This establishes the timeframe for the encounter (date, start and end times)
- The record is marked as modified with the current user's ID and timestamp

**Note:** At this point, the encounter creation flow diverges based on whether it is an evaluation/assessment encounter or a regular treatment/therapy encounter. The following sections document both paths.

### 4A. Evaluation Encounter Creation

#### 4A.1 Create Initial Evaluation Encounter Record
```sql
INSERT [dbo].[Encounters]([ProviderId], [ServiceTypeId], [NonMspServiceTypeId], [EvaluationTypeId], [EncounterDate], [EncounterStartTime], [EncounterEndTime], [IsGroup], [AdditionalStudents], [FromSchedule], [DiagnosisCodeId], [Archived], [CreatedById], [ModifiedById], [DateCreated], [DateModified])
VALUES (@ProviderId, @ServiceTypeId, NULL, @EvaluationTypeId, NULL, NULL, NULL, @IsGroup, @AdditionalStudents, @FromSchedule, NULL, @Archived, @CreatedById, NULL, @DateCreated, NULL)
```

**Columns populated:**
- ≡ƒöä `ProviderId`: Foreign key reference to the Provider record (e.g., 1) - *auto-populated from logged-in user*
- ≡ƒöä `ServiceTypeId`: Type of service (e.g., 1 - Evaluation/Assessment) - *auto-populated*
- ≡ƒöä `NonMspServiceTypeId`: NULL for evaluation encounters - *auto-populated*
- ≡ƒöä `EvaluationTypeId`: Type of evaluation (e.g., 1) - *auto-populated*
- ≡ƒöä `EncounterDate`: NULL initially - *auto-populated*
- ≡ƒöä `EncounterStartTime`: NULL initially - *auto-populated*
- ≡ƒöä `EncounterEndTime`: NULL initially - *auto-populated*
- ≡ƒöä `IsGroup`: Boolean flag indicating if this is a group encounter (false/0) - *auto-populated*
- ≡ƒöä `AdditionalStudents`: Number of additional students (0) - *auto-populated*
- ≡ƒöä `FromSchedule`: Boolean flag indicating if created from schedule (false/0) - *auto-populated*
- ≡ƒöä `DiagnosisCodeId`: NULL initially - *auto-populated*
- ≡ƒöä `Archived`: Boolean flag indicating if the record is archived (false/0) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `ModifiedById`: NULL for new records - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*
- ≡ƒöä `DateModified`: NULL for new records - *auto-populated*

**Notes:**
- The operation returns the newly created Encounter ID using `scope_identity()`
- This initial record is created automatically when navigating to the create evaluation encounter page
- No user input is required at this stage - all fields are populated automatically by the system
- The encounter is linked to the specific provider
- Date and time fields are left NULL initially, to be populated later
- The ServiceTypeId of 1 indicates this is an Evaluation/Assessment type encounter
- The EvaluationTypeId of 1 appears to be a default value
- This is the first step in creating an evaluation encounter

#### 4A.2 Update Evaluation Encounter with Date, Time, and Diagnosis
```sql
UPDATE [dbo].[Encounters]
SET [EncounterDate] = @EncounterDate, 
    [EncounterStartTime] = @EncounterStartTime, 
    [EncounterEndTime] = @EncounterEndTime, 
    [DiagnosisCodeId] = @DiagnosisCodeId, 
    [ModifiedById] = @ModifiedById, 
    [DateModified] = @DateModified
WHERE ([Id] = @Id)
```

**Columns updated:**
- ≡ƒöñ `EncounterDate`: Date of the encounter (e.g., '2025-03-27') - *manually entered*
- ≡ƒöñ `EncounterStartTime`: Start time of the encounter (e.g., '17:00:00') - *manually entered*
- ≡ƒöñ `EncounterEndTime`: End time of the encounter (e.g., '17:30:00') - *manually entered*
- ≡ƒöì `DiagnosisCodeId`: Foreign key reference to diagnosis code (e.g., 1) - *selected from UI dropdown*
- ≡ƒöä `ModifiedById`: User ID of the person who modified the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of modification (current date/time) - *auto-populated*

**Where condition:**
- ≡ƒöä `Id`: The ID of the Encounter to update (e.g., 18) - *auto-populated*

**Notes:**
- This update occurs when the user enters the basic encounter details in the UI
- The initially NULL date and time fields are now populated with user-specified values
- This establishes the timeframe for the evaluation encounter (date, start and end times)
- The DiagnosisCodeId is selected from a dropdown menu in the UI
- The record is marked as modified with the current user's ID and timestamp
- This is a key step in setting up the evaluation encounter with its basic details

### 5. Encounter Student Record Creation

#### 5.1 Create Encounter Student Record
```sql
INSERT [dbo].[EncounterStudents]([EncounterId], [StudentId], [EncounterStatusId], [EncounterLocationId], [CaseLoadId], [EncounterStartTime], [EncounterEndTime], [EncounterDate], [IsTelehealth], [ReasonForReturn], [EncounterNumber], [StudentTherapyScheduleId], [SupervisorComments], [ESignatureText], [ESignedById], [DateESigned], [ESignedFromIp], [CPTCodeId], [DiagnosisCodeId], [Medicaid], [Archived], [CreatedById], [ModifiedById], [DateCreated], [DateModified])
VALUES (@EncounterId, @StudentId, @EncounterStatusId, @EncounterLocationId, @CaseLoadId, @EncounterStartTime, @EncounterEndTime, @EncounterDate, @IsTelehealth, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, @Archived, @CreatedById, NULL, @DateCreated, NULL)
```

**Columns populated:**
- ≡ƒöä `EncounterId`: Foreign key reference to the Encounter record created in step 4.1 (e.g., 9) - *auto-populated*
- ≡ƒöä `StudentId`: Foreign key reference to the Student record created in step 1.2 (e.g., 2) - *auto-populated*
- ≡ƒöä `EncounterStatusId`: Foreign key reference to the encounter status (e.g., 26 - Draft) - *auto-populated*
- ≡ƒöì `EncounterLocationId`: Foreign key reference to the encounter location (e.g., 1) - *selected from UI dropdown*
- ≡ƒöä `CaseLoadId`: Foreign key reference to the CaseLoad record created in step 2.1 (e.g., 2) - *auto-populated*
- ≡ƒöä `EncounterStartTime`: Start time of the encounter (e.g., '16:00:00') - *auto-populated*
- ≡ƒöä `EncounterEndTime`: End time of the encounter (e.g., '16:30:00') - *auto-populated*
- ≡ƒöä `EncounterDate`: Date of the encounter (e.g., '2025-03-21') - *auto-populated*
- ≡ƒöä `IsTelehealth`: Boolean flag indicating if this is a telehealth session (false/0) - *auto-populated*
- ≡ƒöä `ReasonForReturn`: Reason for returning (NULL in this example) - *not entered*
- ≡ƒöä `EncounterNumber`: Encounter number (NULL in this example) - *not entered*
- ≡ƒöä `StudentTherapyScheduleId`: Schedule ID (NULL in this example) - *not entered*
- ≡ƒöä `SupervisorComments`: Comments from supervisor (NULL in this example) - *not entered*
- ≡ƒöä `ESignatureText`: Electronic signature text (NULL at this stage) - *not entered*
- ≡ƒöä `ESignedById`: User ID who e-signed (NULL at this stage) - *not entered*
- ≡ƒöä `DateESigned`: Timestamp of e-signing (NULL at this stage) - *not entered*
- ≡ƒöä `ESignedFromIp`: IP address from which e-signing was done (NULL at this stage) - *not entered*
- ≡ƒöä `CPTCodeId`: CPT code ID (NULL in this example) - *not entered*
- ≡ƒöä `DiagnosisCodeId`: Diagnosis code ID (NULL in this example) - *not entered*
- ≡ƒöä `Medicaid`: Medicaid flag (NULL in this example) - *not entered*
- ≡ƒöä `Archived`: Boolean flag indicating if the record is archived (false/0) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `ModifiedById`: User ID of the person who last modified the record (NULL for new records) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of last modification (NULL for new records) - *auto-populated*

**Notes:**
- The operation returns the newly created EncounterStudent ID using `scope_identity()`
- This record links a specific student to the encounter
- It is set with a default status of "Draft" (EncounterStatusId = 26)
- Most fields related to e-signatures are NULL at this stage
- Date and time values are copied from the parent Encounter record
- The location needs to be selected from a dropdown by the user
- This record will be updated multiple times during the encounter creation and e-signing process

#### 5.2 Create Encounter Student Goal Record
```sql
INSERT [dbo].[EncounterStudentGoals]([EncounterStudentId], [GoalId], [ServiceOutcomes], [Archived], [CreatedById], [ModifiedById], [DateCreated], [DateModified], [NursingResponseNote], [NursingResultNote], [NursingGoalResultId], [CaseLoadScriptGoalId])
VALUES (@EncounterStudentId, @GoalId, NULL, @Archived, @CreatedById, NULL, @DateCreated, NULL, NULL, NULL, NULL, @CaseLoadScriptGoalId)
```

**Columns populated:**
- ≡ƒöä `EncounterStudentId`: Foreign key reference to the EncounterStudent record created in step 5.1 (e.g., 3) - *auto-populated*
- ≡ƒöä `GoalId`: Foreign key reference to a predefined goal (e.g., 1) - *auto-populated*
- ≡ƒöä `ServiceOutcomes`: Outcomes of the service (NULL in this example) - *not entered*
- ≡ƒöä `Archived`: Boolean flag indicating if the record is archived (false/0) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `ModifiedById`: User ID of the person who last modified the record (NULL for new records) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of last modification (NULL for new records) - *auto-populated*
- ≡ƒöä `NursingResponseNote`: Notes about nursing response (NULL in this example) - *not entered*
- ≡ƒöä `NursingResultNote`: Notes about nursing results (NULL in this example) - *not entered*
- ≡ƒöä `NursingGoalResultId`: Result identifier (NULL in this example) - *not entered*
- ≡ƒöä `CaseLoadScriptGoalId`: Foreign key reference to the CaseLoadScriptGoal created in step 3.2 (e.g., 2) - *auto-populated*

**Notes:**
- The operation returns the newly created EncounterStudentGoal ID using `scope_identity()`
- This record is created automatically with no user input required
- It links goals from the case load script to the specific encounter based on previously created relationships
- For nursing providers, this automatically tracks which care goals were addressed in the encounter
- The record links back to the CaseLoadScriptGoal created earlier in the process
- Many fields are initially NULL but will be populated later with outcome information
- This enables tracking of goal progress across multiple encounters
- Multiple goals can be automatically added to a single encounter based on the case load script goals

#### 5.3 Update Encounter Student with Encounter Number
```sql
UPDATE [dbo].[EncounterStudents]
SET [EncounterNumber] = @EncounterNumber
WHERE ([Id] = @Id)
```

**Columns updated:**
- ≡ƒöä `EncounterNumber`: Unique identifier for the encounter (e.g., 'T0010321250003') - *auto-populated*

**Where condition:**
- ≡ƒöä `Id`: The ID of the EncounterStudent to update (e.g., 3) - *auto-populated*

**Notes:**
- This update assigns a unique encounter number to the student's encounter record
- The number appears to follow a specific format that may include codes for provider, service type, date, etc.
- This occurs automatically after the encounter details are populated - no user input required
- The encounter number is used for tracking, reporting, and potentially billing purposes
- This appears to be the final step in the basic creation of a nursing encounter

#### 5.4 Create Encounter Student Status Record
```sql
INSERT [dbo].[EncounterStudentStatuses]([EncounterStudentId], [EncounterStatusId], [CreatedById], [DateCreated])
VALUES (@EncounterStudentId, @EncounterStatusId, @CreatedById, @DateCreated)
```

**Columns populated:**
- ≡ƒöä `EncounterStudentId`: Foreign key reference to the EncounterStudent record created in step 5.1 (e.g., 3) - *auto-populated*
- ≡ƒöä `EncounterStatusId`: Status of the encounter (e.g., 14 - likely a draft or pending status) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*

**Notes:**
- The operation returns the newly created EncounterStudentStatus ID using `scope_identity()`
- This record tracks the status history of the encounter
- The initial status (14) appears to match the EncounterStatusId in the EncounterStudent record
- This creates an audit trail for status changes throughout the encounter's lifecycle
- Additional records would be added to this table as the encounter status changes (e.g., from draft to submitted to approved)
- This is created automatically with no user input required
- This is the final step in the initial creation of a nursing encounter

### 5A. Evaluation Encounter Student Record Creation

#### 5A.1 Create Evaluation Encounter Student Record
```sql
INSERT [dbo].[EncounterStudents](
    [EncounterId], [StudentId], [EncounterStatusId], [EncounterLocationId], 
    [CaseLoadId], [EncounterStartTime], [EncounterEndTime], [EncounterDate], 
    [IsTelehealth], [DiagnosisCodeId], [Archived], [CreatedById], [DateCreated]
)
VALUES (
    @EncounterId, @StudentId, @EncounterStatusId, @EncounterLocationId, 
    @CaseLoadId, @EncounterStartTime, @EncounterEndTime, @EncounterDate, 
    @IsTelehealth, @DiagnosisCodeId, @Archived, @CreatedById, @DateCreated
)
```

**Columns populated:**
- ≡ƒöä `EncounterId`: Foreign key reference to the evaluation Encounter record (e.g., 18) - *auto-populated*
- ≡ƒöä `StudentId`: Foreign key reference to the Student record (e.g., 2) - *auto-populated*
- ≡ƒöä `EncounterStatusId`: Status of the encounter (e.g., 15 - likely "Draft" or "In Progress") - *auto-populated*
- ≡ƒöì `EncounterLocationId`: Foreign key reference to the encounter location (e.g., 1) - *selected from UI dropdown*
- ≡ƒöä `CaseLoadId`: Foreign key reference to the CaseLoad record (e.g., 2) - *auto-populated*
- ≡ƒöä `EncounterStartTime`: Start time of the encounter (e.g., '17:00:00') - *auto-populated from parent encounter*
- ≡ƒöä `EncounterEndTime`: End time of the encounter (e.g., '17:30:00') - *auto-populated from parent encounter*
- ≡ƒöä `EncounterDate`: Date of the encounter (e.g., '2025-03-27') - *auto-populated from parent encounter*
- ≡ƒöä `IsTelehealth`: Boolean flag indicating if this is a telehealth session (false/0) - *auto-populated*
- ≡ƒöä `DiagnosisCodeId`: Foreign key reference to diagnosis code (e.g., 1) - *auto-populated from parent encounter*
- ≡ƒöä `Archived`: Boolean flag indicating if the record is archived (false/0) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*

**Notes:**
- The operation returns the newly created EncounterStudent ID using `scope_identity()`
- This record links the student to the evaluation encounter
- The EncounterStatusId of 15 indicates this is in a draft or in-progress state
- Date and time values are copied from the parent Encounter record
- The location needs to be selected from a dropdown by the user
- The DiagnosisCodeId is copied from the parent Encounter record
- Many fields are left NULL initially (ReasonForReturn, EncounterNumber, SupervisorComments, etc.)
- These NULL fields will be populated later in the workflow as the evaluation progresses

#### 5A.2 Update Evaluation Encounter Student with Encounter Number
```sql
UPDATE [dbo].[EncounterStudents]
SET [EncounterNumber] = @EncounterNumber
WHERE ([Id] = @Id)
```

**Columns updated:**
- ≡ƒöä `EncounterNumber`: Unique identifier for the evaluation encounter (e.g., 'E0010327250011') - *auto-populated*

**Where condition:**
- ≡ƒöä `Id`: The ID of the EncounterStudent to update (e.g., 11) - *auto-populated*

**Notes:**
- This update assigns a unique encounter number to the evaluation encounter student record
- The number appears to follow a specific format starting with 'E' for evaluation encounters
- This occurs automatically after the evaluation encounter details are populated - no user input required
- The encounter number is used for tracking, reporting, and potentially billing purposes
- This appears to be the final step in the basic creation of an evaluation encounter

#### 5A.3 Create Initial Evaluation Encounter Student Status Record
```sql
INSERT [dbo].[EncounterStudentStatuses]([EncounterStudentId], [EncounterStatusId], [CreatedById], [DateCreated])
VALUES (@EncounterStudentId, @EncounterStatusId, @CreatedById, @DateCreated)
```

**Columns populated:**
- ≡ƒöä `EncounterStudentId`: Foreign key reference to the evaluation EncounterStudent record (e.g., 11) - *auto-populated*
- ≡ƒöä `EncounterStatusId`: Initial status of the evaluation encounter (e.g., 15 - likely "Draft" or "In Progress") - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*

**Notes:**
- The operation returns the newly created EncounterStudentStatus ID using `scope_identity()`
- This record tracks the initial status of the evaluation encounter student record
- The EncounterStatusId of 15 matches the status set in the EncounterStudent record
- This creates the first entry in the audit trail for the evaluation encounter's status progression
- This is the final step in the basic creation of an evaluation encounter
- The status will be updated as the evaluation progresses through the workflow

### 6. Saving the Encounter with CPT Codes

#### 6.1 Create Encounter Student CPT Code Record
```sql
INSERT [dbo].[EncounterStudentCptCodes]([EncounterStudentId], [CptCodeId], [Minutes], [Archived], [CreatedById], [ModifiedById], [DateCreated], [DateModified])
VALUES (@EncounterStudentId, @CptCodeId, @Minutes, @Archived, @CreatedById, NULL, @DateCreated, NULL)
```

**Columns populated:**
- ≡ƒöä `EncounterStudentId`: Foreign key reference to the EncounterStudent record created in step 5.1 (e.g., 3) - *auto-populated*
- ≡ƒöì `CptCodeId`: Foreign key reference to the CPT code (e.g., 1) - *selected from UI dropdown*
- ≡ƒöä `Minutes`: Duration in minutes for the CPT code (e.g., 30) - *auto-populated from encounter duration*
- ≡ƒöä `Archived`: Boolean flag indicating if the record is archived (false/0) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `ModifiedById`: User ID of the person who last modified the record (NULL for new records) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of last modification (NULL for new records) - *auto-populated*

**Notes:**
- The operation returns the newly created EncounterStudentCptCode ID using `scope_identity()`
- Adding a CPT code is required to save the encounter
- CPT (Current Procedural Terminology) codes are standardized codes used for medical billing
- The Minutes field is automatically calculated from the difference between encounter start and end times
- This is an essential step for billing and reimbursement purposes
- Multiple CPT codes could potentially be added to a single encounter

#### 6.2 Update Encounter Student with Modification Info
```sql
UPDATE [dbo].[EncounterStudents]
SET [ModifiedById] = @ModifiedById, [DateModified] = @DateModified
WHERE ([Id] = @Id)
```

**Columns updated:**
- ≡ƒöä `ModifiedById`: User ID of the person who modified the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of modification (current date/time) - *auto-populated*

**Where condition:**
- ≡ƒöä `Id`: The ID of the EncounterStudent to update (e.g., 3) - *auto-populated*

**Notes:**
- This update occurs immediately after adding the CPT code and saving the encounter
- It records who modified the encounter student record and when
- This is part of the encounter finalization process
- The modification information helps track changes to the encounter over time

### 7. Completing Nursing Goals (Treatment only)

#### 7.1 Update Encounter Student Goal with Outcome Details
```sql
UPDATE [dbo].[EncounterStudentGoals]
SET [ModifiedById] = @ModifiedById, [DateModified] = @DateModified, [NursingResponseNote] = @NursingResponseNote, [NursingResultNote] = @NursingResultNote, [NursingGoalResultId] = @NursingGoalResultId
WHERE ([Id] = @Id)
```

**Columns updated:**
- ≡ƒöä `ModifiedById`: User ID of the person who modified the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of modification (current date/time) - *auto-populated*
- ≡ƒöñ `NursingResponseNote`: Notes about nursing response (e.g., 'test') - *manually entered*
- ≡ƒöñ `NursingResultNote`: Notes about nursing results (e.g., 'note') - *manually entered*
- ≡ƒöñ `NursingGoalResultId`: Result identifier for the nursing goal (e.g., 1) - *manually entered*

**Where condition:**
- ≡ƒöä `Id`: The ID of the EncounterStudentGoal to update (e.g., 3) - *auto-populated*

**Notes:**
- This update is required before an encounter can be e-signed/completed
- It documents the outcomes/results of the nursing intervention related to the goal
- The nursing goal result (NursingGoalResultId) likely comes from a lookup table of possible outcomes
- At least one goal must have outcome details entered before the encounter can be finalized
- This information is essential for documenting the effectiveness of the nursing intervention

### 8. E-Signing/Completing the Encounter

#### 8.1 Update Encounter Student Before Signing
```sql
UPDATE [dbo].[EncounterStudents]
SET [ModifiedById] = @ModifiedById, [DateModified] = @DateModified
WHERE ([Id] = @Id)
```

**Columns updated:**
- ≡ƒöä `ModifiedById`: User ID of the person who modified the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of modification (current date/time) - *auto-populated*

**Where condition:**
- ≡ƒöä `Id`: The ID of the EncounterStudent to update (e.g., 3) - *auto-populated*

**Notes:**
- This update occurs when initiating the e-signing/completion process
- It updates the modification timestamp just before the signature is applied
- This is the first of several operations that occur during encounter signing
- The record is marked as modified with the current user's ID and timestamp

#### 8.2 Create New Encounter Student Status Record
```sql
INSERT [dbo].[EncounterStudentStatuses]([EncounterStudentId], [EncounterStatusId], [CreatedById], [DateCreated])
VALUES (@EncounterStudentId, @EncounterStatusId, @CreatedById, @DateCreated)
```

**Columns populated:**
- ≡ƒöä `EncounterStudentId`: Foreign key reference to the EncounterStudent record (e.g., 3) - *auto-populated*
- ≡ƒöä `EncounterStatusId`: New status of the encounter (e.g., 2 - likely "Completed" or "Signed") - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*

**Notes:**
- The operation returns the newly created EncounterStudentStatus ID using `scope_identity()`
- This record tracks the change in status from the initial draft/pending status to a completed/signed status
- The EncounterStatusId of 2 likely represents a completed or signed status (compared to 14 in the initial record)
- This creates another entry in the audit trail for the encounter's status history
- This is a key part of the e-signing workflow that indicates the encounter has been reviewed and approved

#### 8.3 Apply E-Signature to Encounter Student Record
```sql
UPDATE [dbo].[EncounterStudents]
SET [EncounterStatusId] = @EncounterStatusId, [ESignatureText] = @ESignatureText, [ESignedById] = @ESignedById, [DateESigned] = @DateESigned
WHERE ([Id] = @Id)
```

**Columns updated:**
- ≡ƒöä `EncounterStatusId`: New status of the encounter (e.g., 27 - likely "Signed" or "Completed") - *auto-populated*
- ≡ƒöä `ESignatureText`: The full text of the electronic signature declaration (a legal attestation) - *auto-populated*
- ≡ƒöä `ESignedById`: User ID of the person electronically signing (e.g., 1007) - *auto-populated*
- ≡ƒöä `DateESigned`: Timestamp when the encounter was electronically signed (current date/time) - *auto-populated*

**Where condition:**
- ≡ƒöä `Id`: The ID of the EncounterStudent to update (e.g., 3) - *auto-populated*

**Notes:**
- This update applies the formal electronic signature to the encounter record
- The EncounterStatusId changes to 27, which likely represents a signed/completed status
- The ESignatureText contains a complete legal declaration including the provider's name and credentials
- The declaration acknowledges that the provider is legally applying their electronic signature
- This is a critical step that makes the encounter official and legally binding
- The record captures who signed and when (ESignedById and DateESigned)
- This creates a permanent record of the provider's attestation of services provided

#### 8.4 Create Final Encounter Student Status Record
```sql
INSERT [dbo].[EncounterStudentStatuses]([EncounterStudentId], [EncounterStatusId], [CreatedById], [DateCreated])
VALUES (@EncounterStudentId, @EncounterStatusId, @CreatedById, @DateCreated)
```

**Columns populated:**
- ≡ƒöä `EncounterStudentId`: Foreign key reference to the EncounterStudent record (e.g., 3) - *auto-populated*
- ≡ƒöä `EncounterStatusId`: Final status of the encounter (e.g., 27 - the signed/completed status) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*

**Notes:**
- The operation returns the newly created EncounterStudentStatus ID using `scope_identity()`
- This record tracks the final status change to the signed/completed status
- The EncounterStatusId of 27 matches the status ID set in the EncounterStudent record in step 8.3
- This completes the audit trail for the encounter's status progression
- Multiple status records provide a history of how the encounter progressed through the workflow
- This is part of the final step in completing and signing the encounter

#### 8.5 Final Update to Encounter Student Record
```sql
UPDATE [dbo].[EncounterStudents]
SET [ModifiedById] = @ModifiedById, [DateModified] = @DateModified
WHERE ([Id] = @Id)
```

**Columns updated:**
- ≡ƒöä `ModifiedById`: User ID of the person who modified the record (e.g., 1007) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of modification (current date/time) - *auto-populated*

**Where condition:**
- ≡ƒöä `Id`: The ID of the EncounterStudent to update (e.g., 3) - *auto-populated*

**Notes:**
- This final update occurs after all e-signing operations are complete
- It registers the very last modification to the encounter student record
- This update marks the completion of the entire nursing encounter creation and signing process
- The timestamp provides the final record of when the encounter was fully processed

## 9. Moving an Encounter to "Ready for Billing" Status

After e-signing, the encounter is in a "Pending Consent" status, which requires additional steps to be completed before it can be billed. These steps are typically performed by a district administrator rather than the provider.

### 9.1 Update Student Parental Consent Record

```sql
UPDATE [dbo].[StudentParentalConsents]
SET [ParentalConsentDateEntered] = @ParentalConsentDateEntered, 
    [ParentalConsentTypeId] = @ParentalConsentTypeId, 
    [ModifiedById] = @ModifiedById, 
    [DateModified] = @DateModified
WHERE ([Id] = @Id)
```

**Columns updated:**
- ≡ƒöñ `ParentalConsentDateEntered`: Date when parental consent was entered (e.g., '2025-03-21 17:02:03.0133333') - *manually entered*
- ≡ƒöì `ParentalConsentTypeId`: Type of parental consent (e.g., 1) - *selected from UI dropdown*
- ≡ƒöä `ModifiedById`: User ID of the person who modified the record (e.g., 1006 - district administrator) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of modification (current date/time) - *auto-populated*

**Where condition:**
- ≡ƒöä `Id`: The ID of the StudentParentalConsent to update (e.g., 3) - *auto-populated*

**Notes:**
- This update is performed by a district administrator, not the provider who created the encounter
- The initially auto-generated parental consent record is updated with actual consent information
- The ModifiedById (1006) is different from the CreatedById used in previous operations (1007), indicating different user roles
- This is a required step to move an encounter from "Pending Consent" status to "Ready for Billing"
- The ParentalConsentTypeId of 1 likely represents a specific type of consent (e.g., "Written Consent")

### 9.2 Update Encounter Student Status
```sql
UPDATE [dbo].[EncounterStudents]
SET [EncounterStatusId] = @EncounterStatusId
WHERE ([Id] = @Id)
```

**Columns updated:**
- ≡ƒöä `EncounterStatusId`: New status of the encounter (e.g., 33 - likely "Ready for Billing") - *auto-populated*

**Where condition:**
- ≡ƒöä `Id`: The ID of the EncounterStudent to update (e.g., 3) - *auto-populated*

**Notes:**
- This update occurs after the parental consent has been properly recorded
- The EncounterStatusId changes from "Pending Consent" to a billing-ready status (33)
- This is performed by the district administrator after updating the parental consent
- This status change indicates that the encounter has all the necessary requirements to be billed
- No signature information or other fields are modified in this operation
- This is a key step in the revenue cycle management process

### 9.3 Create Final Billing-Ready Status Record
```sql
INSERT [dbo].[EncounterStudentStatuses]([EncounterStudentId], [EncounterStatusId], [CreatedById], [DateCreated])
VALUES (@EncounterStudentId, @EncounterStatusId, @CreatedById, @DateCreated)
```

**Columns populated:**
- ≡ƒöä `EncounterStudentId`: Foreign key reference to the EncounterStudent record (e.g., 3) - *auto-populated*
- ≡ƒöä `EncounterStatusId`: New billing-ready status of the encounter (e.g., 33) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1006 - district administrator) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*

**Notes:**
- The operation returns the newly created EncounterStudentStatus ID using `scope_identity()`
- This record captures the final status change to "Ready for Billing" in the status history
- The EncounterStatusId of 33 matches the status just set in the EncounterStudent record in step 9.2
- This completes the audit trail for the encounter's status progression from Draft ΓåÆ Signed ΓåÆ Pending Consent ΓåÆ Ready for Billing
- Note that the CreatedById (1006) is the district administrator, not the provider who created the encounter
- This is the final step required to prepare the encounter for the billing process
- Once in this status, the encounter should appear in billing reports and be available for claim generation

## 10. Resolving "Missing Medicaid Number" Status

After updating parental consent, the encounter may transition to a "Missing Medicaid Number" status. This status cannot be resolved by a district administrator and requires intervention by a system administrator (an employee of the software company).

### 10.1 Update Student Record with Medicaid Number

```sql
UPDATE [dbo].[Students]
SET [MiddleName] = @MiddleName, 
    [MedicaidNo] = @MedicaidNo, 
    [DateOfBirth] = @DateOfBirth, 
    [Notes] = @Notes, 
    [ModifiedById] = @ModifiedById, 
    [DateModified] = @DateModified
WHERE ([Id] = @Id)
```

**Columns updated:**
- ≡ƒöñ `MiddleName`: Student's middle name (empty string in this example) - *manually entered*
- ≡ƒöñ `MedicaidNo`: Student's Medicaid number (e.g., '098765432109') - *manually entered*
- ≡ƒöä `DateOfBirth`: Student's birth date (e.g., '2020-03-21') - *auto-populated from existing record*
- ≡ƒöñ `Notes`: Additional notes (empty string in this example) - *manually entered*
- ≡ƒöä `ModifiedById`: User ID of the person modifying the record (e.g., 1001 - system administrator) - *auto-populated*
- ≡ƒöä `DateModified`: Timestamp of modification (current date/time) - *auto-populated*

**Where condition:**
- ≡ƒöä `Id`: The ID of the Student to update (e.g., 2) - *auto-populated*

**Notes:**
- This update is performed by a system administrator, not the provider or district administrator
- The key change is adding the MedicaidNo, which is required for billing Medicaid services
- The ModifiedById (1001) indicates a system administrator role with higher privileges
- The system verifies the student's DateOfBirth while adding the Medicaid number
- Adding a Medicaid number is a critical step for Medicaid-billable services
- This update must be performed by a system administrator with appropriate access rights

### 10.2 Update Encounter Student Status to Ready for Billing
```sql
UPDATE [dbo].[EncounterStudents]
SET [EncounterStatusId] = @EncounterStatusId
WHERE ([Id] = @Id)
```

**Columns updated:**
- ≡ƒöä `EncounterStatusId`: New status of the encounter (e.g., 30 - "Ready for Billing") - *auto-populated*

**Where condition:**
- ≡ƒöä `Id`: The ID of the EncounterStudent to update (e.g., 3) - *auto-populated*

**Notes:**
- This update occurs after adding the Medicaid number to the student record
- The EncounterStatusId changes from "Missing Medicaid Number" to "Ready for Billing" (30)
- This is performed by the system administrator after adding the required Medicaid information
- This status change indicates that the encounter now has all the necessary information for billing
- This update is key for moving the encounter into the final billing workflow
- Status ID 30 appears to be another variant of a billing-ready status, possibly specific to Medicaid billing

### 10.3 Create Final Medicaid Billing-Ready Status Record
```sql
INSERT [dbo].[EncounterStudentStatuses]([EncounterStudentId], [EncounterStatusId], [CreatedById], [DateCreated])
VALUES (@EncounterStudentId, @EncounterStatusId, @CreatedById, @DateCreated)
```

**Columns populated:**
- ≡ƒöä `EncounterStudentId`: Foreign key reference to the EncounterStudent record (e.g., 3) - *auto-populated*
- ≡ƒöä `EncounterStatusId`: The final "Ready for Billing" status (e.g., 30) - *auto-populated*
- ≡ƒöä `CreatedById`: User ID of the person creating the record (e.g., 1001 - system administrator) - *auto-populated*
- ≡ƒöä `DateCreated`: Timestamp of creation (current date/time) - *auto-populated*

**Notes:**
- The operation returns the newly created EncounterStudentStatus ID using `scope_identity()`
- This record captures the final status change to the Medicaid-specific "Ready for Billing" status
- The EncounterStatusId of 30 matches the status just set in the EncounterStudent record in step 10.2
- This creates the final entry in the audit trail for the encounter's status progression
- The CreatedById (1001) indicates this was done by a system administrator with higher privileges
- This completes the full workflow of getting a nursing encounter from creation to billing-ready status
- The encounter has now progressed through multiple statuses: Draft ΓåÆ Signed ΓåÆ Pending Consent ΓåÆ Missing Medicaid Number ΓåÆ Ready for Billing
- The encounter is now fully prepared for Medicaid billing and claim generation
- This is the absolute final step in getting a nursing encounter ready for billing

## Observations and Requirements
- Note that for nursing providers, a case load script is required (unlike some other provider types)
- The workflow requires creating an address record before creating a student
- A provider-student relationship must exist before creating case loads and encounters
- A case load must exist before creating encounters for nursing services
- The case load must have an associated case load script for nursing providers
- Encounter creation is a two-step process: first creating a blank encounter, then updating it with details
- When adding a student to an encounter, the relevant case load must be referenced
- A CPT code must be added to the encounter to finalize it, which is essential for billing
- At least one nursing goal must have outcome details completed before the encounter can be e-signed

## Implementation Requirements for EncounterImportService
Based on the observed database operations, these are the requirements to ensure the import service correctly creates nursing encounters:

1. Ensure proper validation of provider, student, and school/district relationships
2. Create or verify a provider-student relationship exists before creating case loads
3. For nursing encounters, ensure a case load with an appropriate service code exists
4. For nursing encounters, ensure a case load script exists with valid doctor information and dates
5. When creating encounters, properly link to the appropriate case load in the EncounterStudent record
6. Maintain proper date/time fields on both the Encounter and EncounterStudent records
7. Assign appropriate CPT codes with duration information to allow for billing
8. For completed encounters, provide outcome details for at least one nursing goal 