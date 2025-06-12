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

EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Encounters',
    @level2type = N'COLUMN',
    @level2name = N'Id'
