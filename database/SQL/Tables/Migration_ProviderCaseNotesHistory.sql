CREATE TABLE dbo.Migration_ProviderCaseNotesHistory (
    Id INT IDENTITY(1,1) NOT NULL,
    ProviderId INT NOT NULL,
    StudentId INT NOT NULL,
    EncounterNumber VARCHAR(50) NOT NULL,
    EncounterDate DATETIME NOT NULL,
    StartTime DATETIME NOT NULL,
    EndTime DATETIME NOT NULL,
    ProviderNotes VARCHAR(MAX) NOT NULL,
    CONSTRAINT [PK_Migration_ProviderCaseNotesHistory] PRIMARY KEY CLUSTERED (Id ASC),
    CONSTRAINT [FK_Migration_ProviderCaseNotesHistory_Provider] FOREIGN KEY (ProviderId) REFERENCES dbo.Providers(Id),
    CONSTRAINT [FK_Migration_ProviderCaseNotesHistory_Student] FOREIGN KEY (StudentId) REFERENCES dbo.Students(Id)
)
GO

CREATE NONCLUSTERED INDEX [IX_Migration_ProviderCaseNotesHistory_ProviderId] ON dbo.Migration_ProviderCaseNotesHistory (ProviderId ASC)
GO
