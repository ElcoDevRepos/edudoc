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

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_StudentParentalConsents_StudentId] 
ON [dbo].[StudentParentalConsents] ([StudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentParentalConsents_ParentalConsentTypeId] 
ON [dbo].[StudentParentalConsents] ([ParentalConsentTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentParentalConsents_CreatedById] 
ON [dbo].[StudentParentalConsents] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentParentalConsents_ModifiedById] 
ON [dbo].[StudentParentalConsents] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Consent effective date queries (common in EF)
CREATE NONCLUSTERED INDEX [IX_StudentParentalConsents_StudentId_ParentalConsentEffectiveDate] 
ON [dbo].[StudentParentalConsents] ([StudentId], [ParentalConsentEffectiveDate])
INCLUDE ([ParentalConsentTypeId], [DateCreated])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Consent type filtering
CREATE NONCLUSTERED INDEX [IX_StudentParentalConsents_ParentalConsentTypeId_EffectiveDate] 
ON [dbo].[StudentParentalConsents] ([ParentalConsentTypeId], [ParentalConsentEffectiveDate])
INCLUDE ([StudentId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);
