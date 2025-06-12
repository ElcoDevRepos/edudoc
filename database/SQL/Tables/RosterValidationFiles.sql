CREATE TABLE [dbo].[RosterValidationFiles]
(
	[Id] INT NOT NULL  IDENTITY, 
    [Name] VARCHAR(200) NOT NULL, 
    [DateCreated] DATETIME NOT NULL DEFAULT (getdate()), 
    [FilePath] VARCHAR(200) NOT NULL,
    [PageNumber] INT NOT NULL DEFAULT 1,
    [CreatedById] INT NULL,
    [RosterValidationId] INT NOT NULL,
    CONSTRAINT [PK_RosterValidationFiles] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RosterValidationFiles_Users] FOREIGN KEY ([CreatedById]) REFERENCES Users(Id),
    CONSTRAINT [FK_RosterValidationFiles_RosterValidation] FOREIGN KEY ([RosterValidationId]) REFERENCES RosterValidations(Id),
)
