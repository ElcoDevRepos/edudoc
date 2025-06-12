CREATE TABLE [dbo].[Settings]
(
	[Id] INT NOT NULL  IDENTITY, 
	[Name] VARCHAR(50) NOT NULL DEFAULT '',
    [Value] VARCHAR(MAX) NOT NULL DEFAULT '', 
    CONSTRAINT [PK_Settings] PRIMARY KEY ([Id]), 
    
)
