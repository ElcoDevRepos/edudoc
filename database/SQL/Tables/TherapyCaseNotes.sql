CREATE TABLE [dbo].[TherapyCaseNotes]
(
	[Id] INT NOT NULL IDENTITY,
    [Notes] VARCHAR(6000) NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1,
    [ProviderId] INT NOT NULL,
    [DateCreated] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [PK_TherapyCaseNotes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TherapyCaseNotes_User] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_TherapyCaseNotes_Provider] FOREIGN KEY (ProviderId) REFERENCES [dbo].[Providers] ([Id])

)

Go
create nonclustered index [IX_TherapyCaseNotes_ProviderId] on dbo.TherapyCaseNotes(ProviderId);
