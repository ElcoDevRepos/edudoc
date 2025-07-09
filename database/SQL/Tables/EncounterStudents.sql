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

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_EncounterStatusId_SupervisorDateESigned_ESignedById_Archived] ON [dbo].[EncounterStudents] ([EncounterStatusId],[SupervisorDateESigned],[ESignedById],[Archived])
INCLUDE ([EncounterId],[StudentId],[ReasonForReturn],[EncounterNumber],[CaseLoadId],[EncounterStartTime],[EncounterEndTime],[EncounterDate],[SupervisorComments],[TherapyCaseNotes],[AbandonmentNotes]);

GO

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_EncounterStudents_EncounterId] 
ON [dbo].[EncounterStudents] ([EncounterId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_StudentId] 
ON [dbo].[EncounterStudents] ([StudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_EncounterStatusId] 
ON [dbo].[EncounterStudents] ([EncounterStatusId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_EncounterLocationId] 
ON [dbo].[EncounterStudents] ([EncounterLocationId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_CaseLoadId] 
ON [dbo].[EncounterStudents] ([CaseLoadId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_StudentTherapyScheduleId] 
ON [dbo].[EncounterStudents] ([StudentTherapyScheduleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_StudentDeviationReasonId] 
ON [dbo].[EncounterStudents] ([StudentDeviationReasonId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_ESignedById] 
ON [dbo].[EncounterStudents] ([ESignedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_SupervisorESignedById] 
ON [dbo].[EncounterStudents] ([SupervisorESignedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_DiagnosisCodeId] 
ON [dbo].[EncounterStudents] ([DiagnosisCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_DocumentTypeId] 
ON [dbo].[EncounterStudents] ([DocumentTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_CreatedById] 
ON [dbo].[EncounterStudents] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudents_ModifiedById] 
ON [dbo].[EncounterStudents] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Primary student encounter filtering (most common EF pattern)
CREATE NONCLUSTERED INDEX [IX_EncounterStudents_StudentId_Archived_DateESigned] 
ON [dbo].[EncounterStudents] ([StudentId], [Archived], [DateESigned])
INCLUDE ([EncounterDate], [ESignedById], [EncounterStartTime], [EncounterEndTime])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Encounter date range queries (very common in EF)
CREATE NONCLUSTERED INDEX [IX_EncounterStudents_EncounterDate_Archived_StudentId] 
ON [dbo].[EncounterStudents] ([EncounterDate], [Archived], [StudentId])
INCLUDE ([DateESigned], [ESignedById])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Signed encounters filtering
CREATE NONCLUSTERED INDEX [IX_EncounterStudents_ESignedById_DateESigned] 
ON [dbo].[EncounterStudents] ([ESignedById], [DateESigned])
WHERE ([ESignedById] IS NOT NULL AND [DateESigned] IS NOT NULL)
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);
