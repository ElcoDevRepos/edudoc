CREATE TABLE [dbo].[ClaimTypes]
(
	[Id] INT NOT NULL  IDENTITY, 
    [Name] VARCHAR(50) NOT NULL, 
    [Alias] VARCHAR(50) NULL, 
    [ParentId] INT NULL,
    [IsVisible] BIT NOT NULL DEFAULT 1, 
    CONSTRAINT [PK_ClaimTypes] PRIMARY KEY ([Id]),
)
