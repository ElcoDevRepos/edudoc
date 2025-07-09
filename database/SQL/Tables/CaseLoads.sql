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

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_CaseLoads_CreatedById] 
ON [dbo].[CaseLoads] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoads_ModifiedById] 
ON [dbo].[CaseLoads] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoads_StudentTypeId] 
ON [dbo].[CaseLoads] ([StudentTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoads_DiagnosisCodeId] 
ON [dbo].[CaseLoads] ([DiagnosisCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoads_DisabilityCodeId] 
ON [dbo].[CaseLoads] ([DisabilityCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Student case load with archived filtering (common in EF)
CREATE NONCLUSTERED INDEX [IX_CaseLoads_StudentId_Archived_ServiceCodeId] 
ON [dbo].[CaseLoads] ([StudentId], [Archived], [ServiceCodeId])
INCLUDE ([StudentTypeId], [DiagnosisCodeId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Service code case loads
CREATE NONCLUSTERED INDEX [IX_CaseLoads_ServiceCodeId_Archived_StudentTypeId] 
ON [dbo].[CaseLoads] ([ServiceCodeId], [Archived], [StudentTypeId])
INCLUDE ([StudentId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

