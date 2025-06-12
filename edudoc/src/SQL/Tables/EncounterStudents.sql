CREATE TABLE [dbo].[EncounterStudents]
(
	[Id] INT NOT NULL IDENTITY,
    [EncounterId] INT NOT NULL,
    [StudentId] INT NOT NULL,
    [EncounterStatusId] INT NOT NULL DEFAULT 1,
    [EncounterLocationId] INT NOT NULL,
    [ReasonForReturn] VARCHAR(250) NULL,
    [EncounterNumber] VARCHAR(14)NULL,
    [CaseLoadId] INT NULL, -- FOR REFERENCE ONLY USED WHEN ENCOUNTERS IS NOT CREATED FROM THERAPY SCHEDULES, AND A STUDENT FROM CASE LOAD IS SELECTED
    [StudentTherapyScheduleId] INT NULL, -- FOR REFERENCE / TRACKING PURPOSE ONLY :  USED WHEN ENCOUNTERS IS CREATED FROM THERAPY SCHEDULES,
    [EncounterStartTime] TIME(0) NOT NULL,
    [EncounterEndTime] TIME(0) NOT NULL,
    [EncounterDate] DATETIME NOT NULL,
    [SupervisorComments] VARCHAR(1000) NULL,
    [ESignatureText] VARCHAR(1000) NULL,
    [ESignedById] INT NULL,
    [SupervisorESignatureText] VARCHAR(1000) NULL,
    [SupervisorESignedById] INT NULL,
    [DateESigned] DATETIME NULL,
    [SupervisorDateESigned] DATETIME NULL,
    [StudentDeviationReasonId] INT NULL,
    [TherapyCaseNotes] varchar(6000) NULL,
    [AbandonmentNotes] varchar(1000) NULL,
    [IsTelehealth]  BIT NOT NULL   DEFAULT 0,
    [DiagnosisCodeId] INT NULL,
    [DocumentTypeId] INT NULL,
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1,
    [ModifiedById] INT NULL,
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_EncounterStudents] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EncounterStudents_Student] FOREIGN KEY ([StudentId]) REFERENCES [dbo].[Students]([Id]),
    CONSTRAINT [FK_EncounterStudents_CaseLoad] FOREIGN KEY ([CaseLoadId]) REFERENCES [dbo].[CaseLoads]([Id]),
    CONSTRAINT [FK_EncounterStudents_StudentTherapySchedules] FOREIGN KEY ([StudentTherapyScheduleId]) REFERENCES [dbo].[StudentTherapySchedules]([Id]),
    CONSTRAINT [FK_EncounterStudents_EncounterLocation] FOREIGN KEY ([EncounterLocationId]) REFERENCES [dbo].[EncounterLocations]([Id]),
    CONSTRAINT [FK_EncounterStudents_EncounterStatus] FOREIGN KEY (EncounterStatusId) REFERENCES [dbo].[EncounterStatuses] ([Id]),
    CONSTRAINT [FK_EncounterStudents_StudentDeviationReason] FOREIGN KEY ([StudentDeviationReasonId]) REFERENCES [dbo].[StudentDeviationReasons]([Id]),
    CONSTRAINT [FK_EncounterStudents_ESignedBy] FOREIGN KEY ([ESignedById]) REFERENCES [dbo].[Users]([Id]),
    CONSTRAINT [FK_EncounterStudents_SupervisorESignedBy] FOREIGN KEY ([SupervisorESignedById]) REFERENCES [dbo].[Users]([Id]),
	CONSTRAINT [FK_EncounterStudents_DiagnosisCodes] FOREIGN KEY ([DiagnosisCodeId]) REFERENCES [dbo].[DiagnosisCodes] ([Id]),
    CONSTRAINT [FK_EncounterStudents_DocumentTypes] FOREIGN KEY ([DocumentTypeId]) REFERENCES [dbo].[DocumentTypes]([Id]),
    CONSTRAINT [FK_EncounterStudents_Encounter] FOREIGN KEY ([EncounterId]) REFERENCES [dbo].[Encounters]([Id]),
    CONSTRAINT [FK_EncounterStudents_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_EncounterStudents_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id])
)

GO

CREATE INDEX [IX_StudentTherapyScheduleId] ON [dbo].[EncounterStudents] ([StudentTherapyScheduleId])  WITH (FILLFACTOR=100, ONLINE=off, SORT_IN_TEMPDB=On, DATA_COMPRESSION=Row);

GO

CREATE INDEX [IX_EncounterId_Archived] ON [dbo].[EncounterStudents] ([EncounterId], [Archived])  WITH (FILLFACTOR=100, ONLINE=off, SORT_IN_TEMPDB=on, DATA_COMPRESSION=Row);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_StudentId] ON [dbo].[EncounterStudents] ([StudentId]) INCLUDE ([CaseLoadId]);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_EncounterStatusId_SupervisorDateESigned_ESignedById_Archived] ON [dbo].[EncounterStudents] ([EncounterStatusId],[SupervisorDateESigned],[ESignedById],[Archived])
INCLUDE ([EncounterId],[StudentId],[ReasonForReturn],[EncounterNumber],[CaseLoadId],[EncounterStartTime],[EncounterEndTime],[EncounterDate],[SupervisorComments],[TherapyCaseNotes],[AbandonmentNotes]);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_StudentDeviationId_EncounterId_EncounterStatusId_ESignedById_Archived]
ON [dbo].[EncounterStudents] ([StudentDeviationReasonId],[EncounterId],[EncounterStatusId],[ESignedById],[Archived])
INCLUDE ([StudentId],[EncounterStartTime],[EncounterEndTime],[EncounterDate])
