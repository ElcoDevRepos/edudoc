CREATE TABLE [dbo].[DiagnosisCodes]
(
	[Id] INT NOT NULL IDENTITY,
    [Code] VARCHAR(50) NOT NULL, 
    [Description] VARCHAR(250) NOT NULL, 
    [EffectiveDateFrom] DATETIME NULL, 
    [EffectiveDateTo] DATETIME NULL, 
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [FK_DiagnosisCodes_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_DiagnosisCodes_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_DiagnosisCodes] PRIMARY KEY ([Id]),
   

)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'DiagnosisCodes',
    @level2type = N'COLUMN',
    @level2name = N'Id'
