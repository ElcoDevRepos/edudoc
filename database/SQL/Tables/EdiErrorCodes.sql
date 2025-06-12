CREATE TABLE [dbo].[EdiErrorCodes]
(
	[Id] INT NOT NULL IDENTITY, 
    [ErrorCode] VARCHAR(10) NOT NULL,
    [Name] VARCHAR(750) NOT NULL,
    [EdiFileTypeId] INT NOT NULL, 
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [FK_EdiErrorCodes_EdiFileType] FOREIGN KEY (EdiFileTypeId) REFERENCES [dbo].[EdiFileTypes] ([Id]),
    CONSTRAINT [FK_EdiErrorCodes_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_EdiErrorCodes_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_EdiErrorCodes] PRIMARY KEY ([Id])
)
