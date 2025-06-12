CREATE TABLE [dbo].[ActivitySummaryDistricts]
(
	[Id] INT NOT NULL  IDENTITY,
    [DistrictId] INT NOT NULL,
    [ReferralsPending] INT NOT NULL DEFAULT 0,
    [EncountersReturned] INT NOT NULL DEFAULT 0,
    [PendingSupervisorCoSign] INT NOT NULL DEFAULT 0,
    [EncountersReadyForScheduling] INT NOT NULL DEFAULT 0,
    [PendingEvaluations] INT NOT NULL DEFAULT 0,
    [DateCreated] DATETIME NOT NULL DEFAULT (getdate()),
    [CreatedById] INT NULL DEFAULT 1,
    [ActivitySummaryId] INT NULL,
    CONSTRAINT [PK_ActivitySummaryDistricts] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ActivitySummaryDistricts_Users] FOREIGN KEY ([CreatedById]) REFERENCES Users(Id),
    CONSTRAINT [FK_ActivitySummaryDistricts_ActivitySummaries] FOREIGN KEY ([ActivitySummaryId]) REFERENCES ActivitySummaries(Id), 
    CONSTRAINT [FK_ActivitySummaryDistricts_SchoolDistricts] FOREIGN KEY ([DistrictId]) REFERENCES [SchoolDistricts]([Id])
)
