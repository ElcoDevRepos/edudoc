CREATE TABLE [dbo].[BillingScheduleDistricts]
(
	[Id] INT NOT NULL  IDENTITY, 
	[SchoolDistrictId] INT NOT NULL,
	[BillingScheduleId] INT NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
	CONSTRAINT [FK_BillingScheduleDistricts_CreatedBy] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_BillingScheduleDistricts_BillingSchedule] FOREIGN KEY ([BillingScheduleId]) REFERENCES [dbo].[BillingSchedules] ([Id]),
	CONSTRAINT [FK_BillingScheduleDistricts_SchoolDistrict] FOREIGN KEY ([SchoolDistrictId]) REFERENCES [dbo].[SchoolDistricts] ([Id]),
    CONSTRAINT [PK_BillingScheduleDistricts] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_BillingScheduleDistricts_SchoolDistrictId] 
ON [dbo].[BillingScheduleDistricts] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_BillingScheduleDistricts_BillingScheduleId] 
ON [dbo].[BillingScheduleDistricts] ([BillingScheduleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_BillingScheduleDistricts_CreatedById] 
ON [dbo].[BillingScheduleDistricts] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

