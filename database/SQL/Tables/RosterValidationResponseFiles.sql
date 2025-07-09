CREATE TABLE [dbo].[RosterValidationResponseFiles]
(
	[Id] INT NOT NULL  IDENTITY, 
    [Name] VARCHAR(200) NOT NULL, 
    [DateUploaded] DATETIME NOT NULL DEFAULT (getdate()), 
    [FilePath] VARCHAR(200) NOT NULL,
    [UploadedById] INT NULL,
    [RosterValidationFileId] INT NOT NULL,
    CONSTRAINT [FK_RosterValidationResponseFiles_RosterValidationFile] FOREIGN KEY ([RosterValidationFileId]) REFERENCES RosterValidationFiles(Id),
    CONSTRAINT [PK_RosterValidationResponseFiles] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_RosterValidationResponseFiles_Users] FOREIGN KEY ([UploadedById]) REFERENCES Users(Id),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_RosterValidationResponseFiles_RosterValidationFileId] 
ON [dbo].[RosterValidationResponseFiles] ([RosterValidationFileId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_RosterValidationResponseFiles_UploadedById] 
ON [dbo].[RosterValidationResponseFiles] ([UploadedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
