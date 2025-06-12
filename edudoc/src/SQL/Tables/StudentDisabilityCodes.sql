CREATE TABLE [dbo].[StudentDisabilityCodes]
(
	[Id] INT NOT NULL IDENTITY,
    [StudentId] INT NOT NULL,
    [DisabilityCodeId] INT NOT NULL, 
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_StudentDisabilityCodes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_StudentDisabilityCodes_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_StudentDisabilityCodes_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_StudentDisabilityCodes_Student] FOREIGN KEY ([StudentId]) REFERENCES [dbo].[Students] ([Id]),
	CONSTRAINT [FK_StudentDisabilityCodes_DisabilityCodes] FOREIGN KEY ([DisabilityCodeId]) REFERENCES [dbo].[DisabilityCodes] ([Id]),
)
