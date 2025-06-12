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

CREATE NONCLUSTERED INDEX [IX_EncounterStudentMethods_EncounterStudentId_Archived]
ON [dbo].[EncounterStudentMethods] ([EncounterStudentId],[Archived])
