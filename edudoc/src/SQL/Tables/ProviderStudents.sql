CREATE TABLE [dbo].[ProviderStudents]
(
	[Id] INT NOT NULL IDENTITY,
    [ProviderId] INT NOT NULL,
    [StudentId] INT NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    CONSTRAINT [FK_ProviderStudents_CreatedBy] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_ProviderStudents_Providers] FOREIGN KEY ([ProviderId]) REFERENCES [dbo].[Providers] ([Id]),
    CONSTRAINT [FK_ProviderStudents_Students] FOREIGN KEY ([StudentId]) REFERENCES [dbo].[Students] ([Id]),
    CONSTRAINT [PK_ProviderStudents] PRIMARY KEY ([Id]),
)
Go
create nonclustered index [IX_ProviderStudents_StudentId_ProviderId] on dbo.ProviderStudents(StudentId, ProviderId);

Go
create nonclustered index [IX_ProviderStudents_ProviderId] on dbo.ProviderStudents(ProviderId);
