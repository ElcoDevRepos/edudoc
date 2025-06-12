CREATE TABLE [dbo].[CPTCodeAssocations] 
(
	[Id] INT NOT NULL  IDENTITY, 
    [CPTCodeId] INT NOT NULL,
    [ServiceCodeId] INT NOT NULL,
    [ServiceTypeId] INT NOT NULL,
    [ProviderTitleId] INT NOT NULL,
    [EvaluationTypeId] INT NULL,
    [IsGroup]  BIT NOT NULL   DEFAULT 0,
    [Default]  BIT NOT NULL   DEFAULT 0,
    [IsTelehealth]  BIT NOT NULL   DEFAULT 0,
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [FK_CPTCodeAssocations_CPTCodes] FOREIGN KEY ([CPTCodeId]) REFERENCES [dbo].[CPTCodes] ([Id]),
    CONSTRAINT [FK_CPTCodeAssocations_ServiceCodes] FOREIGN KEY ([ServiceCodeId]) REFERENCES [dbo].[ServiceCodes] ([Id]),
    CONSTRAINT [FK_CPTCodeAssocations_ServiceTypes] FOREIGN KEY ([ServiceTypeId]) REFERENCES [dbo].[ServiceTypes] ([Id]),
    CONSTRAINT [FK_CPTCodeAssocations_ProviderTitles] FOREIGN KEY (ProviderTitleId) REFERENCES [dbo].[ProviderTitles] ([Id]),
    CONSTRAINT [FK_CPTCodeAssocations_EvaluationTypes] FOREIGN KEY (EvaluationTypeId) REFERENCES [dbo].[EvaluationTypes] ([Id]),
    CONSTRAINT [FK_CPTCodeAssocations_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CPTCodeAssocations_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_CPTCodeAssocations] PRIMARY KEY ([Id]) 
)

