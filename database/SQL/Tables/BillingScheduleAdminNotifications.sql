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

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_BillingScheduleAdminNotifications_AdminId] 
ON [dbo].[BillingScheduleAdminNotifications] ([AdminId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_BillingScheduleAdminNotifications_BillingScheduleId] 
ON [dbo].[BillingScheduleAdminNotifications] ([BillingScheduleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_BillingScheduleAdminNotifications_CreatedById] 
ON [dbo].[BillingScheduleAdminNotifications] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

