CREATE TABLE [dbo].[PendingReferrals]
(
    [Id] INT IDENTITY NOT NULL,
    [StudentId] INT NOT NULL,
    [StudentFirstName] VARCHAR(50) NOT NULL,
    [StudentLastName] VARCHAR(50) NOT NULL,
    [DistrictId] INT NOT NULL,
    [DistrictCode] VARCHAR(50) NOT NULL,
    [ProviderId] INT NOT NULL,
    [ProviderFirstName] VARCHAR(50) NOT NULL,
    [ProviderLastName] VARCHAR(50) NOT NULL,
    [ProviderTitle] VARCHAR(100) NOT NULL,
    [ServiceTypeId] INT NOT NULL,
    [ServiceName] VARCHAR(50) NOT NULL,
    [PendingReferralJobRunId] INT NOT NULL,

    CONSTRAINT [PK_PendingReferrals] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PendingReferrals_Students] FOREIGN KEY ([StudentId])
        REFERENCES [dbo].[Students] ([Id]),
    CONSTRAINT [FK_PendingReferrals_SchoolDistricts] FOREIGN KEY ([DistrictId])
        REFERENCES [dbo].[SchoolDistricts] ([Id]),
    CONSTRAINT [FK_PendingReferrals_Providers] FOREIGN KEY ([ProviderId])
        REFERENCES [dbo].[Providers] ([Id]),
    CONSTRAINT [FK_PendingReferrals_ServiceTypes] FOREIGN KEY ([ServiceTypeId])
        REFERENCES [dbo].[ServiceTypes] ([Id]),
    CONSTRAINT [FK_PendingReferrals_PendingReferralJobRuns] FOREIGN KEY ([PendingReferralJobRunId])
        REFERENCES [dbo].[PendingReferralReportJobRuns] ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_PendingReferrals_StudentId] 
ON [dbo].[PendingReferrals] ([StudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_PendingReferrals_DistrictId] 
ON [dbo].[PendingReferrals] ([DistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_PendingReferrals_ProviderId] 
ON [dbo].[PendingReferrals] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_PendingReferrals_ServiceTypeId] 
ON [dbo].[PendingReferrals] ([ServiceTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_PendingReferrals_PendingReferralJobRunId] 
ON [dbo].[PendingReferrals] ([PendingReferralJobRunId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO