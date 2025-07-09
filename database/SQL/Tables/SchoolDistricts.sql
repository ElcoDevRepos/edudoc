CREATE TABLE [dbo].[SchoolDistricts]
(
	[Id] INT NOT NULL IDENTITY,
    [Name] VARCHAR(250) NOT NULL,
    [Code] VARCHAR(50) NOT NULL,
    [EINNumber] VARCHAR(9) NOT NULL,
    [IRNNumber] VARCHAR(6) NOT NULL,
    [NPINumber] VARCHAR(10) NOT NULL,
    [ProviderNumber] VARCHAR(7) NOT NULL,
    [BecameTradingPartnerDate] DATETIME  NULL,
    [BecameClientDate] DATETIME NULL,
    [RevalidationDate] DATETIME NULL ,
    [ValidationExpirationDate] DATETIME NULL ,
    [ProgressReports] BIT NOT NULL DEFAULT (0),
    [ProgressReportsSent] DATETIME NULL,
    [RequireNotesForAllEncountersSent] BIT NOT NULL DEFAULT (0),
    [NotesRequiredDate] DATETIME NULL ,
    [Notes] VARCHAR(1000) NULL,
    [CreatedById] INT NOT NULL DEFAULT 1,
    [ModifiedById] INT NULL,
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
    [DateModified] DATETIME NULL,
    [UseDisabilityCodes] BIT NOT NULL DEFAULT 0,
    [Archived] BIT NOT NULL DEFAULT 0,
    [AddressId] INT NULL,
    [AccountManagerId] INT NULL,
    [AccountAssistantId] INT NULL,
    [TreasurerId] INT NULL,
    [SpecialEducationDirectorId] INT NULL,
    [MerId] INT NULL,
    [ActiveStatus] BIT NOT NULL DEFAULT 1,
    [CaseNotesRequired] BIT NOT NULL DEFAULT 0,
    [IepDatesRequired] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [FK_SchoolDistricts_Addresses] FOREIGN KEY (AddressId) REFERENCES Addresses(Id),
    CONSTRAINT [FK_SchoolDistricts_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_SchoolDistricts_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_SchoolDistricts_AccountManager] FOREIGN KEY (AccountManagerId) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_SchoolDistricts_AccountAssistant] FOREIGN KEY (AccountAssistantId) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_SchoolDistricts_Treasurer] FOREIGN KEY (TreasurerId) REFERENCES [dbo].[Contacts] ([Id]),
    CONSTRAINT [FK_SchoolDistricts_SpecialEducationDirector] FOREIGN KEY (SpecialEducationDirectorId) REFERENCES [dbo].[Contacts] ([Id]),
    CONSTRAINT [FK_SchoolDistricts_MerFile] FOREIGN KEY (MerId) REFERENCES [dbo].[Documents] ([Id]),
    CONSTRAINT [PK_SchoolDistricts] PRIMARY KEY ([Id]),
)
GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_SchoolDistricts_AddressId] 
ON [dbo].[SchoolDistricts] ([AddressId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistricts_CreatedById] 
ON [dbo].[SchoolDistricts] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistricts_ModifiedById] 
ON [dbo].[SchoolDistricts] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistricts_AccountManagerId] 
ON [dbo].[SchoolDistricts] ([AccountManagerId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistricts_AccountAssistantId] 
ON [dbo].[SchoolDistricts] ([AccountAssistantId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistricts_TreasurerId] 
ON [dbo].[SchoolDistricts] ([TreasurerId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistricts_SpecialEducationDirectorId] 
ON [dbo].[SchoolDistricts] ([SpecialEducationDirectorId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistricts_MerId] 
ON [dbo].[SchoolDistricts] ([MerId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SchoolDistricts',
    @level2type = N'COLUMN',
    @level2name = N'Id'
