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
