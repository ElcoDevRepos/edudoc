CREATE TABLE [dbo].[BillingScheduleAdminNotifications]
(
	[Id] INT NOT NULL IDENTITY, 
	[AdminId] INT NOT NULL,
	[BillingScheduleId] INT NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
	CONSTRAINT [FK_BillingScheduleAdminNotifications_CreatedBy] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_BillingScheduleAdminNotifications_BillingSchedule] FOREIGN KEY ([BillingScheduleId]) REFERENCES [dbo].[BillingSchedules] ([Id]),
	CONSTRAINT [FK_BillingScheduleAdminNotifications_Admin] FOREIGN KEY ([AdminId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_BillingScheduleAdminNotfications] PRIMARY KEY ([Id]),
)
