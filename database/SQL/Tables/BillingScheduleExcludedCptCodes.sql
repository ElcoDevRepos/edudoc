CREATE TABLE [dbo].[BillingScheduleExcludedCptCodes]
(
	[Id] INT NOT NULL  IDENTITY, 
	[CptCodeId] INT NOT NULL,
	[BillingScheduleId] INT NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
	CONSTRAINT [FK_BillingScheduleExcludedCptCodes_CreatedBy] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_BillingScheduleExcludedCptCodes_BillingSchedule] FOREIGN KEY ([BillingScheduleId]) REFERENCES [dbo].[BillingSchedules] ([Id]),
	CONSTRAINT [FK_BillingScheduleExcludedCptCodes_CptCode] FOREIGN KEY ([CptCodeId]) REFERENCES [dbo].[CPTCodes] ([Id]),
    CONSTRAINT [PK_BillingScheduleExcludedCptCodes] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_BillingScheduleExcludedCptCodes_CptCodeId] 
ON [dbo].[BillingScheduleExcludedCptCodes] ([CptCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_BillingScheduleExcludedCptCodes_BillingScheduleId] 
ON [dbo].[BillingScheduleExcludedCptCodes] ([BillingScheduleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_BillingScheduleExcludedCptCodes_CreatedById] 
ON [dbo].[BillingScheduleExcludedCptCodes] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

