CREATE TABLE [dbo].[StudentTherapies]
(
	[Id] INT NOT NULL IDENTITY, 
    [CaseLoadId] INT NOT NULL,
    [ProviderId] INT NULL,
    [EncounterLocationId] INT NOT NULL,
    [TherapyGroupId] INT NULL,
    [StartDate] DATETIME NOT NULL, 
    [EndDate] DATETIME NOT NULL, 
    [Monday] BIT NOT NULL DEFAULT(0), 
    [Tuesday]  BIT NOT NULL DEFAULT(0),
    [Wednesday]  BIT NOT NULL DEFAULT(0),
    [Thursday]  BIT NOT NULL DEFAULT(0),
    [Friday]  BIT NOT NULL DEFAULT(0),
    [SessionName] VARCHAR(50) NULL,
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated]  DATETIME NULL DEFAULT GETUTCDATE(),
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_StudentTherapies] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_StudentTherapies_CaseLoad] FOREIGN KEY (CaseLoadId) REFERENCES [dbo].[CaseLoads] ([Id]),
    CONSTRAINT [FK_StudentTherapies_Provider] FOREIGN KEY ([ProviderId]) REFERENCES [dbo].[Providers] ([Id]),
	CONSTRAINT [FK_StudentTherapies_EncounterLocation] FOREIGN KEY (EncounterLocationId) REFERENCES [dbo].[EncounterLocations] ([Id]),
	CONSTRAINT [FK_StudentTherapies_TherapyGroup] FOREIGN KEY (TherapyGroupId) REFERENCES [dbo].[TherapyGroups] ([Id]),
    CONSTRAINT [FK_StudentTherapies_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_StudentTherapies_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_StudentTherapies_CaseLoadId] 
ON [dbo].[StudentTherapies] ([CaseLoadId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentTherapies_ProviderId] 
ON [dbo].[StudentTherapies] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentTherapies_EncounterLocationId] 
ON [dbo].[StudentTherapies] ([EncounterLocationId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentTherapies_TherapyGroupId] 
ON [dbo].[StudentTherapies] ([TherapyGroupId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentTherapies_CreatedById] 
ON [dbo].[StudentTherapies] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentTherapies_ModifiedById] 
ON [dbo].[StudentTherapies] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Case load therapy filtering (common in EF)
CREATE NONCLUSTERED INDEX [IX_StudentTherapies_CaseLoadId_Archived_ProviderId] 
ON [dbo].[StudentTherapies] ([CaseLoadId], [Archived], [ProviderId])
INCLUDE ([StartDate], [EndDate], [TherapyGroupId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Therapy group filtering
CREATE NONCLUSTERED INDEX [IX_StudentTherapies_TherapyGroupId_Archived] 
ON [dbo].[StudentTherapies] ([TherapyGroupId], [Archived])
INCLUDE ([CaseLoadId], [ProviderId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);
