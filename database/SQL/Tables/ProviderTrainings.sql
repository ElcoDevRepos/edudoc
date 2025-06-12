CREATE TABLE [dbo].[ProviderTrainings]
(
	[Id] INT NOT NULL IDENTITY,
    [DocumentId] INT NULL, 
    [LinkId] INT NULL, 
    [ProviderId] INT NOT NULL, 
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DueDate] DATETIME NULL, 
    [DateCompleted] DATETIME NULL, 
    [LastReminder] DATETIME NULL, 
    CONSTRAINT [PK_ProviderTrainings] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ProviderTrainings_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_ProviderTrainings_MessageDocument] FOREIGN KEY ([DocumentId]) REFERENCES [dbo].[MessageDocuments] ([Id]),
	CONSTRAINT [FK_ProviderTrainings_MessageLink] FOREIGN KEY ([LinkId]) REFERENCES [dbo].[MessageLinks] ([Id]),
	CONSTRAINT [FK_ProviderTrainings_Provider] FOREIGN KEY ([ProviderId]) REFERENCES [dbo].[Providers] ([Id]),
)
