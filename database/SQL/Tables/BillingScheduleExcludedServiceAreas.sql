CREATE TABLE [dbo].[BillingScheduleExcludedServiceCodes]
(
	[Id] INT NOT NULL  IDENTITY, 
	[ServiceCodeId] INT NOT NULL,
	[BillingScheduleId] INT NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
	CONSTRAINT [FK_BillingScheduleExcludedServiceTypes_CreatedBy] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_BillingScheduleExcludedServiceTypes_BillingSchedule] FOREIGN KEY ([BillingScheduleId]) REFERENCES [dbo].[BillingSchedules] ([Id]),
	CONSTRAINT [FK_BillingScheduleExcludedServiceTypes_ServiceCode] FOREIGN KEY ([ServiceCodeId]) REFERENCES [dbo].[ServiceCodes] ([Id]),
    CONSTRAINT [PK_BillingScheduleExcludedServiceTypes] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_BillingScheduleExcludedServiceCodes_ServiceCodeId] 
ON [dbo].[BillingScheduleExcludedServiceCodes] ([ServiceCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_BillingScheduleExcludedServiceCodes_BillingScheduleId] 
ON [dbo].[BillingScheduleExcludedServiceCodes] ([BillingScheduleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_BillingScheduleExcludedServiceCodes_CreatedById] 
ON [dbo].[BillingScheduleExcludedServiceCodes] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

