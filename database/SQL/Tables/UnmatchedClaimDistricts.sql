CREATE TABLE [dbo].[UnmatchedClaimDistricts]
(
	[Id] INT NOT NULL  IDENTITY, 
    [ResponseFileId] INT NOT NULL,
    [IdentificationCode] VARCHAR(80) NOT NULL,
    [DistrictOrganizationName] VARCHAR(60) NOT NULL,
    [Address] VARCHAR(55) NOT NULL,
    [City] VARCHAR(30) NOT NULL,
    [State] VARCHAR(2) NOT NULL,
    [PostalCode] VARCHAR(15) NOT NULL,
    [EmployerId] VARCHAR(50) NOT NULL,
    CONSTRAINT [FK_UnmatchedClaimDistricts_ResponseFile] FOREIGN KEY ([ResponseFileId]) REFERENCES BillingResponseFiles(Id),
    CONSTRAINT [PK_UnmatchedClaimDistricts] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_UnmatchedClaimDistricts_ResponseFileId] 
ON [dbo].[UnmatchedClaimDistricts] ([ResponseFileId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
