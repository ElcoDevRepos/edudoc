CREATE TABLE [dbo].[CaseLoadMethods]
(
	[Id] INT NOT NULL IDENTITY,
    [CaseLoadId] INT NOT NULL,
    [MethodId] INT NOT NULL, 
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_CaseLoadMethods] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CaseLoadMethods_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CaseLoadMethods_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CaseLoadMethods_CaseLoad] FOREIGN KEY (CaseLoadId) REFERENCES [dbo].[CaseLoads] ([Id]),
	CONSTRAINT [FK_CaseLoadMethods_Method] FOREIGN KEY (MethodId) REFERENCES [dbo].[Methods] ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_CaseLoadMethods_CaseLoadId] 
ON [dbo].[CaseLoadMethods] ([CaseLoadId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadMethods_MethodId] 
ON [dbo].[CaseLoadMethods] ([MethodId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadMethods_CreatedById] 
ON [dbo].[CaseLoadMethods] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadMethods_ModifiedById] 
ON [dbo].[CaseLoadMethods] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

