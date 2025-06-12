CREATE TABLE [dbo].[EvaluationTypesDiagnosisCodes]
(
	[Id] INT NOT NULL IDENTITY,
    [EvaluationTypeId] INT NOT NULL,
    [DiagnosisCodeId] INT NOT NULL,
    [Archived] BIT NOT NULL DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [FK_EvaluationTypesDiagnosisCodes_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_EvaluationTypesDiagnosisCodes_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_EvaluationTypesDiagnosisCodes_EvaluationTypes] FOREIGN KEY (EvaluationTypeId) REFERENCES [dbo].[EvaluationTypes] ([Id]),
    CONSTRAINT [FK_EvaluationTypesDiagnosisCodes_DiagnosisCodes] FOREIGN KEY (DiagnosisCodeId) REFERENCES [dbo].[DiagnosisCodes] ([Id]),
    CONSTRAINT [PK_EvaluationTypesDiagnosisCodes] PRIMARY KEY ([Id]),
)
