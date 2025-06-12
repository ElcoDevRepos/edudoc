CREATE TABLE [dbo].[ActivitySummaryServiceAreas]
(
	[Id] INT NOT NULL  IDENTITY,
    [ServiceAreaId] INT NOT NULL,
    [ReferralsPending] INT NOT NULL DEFAULT 0,
    [EncountersReturned] INT NOT NULL DEFAULT 0,
    [PendingSupervisorCoSign] INT NOT NULL DEFAULT 0,
    [PendingEvaluations] INT NOT NULL DEFAULT 0,
    [OpenScheduledEncounters] INT NOT NULL DEFAULT 0,
    [DateCreated] DATETIME NOT NULL DEFAULT (getdate()),
    [CreatedById] INT NULL DEFAULT 1,
    [ActivitySummaryDistrictId] INT NULL,
    CONSTRAINT [PK_ActivitySummaryServiceAreas] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ActivitySummaryServiceAreas_Users] FOREIGN KEY ([CreatedById]) REFERENCES Users(Id),
    CONSTRAINT [FK_ActivitySummaryServiceAreas_ActivitySummaryDistricts] FOREIGN KEY ([ActivitySummaryDistrictId]) REFERENCES ActivitySummaryDistricts(Id), 
    CONSTRAINT [FK_ActivitySummaryServiceAreas_ServiceCodes] FOREIGN KEY ([ServiceAreaId]) REFERENCES [ServiceCodes]([Id]),
)
