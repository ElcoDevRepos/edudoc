CREATE TABLE [dbo].[DocumentTypes]
(
	[Id] INT NOT NULL IDENTITY,
    [Name] VARCHAR(100) NOT NULL,
    CONSTRAINT [PK_DocumentTypes] PRIMARY KEY ([Id]),
)
