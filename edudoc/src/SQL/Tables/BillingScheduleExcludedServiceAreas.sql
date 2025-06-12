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
