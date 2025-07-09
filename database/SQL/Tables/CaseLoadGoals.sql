CREATE TABLE [dbo].[CaseLoadGoals]
(
	[Id] INT NOT NULL IDENTITY,
    [CaseLoadId] INT NOT NULL,
    [GoalId] INT NOT NULL, 
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_CaseLoadGoals] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CaseLoadGoals_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CaseLoadGoals_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CaseLoadGoals_CaseLoad] FOREIGN KEY (CaseLoadId) REFERENCES [dbo].[CaseLoads] ([Id]),
	CONSTRAINT [FK_CaseLoadGoals_Goal] FOREIGN KEY (GoalId) REFERENCES [dbo].[Goals] ([Id]),
)

GO
CREATE NONCLUSTERED INDEX IX_CaseLoadGoals ON [dbo].[CaseLoadGoals] ([CaseLoadId]) INCLUDE ([Archived]);
GO
-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_CaseLoadGoals_CreatedById] 
ON [dbo].[CaseLoadGoals] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadGoals_ModifiedById] 
ON [dbo].[CaseLoadGoals] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadGoals_GoalId] 
ON [dbo].[CaseLoadGoals] ([GoalId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadGoals_CaseLoadId] 
ON [dbo].[CaseLoadGoals] ([CaseLoadId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
