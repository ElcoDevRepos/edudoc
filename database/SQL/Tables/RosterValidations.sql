CREATE TABLE [dbo].[RosterValidations]
(
	[Id] INT NOT NULL  IDENTITY, 
    [DateCreated] DATETIME NOT NULL DEFAULT (getdate()),
    [PageCount] INT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_RosterValidations] PRIMARY KEY ([Id]),
)
