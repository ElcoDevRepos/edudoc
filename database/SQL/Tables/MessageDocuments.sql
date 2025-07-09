CREATE TABLE [dbo].[MessageDocuments]
(
	[Id] INT NOT NULL  IDENTITY, 
    [Description] VARCHAR(200) NOT NULL, 
    [FilePath] VARCHAR(500) NOT NULL, 
    [FileName] VARCHAR(200) NOT NULL, 
    [ValidTill] DATETIME NULL,
    [Mandatory] BIT NOT NULL DEFAULT 0,
    [TrainingTypeId] INT NULL,
	[DueDate] DATETIME NULL,  
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NOT NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL, 
    [Archived] BIT NOT NULL DEFAULT 0,
    [MessageFilterTypeId] INT NOT NULL,
    [ServiceCodeId] INT  NULL ,
    [SchoolDistrictId] INT  NULL ,
    [ForDistrictAdmins] BIT NOT NULL DEFAULT 0,
    [ProviderTitleId] INT  NULL , 
    [ProviderId] INT  NULL , 
    [EscId] INT  NULL , 
    CONSTRAINT [PK_MessageDocuments] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_MessageDocument_ServiceCodes] FOREIGN KEY (ServiceCodeId) REFERENCES ServiceCodes(Id),
    CONSTRAINT [FK_MessageDocument_SchoolDistricts] FOREIGN KEY (SchoolDistrictId) REFERENCES SchoolDistricts(Id), 
    CONSTRAINT [FK_MessageDocument_ProviderTitles] FOREIGN KEY (ProviderTitleId) REFERENCES ProviderTitles(Id), 
    CONSTRAINT [FK_MessageDocument_Providers] FOREIGN KEY (ProviderId) REFERENCES Providers(Id),
    CONSTRAINT [FK_MessageDocument_Escs] FOREIGN KEY (EscId) REFERENCES Escs(Id), 
    CONSTRAINT [FK_MessageDocuments_TrainingType] FOREIGN KEY (TrainingTypeId) REFERENCES [dbo].[TrainingTypes] ([Id]),
    CONSTRAINT [FK_MessageDocuments_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_MessageDocuments_MessageFilterTypes] FOREIGN KEY (MessageFilterTypeId) REFERENCES [dbo].[MessageFilterTypes] ([Id]),
	CONSTRAINT [FK_MessageDocuments_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    )
 GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_MessageDocuments_ServiceCodeId] 
ON [dbo].[MessageDocuments] ([ServiceCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageDocuments_SchoolDistrictId] 
ON [dbo].[MessageDocuments] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageDocuments_ProviderTitleId] 
ON [dbo].[MessageDocuments] ([ProviderTitleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageDocuments_ProviderId] 
ON [dbo].[MessageDocuments] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageDocuments_EscId] 
ON [dbo].[MessageDocuments] ([EscId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageDocuments_TrainingTypeId] 
ON [dbo].[MessageDocuments] ([TrainingTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageDocuments_CreatedById] 
ON [dbo].[MessageDocuments] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageDocuments_MessageFilterTypeId] 
ON [dbo].[MessageDocuments] ([MessageFilterTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageDocuments_ModifiedById] 
ON [dbo].[MessageDocuments] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

EXEC sp_addextendedproperty
@name = N'MS_Description',
@value = N'Module',
@level0type = N'SCHEMA',
@level0name = N'dbo',
@level1type = N'TABLE',
@level1name = N'MessageDocuments',
@level2type = N'COLUMN',
@level2name = N'Id'
