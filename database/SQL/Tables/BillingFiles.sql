CREATE TABLE [dbo].[BillingFiles]
(
	[Id] INT NOT NULL  IDENTITY, 
    [Name] VARCHAR(200) NOT NULL, 
    [DateCreated] DATETIME NOT NULL DEFAULT (getdate()), 
    [FilePath] VARCHAR(200) NOT NULL,
    [ClaimsCount] INT NULL,
    [PageNumber] INT NOT NULL DEFAULT 1,
    [CreatedById] INT NULL,
    [HealthCareClaimId] INT NOT NULL,
    CONSTRAINT [PK_BillingFiles] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_BillingFiles_Users] FOREIGN KEY ([CreatedById]) REFERENCES Users(Id),
    CONSTRAINT [FK_BillingFiles_HealthCareClaim] FOREIGN KEY ([HealthCareClaimId]) REFERENCES HealthCareClaims(Id),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_BillingFiles_CreatedById] 
ON [dbo].[BillingFiles] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_BillingFiles_HealthCareClaimId] 
ON [dbo].[BillingFiles] ([HealthCareClaimId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

