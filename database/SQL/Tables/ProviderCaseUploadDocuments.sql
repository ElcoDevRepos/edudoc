CREATE TABLE [dbo].[ProviderCaseUploadDocuments]
(
    [Id] INT NOT NULL IDENTITY,
    [Name] VARCHAR(200) NOT NULL, 
    [DistrictId] INT NOT NULL,
    [DateUpload] DATETIME NOT NULL DEFAULT (getdate()),
    [UploadedBy] INT NULL, 
    [FilePath] VARCHAR(200) NOT NULL,
    [DateProcessed] DATETIME NULL, 
    [DateError] DATETIME NULL, 
    CONSTRAINT [FK_ProviderCaseUploadDocuments_Users] FOREIGN KEY ([UploadedBy]) REFERENCES Users(Id),
    CONSTRAINT [PK_ProviderCaseUploadDocuments] PRIMARY KEY ([Id]),     
    CONSTRAINT [FK_ProviderCaseUploadDocuments_SchoolDistricts] FOREIGN KEY (DistrictId) REFERENCES [dbo].[SchoolDistricts](Id),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ProviderCaseUploadDocuments_UploadedBy] 
ON [dbo].[ProviderCaseUploadDocuments] ([UploadedBy])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderCaseUploadDocuments_DistrictId] 
ON [dbo].[ProviderCaseUploadDocuments] ([DistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
