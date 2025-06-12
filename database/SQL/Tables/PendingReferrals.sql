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