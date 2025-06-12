CREATE TABLE [dbo].[ContactStatuses]
(
	[Id] INT NOT NULL  IDENTITY, 
    [Name] VARCHAR(50) NOT NULL, 
    [Sort] INT NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_ContactStatuses] PRIMARY KEY ([Id])
)
