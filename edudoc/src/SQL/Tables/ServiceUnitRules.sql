CREATE TABLE [dbo].[ServiceUnitRules]
(
	[Id] INT NOT NULL  IDENTITY, 
    [Name] VARCHAR(100) NOT NULL, 
    [Description] VARCHAR(200) NOT NULL, 
    [CptCodeId] INT NULL,
    [EffectiveDate] DATETIME NULL,
    [HasReplacement] BIT NOT NULL DEFAULT 0,
    [CreatedById] INT NULL , 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL, 
    [Archived] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [FK_ServiceUnitRules_CptCode] FOREIGN KEY (CptCodeId) REFERENCES [dbo].[CptCodes] ([Id]),
    CONSTRAINT [FK_ServiceUnitRules_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_ServiceUnitRules_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]), 
    CONSTRAINT [PK_ServiceUnitRules] PRIMARY KEY ([Id]),
)
