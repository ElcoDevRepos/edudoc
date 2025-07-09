CREATE TABLE [dbo].[EncounterStudentMethods]
(
	[Id] INT NOT NULL IDENTITY,
    [EncounterStudentId] INT NOT NULL,
    [MethodId] INT NOT NULL, 
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_EncounterStudentMethods] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EncounterStudentMethods_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_EncounterStudentMethods_EncounterStudent] FOREIGN KEY (EncounterStudentId) REFERENCES [dbo].[EncounterStudents] ([Id]),
	CONSTRAINT [FK_EncounterStudentMethods_Method] FOREIGN KEY (MethodId) REFERENCES [dbo].[Methods] ([Id]),
	CONSTRAINT [FK_EncounterStudentMethods_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_EncounterStudentMethods_EncounterStudentId] 
ON [dbo].[EncounterStudentMethods] ([EncounterStudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudentMethods_MethodId] 
ON [dbo].[EncounterStudentMethods] ([MethodId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudentMethods_CreatedById] 
ON [dbo].[EncounterStudentMethods] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudentMethods_ModifiedById] 
ON [dbo].[EncounterStudentMethods] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Primary encounter-method relationship
CREATE NONCLUSTERED INDEX [IX_EncounterStudentMethods_EncounterStudentId_MethodId] 
ON [dbo].[EncounterStudentMethods] ([EncounterStudentId], [MethodId])
INCLUDE ([Archived], [DateCreated])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);
