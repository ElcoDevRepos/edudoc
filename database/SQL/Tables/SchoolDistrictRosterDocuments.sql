CREATE TABLE [dbo].[SchoolDistrictRosterDocuments]
(
    [Id] INT NOT NULL IDENTITY,
    [Name] VARCHAR(200) NOT NULL, 
    [SchoolDistrictId] INT NOT NULL,
    [DateUpload] DATETIME NOT NULL DEFAULT (getdate()),
    [UploadedBy] INT NULL, 
    [FilePath] VARCHAR(200) NOT NULL,
    [DateProcessed] DATETIME NULL, 
    [DateError] DATETIME NULL, 
    CONSTRAINT [FK_SchoolDistrictRosterDocuments_Users] FOREIGN KEY ([UploadedBy]) REFERENCES Users(Id),
    CONSTRAINT [PK_SchoolDistrictRosterDocuments] PRIMARY KEY ([Id]), 
    CONSTRAINT [FK_SchoolDistrictRosterDocuments_SchoolDistricts] FOREIGN KEY (SchoolDistrictId) REFERENCES [dbo].[SchoolDistricts](Id),
)
