CREATE TABLE [dbo].[EncounterStudentGoals]
(
	[Id] INT NOT NULL IDENTITY,
    [EncounterStudentId] INT NOT NULL,
    [GoalId] INT NOT NULL,
    [ServiceOutcomes] varchar(250) NULL,
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    [NursingResponseNote] varchar(50) NULL,
    [NursingResultNote] varchar(50) NULL,
    [NursingGoalResultId] INT NULL,
    [CaseLoadScriptGoalId] INT NULL,
    CONSTRAINT [PK_EncounterStudentGoals] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EncounterStudentGoals_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_EncounterStudentGoals_EncounterStudent] FOREIGN KEY (EncounterStudentId) REFERENCES [dbo].[EncounterStudents] ([Id]),
	CONSTRAINT [FK_EncounterStudentGoals_Goal] FOREIGN KEY (GoalId) REFERENCES [dbo].[Goals] ([Id]),
	CONSTRAINT [FK_EncounterStudentGoals_NursingGoalResult] FOREIGN KEY (NursingGoalResultId) REFERENCES [dbo].[NursingGoalResults] ([Id]),
	CONSTRAINT [FK_EncounterStudentGoals_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]), 
    CONSTRAINT [FK_EncounterStudentGoals_CaseLoadScriptGoals] FOREIGN KEY ([CaseLoadScriptGoalId]) REFERENCES [CaseLoadScriptGoals]([Id])
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_EncounterStudentGoals_EncounterStudentId] 
ON [dbo].[EncounterStudentGoals] ([EncounterStudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudentGoals_GoalId] 
ON [dbo].[EncounterStudentGoals] ([GoalId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudentGoals_CreatedById] 
ON [dbo].[EncounterStudentGoals] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudentGoals_ModifiedById] 
ON [dbo].[EncounterStudentGoals] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudentGoals_NursingGoalResultId] 
ON [dbo].[EncounterStudentGoals] ([NursingGoalResultId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudentGoals_CaseLoadScriptGoalId] 
ON [dbo].[EncounterStudentGoals] ([CaseLoadScriptGoalId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Primary encounter-goal relationship
CREATE NONCLUSTERED INDEX [IX_EncounterStudentGoals_EncounterStudentId_GoalId] 
ON [dbo].[EncounterStudentGoals] ([EncounterStudentId], [GoalId])
INCLUDE ([ServiceOutcomes], [DateCreated])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Goal-based filtering
CREATE NONCLUSTERED INDEX [IX_EncounterStudentGoals_GoalId_EncounterStudentId] 
ON [dbo].[EncounterStudentGoals] ([GoalId], [EncounterStudentId])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);
