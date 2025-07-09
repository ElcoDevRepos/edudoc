CREATE TABLE [dbo].[UnmatchedClaimResponses]
(
	[Id] INT NOT NULL  IDENTITY, 
    [ProcedureIdentifier] VARCHAR(50) NOT NULL,
    [ClaimAmount] VARCHAR(18) NOT NULL,
    [PaidAmount] VARCHAR(18) NULL,
    [ServiceDate] DateTime NOT NULL,
    [PatientFirstName] VARCHAR(35) NULL,
    [PatientLastName] VARCHAR(60) NULL,
    [PatientId] VARCHAR(80) NOT NULL,
    [EdiErrorCodeId] INT NULL,
    [DistrictId] INT NULL,
    [UnmatchedDistrictId] INT NULL,
    [ResponseFileId] INT NOT NULL,
    [ClaimId] varchar(25) NULL,
    [VoucherDate] DateTime NULL,
    [ReferenceNumber] VARCHAR(50) NULL,
    [AdjustmentReasonCode] VARCHAR(5) NULL,
    [AdjustmentAmount] VARCHAR(20) NULL,
    CONSTRAINT [FK_UnmatchedClaimResponses_ResponseFile] FOREIGN KEY ([ResponseFileId]) REFERENCES BillingResponseFiles(Id),
    CONSTRAINT [FK_UnmatchedClaimResponses_EdiErrorCode] FOREIGN KEY ([EdiErrorCodeId]) REFERENCES EdiErrorCodes(Id),
    CONSTRAINT [FK_UnmatchedClaimResponses_District] FOREIGN KEY ([DistrictId]) REFERENCES SchoolDistricts(Id),
    CONSTRAINT [FK_UnmatchedClaimResponses_UnmatchedDistrict] FOREIGN KEY ([UnmatchedDistrictId]) REFERENCES UnmatchedClaimDistricts(Id),
    CONSTRAINT [PK_UnmatchedClaimResponses] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_UnmatchedClaimResponses_ResponseFileId] 
ON [dbo].[UnmatchedClaimResponses] ([ResponseFileId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_UnmatchedClaimResponses_EdiErrorCodeId] 
ON [dbo].[UnmatchedClaimResponses] ([EdiErrorCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_UnmatchedClaimResponses_DistrictId] 
ON [dbo].[UnmatchedClaimResponses] ([DistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_UnmatchedClaimResponses_UnmatchedDistrictId] 
ON [dbo].[UnmatchedClaimResponses] ([UnmatchedDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
