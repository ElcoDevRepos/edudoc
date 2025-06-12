CREATE TABLE [dbo].[PendingReferralReportJobRuns]
(
    [Id] INT IDENTITY NOT NULL,
    [JobRunDate] DATETIME NOT NULL DEFAULT GETDATE(),
    [JobRunById] INT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_PendingReferralReportJobRuns] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_PendingReferralReportJobRuns_Users] FOREIGN KEY ([JobRunById])
        REFERENCES [dbo].[Users]([Id]),
)