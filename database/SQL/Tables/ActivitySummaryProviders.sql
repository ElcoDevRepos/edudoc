CREATE TABLE [dbo].[ActivitySummaryProviders]
(
	[Id] INT NOT NULL  IDENTITY,
    [ProviderId] INT NOT NULL,
    [ProviderName] VARCHAR(250) NOT NULL,
    [ReferralsPending] INT NOT NULL DEFAULT 0,
    [EncountersReturned] INT NOT NULL DEFAULT 0,
    [PendingSupervisorCoSign] INT NOT NULL DEFAULT 0,
    [PendingEvaluations] INT NOT NULL DEFAULT 0,
    [DateCreated] DATETIME NOT NULL DEFAULT (getdate()),
    [CreatedById] INT NULL DEFAULT 1,
    [ActivitySummaryServiceAreaId] INT NULL,
    CONSTRAINT [PK_ActivitySummaryProviders] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ActivitySummaryProviders_Users] FOREIGN KEY ([CreatedById]) REFERENCES Users(Id),
    CONSTRAINT [FK_ActivitySummaryProviders_ActivitySummaryServiceAreas] FOREIGN KEY ([ActivitySummaryServiceAreaId]) REFERENCES ActivitySummaryServiceAreas(Id), 
    CONSTRAINT [FK_ActivitySummaryProviders_Providers] FOREIGN KEY ([ProviderId]) REFERENCES [Providers]([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ActivitySummaryProviders_ProviderId] 
ON [dbo].[ActivitySummaryProviders] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ActivitySummaryProviders_CreatedById] 
ON [dbo].[ActivitySummaryProviders] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ActivitySummaryProviders_ActivitySummaryServiceAreaId] 
ON [dbo].[ActivitySummaryProviders] ([ActivitySummaryServiceAreaId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

