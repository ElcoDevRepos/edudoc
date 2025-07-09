CREATE TABLE [dbo].[CaseLoadCptCodes]
(
	[Id] INT NOT NULL IDENTITY,
    [CaseLoadId] INT NOT NULL,
    [CptCodeId] INT NOT NULL, 
    [Default]  BIT NULL DEFAULT 0,
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_CaseLoadCptCodes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CaseLoadCptCodes_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CaseLoadCptCodes_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CaseLoadCptCodes_CaseLoad] FOREIGN KEY (CaseLoadId) REFERENCES [dbo].[CaseLoads] ([Id]),
	CONSTRAINT [FK_CaseLoadCptCodes_CptCode] FOREIGN KEY ([CptCodeId]) REFERENCES [dbo].[CPTCodes] ([Id]),
)

GO
CREATE NONCLUSTERED INDEX IX_CaseLoadCptCodes ON [dbo].[CaseLoadCptCodes] ([CaseLoadId]) INCLUDE ([Archived]);

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_CaseLoadCptCodes_CreatedById] 
ON [dbo].[CaseLoadCptCodes] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadCptCodes_ModifiedById] 
ON [dbo].[CaseLoadCptCodes] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadCptCodes_CptCodeId] 
ON [dbo].[CaseLoadCptCodes] ([CptCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadCptCodes_CaseLoadId] 
ON [dbo].[CaseLoadCptCodes] ([CaseLoadId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

