CREATE TABLE [dbo].[ESignatureContents]
(
	[Id] INT NOT NULL  IDENTITY,
    [Name] VARCHAR(50) NOT NULL,
    [Content] VARCHAR(1000) NOT NULL, 
    CONSTRAINT [PK_ESignatureContents] PRIMARY KEY ([Id]),
)
