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
GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ProviderStudents_ProviderId] 
ON [dbo].[ProviderStudents] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderStudents_StudentId] 
ON [dbo].[ProviderStudents] ([StudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderStudents_CreatedById] 
ON [dbo].[ProviderStudents] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Provider student relationship queries (very common in EF)
CREATE NONCLUSTERED INDEX [IX_ProviderStudents_ProviderId_StudentId_DateCreated] 
ON [dbo].[ProviderStudents] ([ProviderId], [StudentId], [DateCreated])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Student provider lookup
CREATE NONCLUSTERED INDEX [IX_ProviderStudents_StudentId_ProviderId_DateCreated] 
ON [dbo].[ProviderStudents] ([StudentId], [ProviderId], [DateCreated])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);
