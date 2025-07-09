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

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ActivitySummaries_CreatedById] 
ON [dbo].[ActivitySummaries] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
