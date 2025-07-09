CREATE TABLE [dbo].[Encounters]
(
	[Id] INT NOT NULL IDENTITY,
    [ProviderId] INT NOT NULL,
    [ServiceTypeId] INT NOT NULL,
    [NonMspServiceTypeId] INT NULL,
    [EvaluationTypeId] INT NULL,
    [EncounterDate] DATETIME NULL,
    [EncounterStartTime] TIME(0) NULL,
    [EncounterEndTime] TIME(0) NULL,
    [IsGroup] BIT NOT NULL DEFAULT 0,
    [AdditionalStudents] INT NOT NULL DEFAULT 0,
    [FromSchedule] BIT NOT NULL DEFAULT 0,
    [DiagnosisCodeId] INT NULL,
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_Encounters] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Encounters_Provider] FOREIGN KEY (ProviderId) REFERENCES [dbo].[Providers] ([Id]),
    CONSTRAINT [FK_Encounters_ServiceType] FOREIGN KEY ([ServiceTypeId]) REFERENCES [dbo].[ServiceTypes]([Id]),
    CONSTRAINT [FK_Encounters_EvaluationType] FOREIGN KEY ([EvaluationTypeId]) REFERENCES [dbo].[EvaluationTypes]([Id]),
    CONSTRAINT [FK_Encounters_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_Encounters_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]), 
    CONSTRAINT [FK_Encounters_NonMspServices] FOREIGN KEY ([NonMspServiceTypeId]) REFERENCES [NonMspServices]([Id]),
    CONSTRAINT [FK_Encounters_DiagnosisCodes] FOREIGN KEY ([DiagnosisCodeId]) REFERENCES [dbo].[DiagnosisCodes] ([Id]),
)


GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_Encounters_ProviderId] 
ON [dbo].[Encounters] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Encounters_ServiceTypeId] 
ON [dbo].[Encounters] ([ServiceTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Encounters_EvaluationTypeId] 
ON [dbo].[Encounters] ([EvaluationTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Encounters_CreatedById] 
ON [dbo].[Encounters] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Encounters_ModifiedById] 
ON [dbo].[Encounters] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Encounters_NonMspServiceTypeId] 
ON [dbo].[Encounters] ([NonMspServiceTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Encounters_DiagnosisCodeId] 
ON [dbo].[Encounters] ([DiagnosisCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Provider encounter filtering (very common in EF)
CREATE NONCLUSTERED INDEX [IX_Encounters_ProviderId_EncounterDate_Archived] 
ON [dbo].[Encounters] ([ProviderId], [EncounterDate], [Archived])
INCLUDE ([EncounterStartTime], [EncounterEndTime], [IsGroup])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Encounter date range queries
CREATE NONCLUSTERED INDEX [IX_Encounters_EncounterDate_ProviderId] 
ON [dbo].[Encounters] ([EncounterDate], [ProviderId])
INCLUDE ([Archived], [ServiceTypeId])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Encounters',
    @level2type = N'COLUMN',
    @level2name = N'Id'
