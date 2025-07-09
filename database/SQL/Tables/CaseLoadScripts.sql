CREATE TABLE [dbo].[CaseLoadScripts]
(
	[Id] INT NOT NULL  IDENTITY,
    [NPI] VARCHAR(10) NOT NULL,
    [DiagnosisCodeId] INT NULL,
    [DoctorFirstName] VARCHAR(50) NOT NULL,
    [DoctorLastName] VARCHAR(50) NOT NULL,
    [InitiationDate] DATETIME NOT NULL,
    [ExpirationDate] DATETIME NULL,
    [FileName] VARCHAR(200) NOT NULL,
    [FilePath] VARCHAR(200) NOT NULL,
    [CaseLoadId] INT NOT NULL,
    [Archived]  BIT NOT NULL DEFAULT 0,
    [UploadedById] INT NULL,
    [ModifiedById] INT NULL,
    [DateUpload] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_CaseLoadScripts] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_CaseLoadScripts_UploadedBy] FOREIGN KEY ([UploadedById]) REFERENCES Users(Id),
    CONSTRAINT [FK_CaseLoadScripts_ModifiedBy] FOREIGN KEY ([ModifiedById]) REFERENCES Users(Id),
    CONSTRAINT [FK_CaseLoadScripts_CaseLoad] FOREIGN KEY ([CaseLoadId]) REFERENCES CaseLoads(Id),
	CONSTRAINT [FK_CaseLoadScripts_DiagnosisCodes] FOREIGN KEY ([DiagnosisCodeId]) REFERENCES [dbo].[DiagnosisCodes] ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_CaseLoadScripts_UploadedById] 
ON [dbo].[CaseLoadScripts] ([UploadedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadScripts_ModifiedById] 
ON [dbo].[CaseLoadScripts] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadScripts_CaseLoadId] 
ON [dbo].[CaseLoadScripts] ([CaseLoadId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CaseLoadScripts_DiagnosisCodeId] 
ON [dbo].[CaseLoadScripts] ([DiagnosisCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
