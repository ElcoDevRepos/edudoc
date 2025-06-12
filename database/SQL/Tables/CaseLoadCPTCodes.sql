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
