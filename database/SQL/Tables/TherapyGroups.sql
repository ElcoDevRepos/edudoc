CREATE TABLE [dbo].[TherapyGroups]
(
	[Id] INT NOT NULL IDENTITY,
    [Name] VARCHAR(300) NOT NULL,
    [ProviderId] INT NOT NULL,
    [StartDate] DATETIME NOT NULL DEFAULT GETUTCDATE(), 
    [EndDate] DATETIME NOT NULL DEFAULT GETUTCDATE(), 
    [Monday] BIT NOT NULL DEFAULT(0), 
    [Tuesday]  BIT NOT NULL DEFAULT(0),
    [Wednesday]  BIT NOT NULL DEFAULT(0),
    [Thursday]  BIT NOT NULL DEFAULT(0),
    [Friday]  BIT NOT NULL DEFAULT(0),
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NOT NULL, 
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_TherapyGroups] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_TherapyGroups_Provider] FOREIGN KEY (ProviderId) REFERENCES [dbo].[Providers] ([Id]),
    CONSTRAINT [FK_TherapyGroups_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_TherapyGroups_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_TherapyGroups_ProviderId] 
ON [dbo].[TherapyGroups] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_TherapyGroups_CreatedById] 
ON [dbo].[TherapyGroups] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_TherapyGroups_ModifiedById] 
ON [dbo].[TherapyGroups] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
