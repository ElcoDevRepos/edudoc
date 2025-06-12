CREATE TABLE [dbo].[EncounterReasonForReturn]
(
	[Id] INT NOT NULL IDENTITY, 
    [Name] VARCHAR(250) NOT NULL, 
    [ReturnReasonCategoryId] INT NOT NULL,
    [HpcUserId] INT NOT NULL,
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_EncounterReasonForReturn] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EncounterReasonForReturn_ReturnReasonCategories] FOREIGN KEY ([ReturnReasonCategoryId]) REFERENCES [dbo].[EncounterReturnReasonCategories]([Id]),
    CONSTRAINT [FK_EncounterReasonForReturn_HpcUser] FOREIGN KEY ([HpcUserId]) REFERENCES [dbo].[Users]([Id]),
    CONSTRAINT [FK_EncounterReasonForReturn_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_EncounterReasonForReturn_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id])

)
