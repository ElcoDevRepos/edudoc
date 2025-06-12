CREATE TABLE [dbo].[CaseLoads]
(
	[Id] INT NOT NULL IDENTITY,
    [StudentTypeId] INT NOT NULL,
    [ServiceCodeId] INT NULL,
    [StudentId] INT NOT NULL,
    [DiagnosisCodeId] INT NULL, -- ONLY Used for IEP Types
    [DisabilityCodeId] INT NULL, -- ONLY Used for some districts
    [IEPStartDate] DATETIME NULL,
    [IEPEndDate] DATETIME NULL,
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_CaseLoads] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CaseLoads_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CaseLoads_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CaseLoads_StudentType] FOREIGN KEY (StudentTypeId) REFERENCES [dbo].[StudentTypes] ([Id]),
	CONSTRAINT [FK_CaseLoads_ServiceCode] FOREIGN KEY (ServiceCodeId) REFERENCES [dbo].[ServiceCodes] ([Id]),
	CONSTRAINT [FK_CaseLoads_Student] FOREIGN KEY (StudentId) REFERENCES [dbo].[Students] ([Id]),
	CONSTRAINT [FK_CaseLoads_DiagnosisCodes] FOREIGN KEY ([DiagnosisCodeId]) REFERENCES [dbo].[DiagnosisCodes] ([Id]),
	CONSTRAINT [FK_CaseLoads_DisabilityCodes] FOREIGN KEY ([DisabilityCodeId]) REFERENCES [dbo].[DisabilityCodes] ([Id]),
)

GO 
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'CaseLoads',
    @level2type = N'COLUMN',
    @level2name = N'Id'

GO
CREATE NONCLUSTERED INDEX IX_CaseLoads_1 ON [dbo].[CaseLoads] ([StudentId]);
GO
CREATE NONCLUSTERED INDEX IX_CaseLoads_ServiceCodeId_StudentId ON [dbo].[CaseLoads] ([ServiceCodeId], [StudentId]) INCLUDE ([Archived]);
GO
CREATE NONCLUSTERED INDEX IX_CaseLoads_ServiceCodeId ON [dbo].[CaseLoads] ([ServiceCodeId]) INCLUDE ([Archived], [StudentId]);
