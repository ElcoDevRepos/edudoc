CREATE TABLE [dbo].[EncounterStudentStatuses]
(
	[Id] INT NOT NULL IDENTITY,
    [EncounterStudentId] INT NOT NULL,
    [EncounterStatusId] INT NOT NULL DEFAULT 1,
    [CreatedById] INT NOT NULL DEFAULT 1,
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [PK_EncounterStudentStatuses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EncounterStudentStatuses_EncounterStudent] FOREIGN KEY ([EncounterStudentId]) REFERENCES [dbo].[EncounterStudents] ([Id]),
    CONSTRAINT [FK_EncounterStudentStatuses_EncounterStatus] FOREIGN KEY (EncounterStatusId) REFERENCES [dbo].[EncounterStatuses] ([Id]),
	CONSTRAINT [FK_EncounterStudentStatuses_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
)

