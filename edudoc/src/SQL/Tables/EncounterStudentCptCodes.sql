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
	CONSTRAINT [FK_EncounterStudentCptCodes_CptCode] FOREIGN KEY (CptCodeId) REFERENCES [dbo].[CptCodes] ([Id]),
	CONSTRAINT [FK_EncounterStudentCptCodes_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
)

GO
CREATE NONCLUSTERED INDEX IX_EncounterStudentCptCodes ON [dbo].[EncounterStudentCptCodes] ([EncounterStudentId]) INCLUDE ([Archived]);
