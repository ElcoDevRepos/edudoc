CREATE TABLE [dbo].[StudentTypes]
(
	[Id] INT NOT NULL IDENTITY,
    [Name] VARCHAR(50) NOT NULL,
    [IsBillable] BIT NOT NULL, 
    CONSTRAINT [PK_StudentTypes] PRIMARY KEY ([Id])
)
