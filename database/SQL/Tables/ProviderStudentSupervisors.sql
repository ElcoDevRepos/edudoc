CREATE TABLE [dbo].[ProviderStudentSupervisors]
(
	[Id] INT NOT NULL IDENTITY,
    [AssistantId] INT NOT NULL ,
    [SupervisorId] INT NOT NULL ,
    [StudentId] INT NOT NULL ,
    [EffectiveStartDate] DATETIME NOT NULL, 
    [EffectiveEndDate] DATETIME NULL, 
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [FK_ProviderStudentSupervisors_Assistant] FOREIGN KEY ([AssistantId]) REFERENCES [dbo].[Providers] ([Id]),
    CONSTRAINT [FK_ProviderStudentSupervisors_Supervisor] FOREIGN KEY ([SupervisorId]) REFERENCES [Providers]([Id]),
    CONSTRAINT [FK_ProviderStudentSupervisors_Students] FOREIGN KEY ([StudentId]) REFERENCES [dbo].[Students] ([Id]),
    CONSTRAINT [FK_ProviderStudentSupervisors_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_ProviderStudentSupervisors_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_ProviderStudentSupervisors] PRIMARY KEY ([Id]),
)
GO
EXEC sp_addextendedproperty
@name = N'MS_Description',
@value = N'Module',
@level0type = N'SCHEMA',
@level0name = N'dbo',
@level1type = N'TABLE',
@level1name = N'ProviderStudentSupervisors',
@level2type = N'COLUMN',
@level2name = N'Id'

GO
create nonclustered index [IX_ProviderStudentSupervisors_StudentId_SupervisorId_EffectiveEndDate] on [dbo].[ProviderStudentSupervisors](StudentId, SupervisorId, EffectiveEndDate);
GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ProviderStudentSupervisors_AssistantId] 
ON [dbo].[ProviderStudentSupervisors] ([AssistantId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderStudentSupervisors_SupervisorId] 
ON [dbo].[ProviderStudentSupervisors] ([SupervisorId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderStudentSupervisors_StudentId] 
ON [dbo].[ProviderStudentSupervisors] ([StudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderStudentSupervisors_CreatedById] 
ON [dbo].[ProviderStudentSupervisors] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderStudentSupervisors_ModifiedById] 
ON [dbo].[ProviderStudentSupervisors] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Supervisor assignment with effective dates (common in EF)
CREATE NONCLUSTERED INDEX [IX_ProviderStudentSupervisors_SupervisorId_EffectiveEndDate] 
ON [dbo].[ProviderStudentSupervisors] ([SupervisorId], [EffectiveEndDate])
INCLUDE ([StudentId], [AssistantId], [EffectiveStartDate])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Assistant assignment filtering
CREATE NONCLUSTERED INDEX [IX_ProviderStudentSupervisors_AssistantId_EffectiveEndDate] 
ON [dbo].[ProviderStudentSupervisors] ([AssistantId], [EffectiveEndDate])
INCLUDE ([StudentId], [SupervisorId], [EffectiveStartDate])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);
