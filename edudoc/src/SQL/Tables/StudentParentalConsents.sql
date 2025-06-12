CREATE TABLE [dbo].[StudentParentalConsents]
(
	[Id] INT NOT NULL IDENTITY,
    [StudentId] INT NOT NULL,
    [ParentalConsentEffectiveDate] DATETIME NULL,
    [ParentalConsentDateEntered] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    [ParentalConsentTypeId] INT NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1,
    [ModifiedById] INT NULL,
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_StudentParentalConsents] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_StudentParentalConsents_Student] FOREIGN KEY (StudentId) REFERENCES [dbo].[Students] (Id),
    CONSTRAINT [FK_StudentParentalConsents_StudentParentalConsentType] FOREIGN KEY (ParentalConsentTypeId) REFERENCES [dbo].[StudentParentalConsentTypes] ([Id]),
    CONSTRAINT [FK_StudentParentalConsents_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_StudentParentalConsents_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id])
)                  

GO
