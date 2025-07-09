CREATE TABLE [dbo].[ClaimsEncounters]
(
	[Id] INT NOT NULL  IDENTITY, 
    [ClaimAmount] VARCHAR(18) NOT NULL,
    [ProcedureIdentifier] VARCHAR(50) NOT NULL,
    [BillingUnits] VARCHAR(15) NOT NULL,
    [ServiceDate] DateTime NOT NULL,
    [PhysicianFirstName] VARCHAR(35) NULL,
    [PhysicianLastName] VARCHAR(60) NULL,
    [PhysicianId] VARCHAR(80) CONSTRAINT [CK_ClaimsEncounters_PhysicianId] CHECK (LEN([PhysicianId]) >= 2) NULL,
    [ReferringProviderFirstName] VARCHAR(35) NULL,
    [ReferringProviderLastName] VARCHAR(60) NULL,
    [ReasonForServiceCode] VARCHAR(50) NOT NULL,
    [ReferringProviderId] VARCHAR(80) NOT NULL,
    [IsTelehealth] BIT NOT NULL DEFAULT(0),
    [Rebilled] BIT NOT NULL DEFAULT(0),
    [Response] BIT NOT NULL DEFAULT(0),
    [EdiErrorCodeId] INT NULL,
    [ClaimId] varchar(15) NULL,
    [ClaimsStudentId] INT NULL,
    [EncounterStudentId] INT NOT NULL,
    [AggregateId] INT NULL,
    [EncounterStudentCptCodeId] INT NOT NULL,
    [PaidAmount] VARCHAR(18) NULL,
    [VoucherDate] DateTime NULL,
    [ReferenceNumber] VARCHAR(50) NULL,
    [AdjustmentReasonCode] VARCHAR(5) NULL,
    [AdjustmentAmount] VARCHAR(20) NULL,
    [ControlNumberPrefix] VARCHAR(3) NULL,
    [ReversedClaimId] INT NULL,
    CONSTRAINT [FK_ClaimsEncounters_ClaimsStudent] FOREIGN KEY ([ClaimsStudentId]) REFERENCES ClaimsStudents(Id),
    CONSTRAINT [FK_ClaimsEncounters_EncounterStudent] FOREIGN KEY ([EncounterStudentId]) REFERENCES EncounterStudents(Id),
    CONSTRAINT [FK_ClaimsEncounters_AggregateCptCode] FOREIGN KEY ([AggregateId]) REFERENCES EncounterStudentCptCodes(Id),
    CONSTRAINT [FK_ClaimsEncounters_EncounterStudentCptCode] FOREIGN KEY ([EncounterStudentCptCodeId]) REFERENCES EncounterStudentCptCodes(Id),
    CONSTRAINT [FK_ClaimsEncounters_EdiErrorCode] FOREIGN KEY ([EdiErrorCodeId]) REFERENCES EdiErrorCodes(Id),
    CONSTRAINT [FK_ClaimsEncounters_ReversedClaim] FOREIGN KEY ([ReversedClaimId]) REFERENCES [HealthCareClaims]([Id]),
    CONSTRAINT [PK_ClaimsEncounters] PRIMARY KEY ([Id]), 
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'ClaimsEncounters',
    @level2type = N'COLUMN',
    @level2name = N'Id'

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ClaimsEncounters_AggregateId] 
ON [dbo].[ClaimsEncounters] ([AggregateId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ClaimsEncounters_EncounterStudentId] 
ON [dbo].[ClaimsEncounters] ([EncounterStudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ClaimsEncounters_ClaimsStudentId] 
ON [dbo].[ClaimsEncounters] ([ClaimsStudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ClaimsEncounters_EncounterStudentCptCodeId] 
ON [dbo].[ClaimsEncounters] ([EncounterStudentCptCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ClaimsEncounters_EdiErrorCodeId] 
ON [dbo].[ClaimsEncounters] ([EdiErrorCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ClaimsEncounters_ReversedClaimId] 
ON [dbo].[ClaimsEncounters] ([ReversedClaimId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Claims processing and voucher matching
CREATE NONCLUSTERED INDEX [IX_ClaimsEncounters_VoucherDate_ClaimsStudentId] 
ON [dbo].[ClaimsEncounters] ([VoucherDate], [ClaimsStudentId])
INCLUDE ([ClaimAmount], [PaidAmount], [ServiceDate])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Service date range queries
CREATE NONCLUSTERED INDEX [IX_ClaimsEncounters_ServiceDate_Response] 
ON [dbo].[ClaimsEncounters] ([ServiceDate], [Response])
INCLUDE ([ClaimAmount], [EdiErrorCodeId])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);
