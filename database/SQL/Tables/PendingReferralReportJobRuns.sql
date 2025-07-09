CREATE TABLE [dbo].[PendingReferralReportJobRuns]
(
    [Id] INT IDENTITY NOT NULL,
    [JobRunDate] DATETIME NOT NULL DEFAULT GETDATE(),
    [JobRunById] INT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_PendingReferralReportJobRuns] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PendingReferralReportJobRuns_Users] FOREIGN KEY ([JobRunById])
        REFERENCES [dbo].[Users]([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_PendingReferralReportJobRuns_JobRunById] 
ON [dbo].[PendingReferralReportJobRuns] ([JobRunById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO