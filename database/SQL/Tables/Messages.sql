CREATE TABLE [dbo].[Messages]
(
	[Id] INT NOT NULL  IDENTITY, 
    [Description] VARCHAR(500) NOT NULL, 
    [Body] TEXT NOT NULL,
    [ValidTill] DATETIME NULL,  
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
    [SortOrder] INT NULL,
    CONSTRAINT [PK_Messages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Message_ServiceCodes] FOREIGN KEY (ServiceCodeId) REFERENCES ServiceCodes(Id),
    CONSTRAINT [FK_Message_SchoolDistricts] FOREIGN KEY (SchoolDistrictId) REFERENCES SchoolDistricts(Id), 
    CONSTRAINT [FK_Message_ProviderTitles] FOREIGN KEY (ProviderTitleId) REFERENCES ProviderTitles(Id), 
    CONSTRAINT [FK_Message_Providers] FOREIGN KEY (ProviderId) REFERENCES Providers(Id),
    CONSTRAINT [FK_Message_Escs] FOREIGN KEY (EscId) REFERENCES Escs(Id), 
    CONSTRAINT [FK_Messages_CreatedBy] FOREIGN KEY ([CreatedById]) REFERENCES Users(Id),
    CONSTRAINT [FK_Messages_ModifiedBy] FOREIGN KEY ([ModifiedById]) REFERENCES Users(Id),
    CONSTRAINT [FK_Messages_MessageFilterTypes] FOREIGN KEY (MessageFilterTypeId) REFERENCES [dbo].[MessageFilterTypes] ([Id])
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_Messages_ServiceCodeId] 
ON [dbo].[Messages] ([ServiceCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Messages_SchoolDistrictId] 
ON [dbo].[Messages] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Messages_ProviderTitleId] 
ON [dbo].[Messages] ([ProviderTitleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Messages_ProviderId] 
ON [dbo].[Messages] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Messages_EscId] 
ON [dbo].[Messages] ([EscId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Messages_CreatedById] 
ON [dbo].[Messages] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Messages_ModifiedById] 
ON [dbo].[Messages] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Messages_MessageFilterTypeId] 
ON [dbo].[Messages] ([MessageFilterTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
