CREATE TABLE [dbo].[EncounterStudentCptCodes]
(
	[Id] INT NOT NULL IDENTITY,
    [EncounterStudentId] INT NOT NULL,
    [CptCodeId] INT NOT NULL, 
    [Minutes] INT NULL , 
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_EncounterStudentCptCodes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EncounterStudentCptCodes_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_EncounterStudentCptCodes_EncounterStudent] FOREIGN KEY (EncounterStudentId) REFERENCES [dbo].[EncounterStudents] ([Id]),
	CONSTRAINT [FK_EncounterStudentCptCodes_CptCode] FOREIGN KEY (CptCodeId) REFERENCES [dbo].[CPTCodes] ([Id]),
	CONSTRAINT [FK_EncounterStudentCptCodes_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_EncounterStudentCptCodes_EncounterStudentId] 
ON [dbo].[EncounterStudentCptCodes] ([EncounterStudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudentCptCodes_CptCodeId] 
ON [dbo].[EncounterStudentCptCodes] ([CptCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudentCptCodes_CreatedById] 
ON [dbo].[EncounterStudentCptCodes] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudentCptCodes_ModifiedById] 
ON [dbo].[EncounterStudentCptCodes] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Primary encounter-CPT relationship
CREATE NONCLUSTERED INDEX [IX_EncounterStudentCptCodes_EncounterStudentId_CptCodeId] 
ON [dbo].[EncounterStudentCptCodes] ([EncounterStudentId], [CptCodeId])
INCLUDE ([Minutes])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- CPT code billing queries
CREATE NONCLUSTERED INDEX [IX_EncounterStudentCptCodes_CptCodeId_Minutes] 
ON [dbo].[EncounterStudentCptCodes] ([CptCodeId], [Minutes])
INCLUDE ([EncounterStudentId])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);
