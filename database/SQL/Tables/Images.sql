CREATE TABLE [dbo].[Images]
(
	[Id] INT NOT NULL  IDENTITY, 
    [Name] VARCHAR(50) NOT NULL DEFAULT '', 
    [ImagePath] VARCHAR(100) NOT NULL, 
    [ThumbnailPath] VARCHAR(100) NOT NULL, 
    CONSTRAINT [PK_Images] PRIMARY KEY ([Id]) 
 
)
