CREATE TABLE [dbo].[EdiFileTypes]
(
	[Id] INT NOT NULL IDENTITY, 
    [EdiFileFormat] VARCHAR(50) NOT NULL,
    [Name] VARCHAR(50) NOT NULL,
    [IsResponse] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_EdiFileTypes] PRIMARY KEY ([Id])
)
