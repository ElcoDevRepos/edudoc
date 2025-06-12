CREATE TABLE [dbo].[BillingScheduleExcludedProviders]
(
	[Id] INT NOT NULL  IDENTITY, 
	[ProviderId] INT NOT NULL,
	[BillingScheduleId] INT NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
	CONSTRAINT [FK_BillingScheduleExcludedProviders_CreatedBy] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_BillingScheduleExcludedProviders_BillingSchedule] FOREIGN KEY ([BillingScheduleId]) REFERENCES [dbo].[BillingSchedules] ([Id]),
	CONSTRAINT [FK_BillingScheduleExcludedProviders_Provider] FOREIGN KEY ([ProviderId]) REFERENCES [dbo].[Providers] ([Id]),
    CONSTRAINT [PK_BillingScheduleExcludedProviders] PRIMARY KEY ([Id]),
)
