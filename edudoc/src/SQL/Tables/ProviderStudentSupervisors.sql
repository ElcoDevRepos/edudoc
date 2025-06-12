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
Go
EXEC sp_addextendedproperty
@name = N'MS_Description',
@value = N'Module',
@level0type = N'SCHEMA',
@level0name = N'dbo',
@level1type = N'TABLE',
@level1name = N'ProviderStudentSupervisors',
@level2type = N'COLUMN',
@level2name = N'Id'

Go
create nonclustered index [IX_ProviderStudentSupervisors_StudentId_SupervisorId_EffectiveEndDate] on [dbo].[ProviderStudentSupervisors](StudentId, SupervisorId, EffectiveEndDate);

GO

create nonclustered index [IX_ProviderStudentSupervisors_AssistantId] ON [dbo].[ProviderStudentSupervisors] ([AssistantId])
INCLUDE ([SupervisorId],[StudentId])
