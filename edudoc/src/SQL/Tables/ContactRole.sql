CREATE TABLE [dbo].[ContactRoles]
(
	[Id] INT NOT NULL IDENTITY,
    [Name] VARCHAR(100) NOT NULL,
    [Sort] INT NULL DEFAULT 0,
    CONSTRAINT [PK_ContactRoles] PRIMARY KEY ([Id]),
)
