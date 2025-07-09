CREATE TABLE [dbo].[Goals]
(
	[Id] INT IDENTITY NOT NULL,
    [Description] VARCHAR(500) NOT NULL,
    [Archived] BIT NOT NULL DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    [NursingResponseId] INT NULL,
    CONSTRAINT [PK_Goals] PRIMARY KEY ([Id]),
    CONSTRAINT  [FK_Goals_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users](Id),
    CONSTRAINT  [FK_Goals_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users](Id),
	CONSTRAINT [FK_Goals_NursingGoalResponse] FOREIGN KEY (NursingResponseId) REFERENCES [dbo].[NursingGoalResponse] ([Id])
)
GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_Goals_CreatedById] 
ON [dbo].[Goals] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Goals_ModifiedById] 
ON [dbo].[Goals] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Goals_NursingResponseId] 
ON [dbo].[Goals] ([NursingResponseId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Goals',
    @level2type = N'COLUMN',
    @level2name = N'Id'

