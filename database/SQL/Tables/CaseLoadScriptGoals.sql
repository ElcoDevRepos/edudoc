CREATE TABLE [dbo].[CaseLoadScriptGoals]
(
	[Id] INT NOT NULL IDENTITY,
    [CaseLoadScriptId] INT NOT NULL,
    [GoalId] INT NOT NULL,
    [MedicationName] VARCHAR(50) NULL,
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_CaseLoadScriptGoals] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CaseLoadScriptGoals_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CaseLoadScriptGoals_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CaseLoadScriptGoals_CaseLoadScript] FOREIGN KEY ([CaseLoadScriptId]) REFERENCES [dbo].[CaseLoadScripts] ([Id]),
	CONSTRAINT [FK_CaseLoadScriptGoals_Goal] FOREIGN KEY (GoalId) REFERENCES [dbo].[Goals] ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_CaseLoadScriptGoals_CaseLoadScriptId] 
ON [dbo].[CaseLoadScriptGoals] ([CaseLoadScriptId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadScriptGoals_GoalId] 
ON [dbo].[CaseLoadScriptGoals] ([GoalId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadScriptGoals_CreatedById] 
ON [dbo].[CaseLoadScriptGoals] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadScriptGoals_ModifiedById] 
ON [dbo].[CaseLoadScriptGoals] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
