CREATE TABLE [dbo].[JobsAudit]
(
	[Id] INT NOT NULL  IDENTITY,
    [FileType] INT NOT NULL,
    [StartDate] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    [EndDate] DATETIME NULL,
    [BillingScheduleId] INT NULL, 
    [CreatedById] INT NULL, 
	CONSTRAINT [FK_JobsAudit_CreatedBy] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_JobsAudit_BillingSchedule] FOREIGN KEY ([BillingScheduleId]) REFERENCES [dbo].[BillingSchedules] ([Id]),
    CONSTRAINT [PK_JobsAudit] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_JobsAudit_CreatedById] 
ON [dbo].[JobsAudit] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_JobsAudit_BillingScheduleId] 
ON [dbo].[JobsAudit] ([BillingScheduleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
