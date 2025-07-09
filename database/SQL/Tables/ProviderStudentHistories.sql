CREATE TABLE [dbo].[ProviderStudentHistories]
(
    [Id] INT IDENTITY NOT NULL,
    [ProviderId] INT NOT NULL,
    [StudentId] INT NOT NULL,
    [DateArchived] DATETIME NOT NULL,

    CONSTRAINT [PK_ProviderStudentHistories] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ProviderStudentHistories_Providers] FOREIGN KEY ([ProviderId])
    REFERENCES [dbo].[Providers] ([Id]),
    CONSTRAINT [FK_ProviderStudentHistories_Students] FOREIGN KEY ([StudentId])
    REFERENCES [dbo].[Students] ([Id])
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ProviderStudentHistories_ProviderId] 
ON [dbo].[ProviderStudentHistories] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderStudentHistories_StudentId] 
ON [dbo].[ProviderStudentHistories] ([StudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
