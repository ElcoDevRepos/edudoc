CREATE TABLE [dbo].[ActivitySummaries]
(
	[Id] INT NOT NULL  IDENTITY, 
    [ReferralsPending] INT NOT NULL DEFAULT 0,
    [EncountersReturned] INT NOT NULL DEFAULT 0,
    [PendingSupervisorCoSign] INT NOT NULL DEFAULT 0,
    [PendingEvaluations] INT NOT NULL DEFAULT 0,
    [DateCreated] DATETIME NOT NULL DEFAULT (getdate()),
    [CreatedById] INT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_ActivitySummaries] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ActivitySummaries_Users] FOREIGN KEY ([CreatedById]) REFERENCES Users(Id),
)
