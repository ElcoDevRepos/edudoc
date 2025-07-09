CREATE TABLE [dbo].[MessageLinks]
(
	[Id] INT NOT NULL  IDENTITY, 
    [Description] VARCHAR(200) NOT NULL, 
    [URL] varchar(1000) NOT NULL, 
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
    CONSTRAINT [PK_MessageLinks] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_MessageLink_ServiceCodes] FOREIGN KEY (ServiceCodeId) REFERENCES ServiceCodes(Id),
    CONSTRAINT [FK_MessageLink_SchoolDistricts] FOREIGN KEY (SchoolDistrictId) REFERENCES SchoolDistricts(Id), 
    CONSTRAINT [FK_MessageLink_ProviderTitles] FOREIGN KEY (ProviderTitleId) REFERENCES ProviderTitles(Id), 
    CONSTRAINT [FK_MessageLink_Providers] FOREIGN KEY (ProviderId) REFERENCES Providers(Id),
    CONSTRAINT [FK_MessageLink_Escs] FOREIGN KEY (EscId) REFERENCES Escs(Id), 
    CONSTRAINT [FK_MessageLinks_MessageFilterTypes] FOREIGN KEY (MessageFilterTypeId) REFERENCES [dbo].[MessageFilterTypes] ([Id]),
    CONSTRAINT [FK_MessageLinks_TrainingType] FOREIGN KEY (TrainingTypeId) REFERENCES [dbo].[TrainingTypes] ([Id]),
    CONSTRAINT [FK_MessageLinks_CreatedBy] FOREIGN KEY ([CreatedById]) REFERENCES Users(Id),
    CONSTRAINT [FK_MessageLinks_ModifiedBy] FOREIGN KEY ([ModifiedById]) REFERENCES Users(Id)
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_MessageLinks_ServiceCodeId] 
ON [dbo].[MessageLinks] ([ServiceCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageLinks_SchoolDistrictId] 
ON [dbo].[MessageLinks] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageLinks_ProviderTitleId] 
ON [dbo].[MessageLinks] ([ProviderTitleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageLinks_ProviderId] 
ON [dbo].[MessageLinks] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageLinks_EscId] 
ON [dbo].[MessageLinks] ([EscId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageLinks_MessageFilterTypeId] 
ON [dbo].[MessageLinks] ([MessageFilterTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageLinks_TrainingTypeId] 
ON [dbo].[MessageLinks] ([TrainingTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageLinks_CreatedById] 
ON [dbo].[MessageLinks] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_MessageLinks_ModifiedById] 
ON [dbo].[MessageLinks] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
