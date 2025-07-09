CREATE TABLE [dbo].[BillingResponseFiles]
(
	[Id] INT NOT NULL  IDENTITY, 
    [Name] VARCHAR(200) NOT NULL, 
    [DateUploaded] DATETIME NOT NULL DEFAULT (GETUTCDATE()), 
    [DateProcessed] DATETIME NULL, 
    [FilePath] VARCHAR(200) NOT NULL,
    [UploadedById] INT NULL,
    CONSTRAINT [PK_BillingResponseFiles] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_BillingResponseFiles_Users] FOREIGN KEY ([UploadedById]) REFERENCES Users(Id),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_BillingResponseFiles_UploadedById] 
ON [dbo].[BillingResponseFiles] ([UploadedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
