CREATE TABLE [dbo].[ServiceTypes]-- Not a user facing table
(
	[Id] INT NOT NULL  IDENTITY, 
    [Name] VARCHAR(50) NOT NULL, 
    [Code] VARCHAR(50) NOT NULL, 
    CONSTRAINT [PK_ServiceTypes] PRIMARY KEY ([Id]) 
)
