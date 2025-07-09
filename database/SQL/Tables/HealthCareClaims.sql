CREATE TABLE [dbo].[HealthCareClaims]
(
	[Id] INT NOT NULL  IDENTITY, 
    [DateCreated] DATETIME NOT NULL DEFAULT (getdate()), 
    [PageCount] INT NOT NULL DEFAULT 1,
    [BillingScheduleId] INT NULL,
    CONSTRAINT [PK_HealthCareClaims] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_HealthCareClaims_BillingSchedules] FOREIGN KEY ([BillingScheduleId]) REFERENCES BillingSchedules(Id),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_HealthCareClaims_BillingScheduleId] 
ON [dbo].[HealthCareClaims] ([BillingScheduleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
