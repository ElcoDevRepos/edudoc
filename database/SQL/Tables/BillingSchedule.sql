CREATE TABLE [dbo].[BillingSchedules]
(
	[Id] INT NOT NULL  IDENTITY,
    [Name] VARCHAR(50) NOT NULL, 
    [ScheduledDate] DATETIME NOT NULL DEFAULT GETUTCDATE(), 
    [IsReversal] BIT NOT NULL DEFAULT 0,
    [IsSchedule] BIT NOT NULL DEFAULT 0,
    [Notes] VarChar(500) NULL, 
	[InQueue]  BIT NOT NULL   DEFAULT 0,
	[Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1,  
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
	CONSTRAINT [FK_BillingSchedules_CreatedBy] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_BillingSchedules_ModifiedBy] FOREIGN KEY ([ModifiedById]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_BillingSchedules] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_BillingSchedules_CreatedById] 
ON [dbo].[BillingSchedules] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_BillingSchedules_ModifiedById] 
ON [dbo].[BillingSchedules] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'BillingSchedules',
    @level2type = N'COLUMN',
    @level2name = N'Id'
