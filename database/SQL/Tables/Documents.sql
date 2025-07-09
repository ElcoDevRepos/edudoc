CREATE TABLE [dbo].[Documents]
(
	[Id] INT NOT NULL  IDENTITY, 
    [Name] VARCHAR(200) NOT NULL, 
    [DateUpload] DATETIME NOT NULL DEFAULT (getdate()), 
    [UploadedBy] INT NULL, 
    [FilePath] VARCHAR(200) NOT NULL, 
    CONSTRAINT [PK_Documents] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Documents_Users] FOREIGN KEY ([UploadedBy]) REFERENCES Users(Id),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_Documents_UploadedBy] 
ON [dbo].[Documents] ([UploadedBy])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
