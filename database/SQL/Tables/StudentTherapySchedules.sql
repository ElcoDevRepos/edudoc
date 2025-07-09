CREATE TABLE [dbo].[StudentTherapySchedules]
(
	[Id] INT NOT NULL IDENTITY, 
    [StudentTherapyId] INT NOT NULL,
    [ScheduleStartTime] TIME(0) NULL, 
    [ScheduleEndTime] TIME(0) NULL, 
    [ScheduleDate] DATETIME NULL,
    [DeviationReasonId] INT NULL,
    [DeviationReasonDate] DATETIME NULL,
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_StudentTherapySchedules] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_StudentTherapySchedules_StudentTherapy] FOREIGN KEY (StudentTherapyId) REFERENCES [dbo].[StudentTherapies] ([Id]),
    CONSTRAINT [FK_StudentTherapySchedules_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_StudentTherapySchedules_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
)
Go
EXEC sp_addextendedproperty
@name = N'MS_Description',
@value = N'Module',
@level0type = N'SCHEMA',
@level0name = N'dbo',
@level1type = N'TABLE',
@level1name = N'StudentTherapySchedules',
@level2type = N'COLUMN',
@level2name = N'Id'

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_StudentTherapySchedules_StudentTherapyId] 
ON [dbo].[StudentTherapySchedules] ([StudentTherapyId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentTherapySchedules_DeviationReasonId] 
ON [dbo].[StudentTherapySchedules] ([DeviationReasonId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentTherapySchedules_CreatedById] 
ON [dbo].[StudentTherapySchedules] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentTherapySchedules_ModifiedById] 
ON [dbo].[StudentTherapySchedules] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
