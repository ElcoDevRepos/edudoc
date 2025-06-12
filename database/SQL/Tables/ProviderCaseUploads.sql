CREATE TABLE [dbo].[ProviderCaseUploads]
(
	[Id] INT NOT NULL IDENTITY,
    [ProviderId] INT NULL,
    [DistrictId] INT NOT NULL,
    [FirstName] VARCHAR(MAX)  NULL,
    [MiddleName] VARCHAR(MAX) NULL,
    [LastName] VARCHAR(MAX)  NULL,
    [Grade] VARCHAR(MAX) NULL,
    [DateOfBirth] VARCHAR(MAX)  NULL,
    [School] VARCHAR(MAX) NULL,
    [ModifiedById] INT NULL, -- No created by since the roster is alway going to be created by a job
    [DateCreated] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    [DateModified] DATETIME NULL,
    [ProviderCaseUploadDocumentId] INT NOT NULL,
    [HasDuplicates] BIT NULL DEFAULT 0,
    [HasDataIssues] BIT NULL DEFAULT 0,
    [Archived] BIT NOT NULL DEFAULT 0,
    [StudentId] INT NULL,
    -- use when user decides to NOT take any action with the Issues
    CONSTRAINT [FK_ProviderCaseUploads_ProviderCaseUploadDocuments] FOREIGN KEY (ProviderCaseUploadDocumentId) REFERENCES [dbo].[ProviderCaseUploadDocuments] ([Id]),
	CONSTRAINT [FK_ProviderCaseUploads_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_ProviderCaseUploads_Providers] FOREIGN KEY ([ProviderId]) REFERENCES [Providers](Id),
    CONSTRAINT [FK_ProviderCaseUploads_SchoolDistricts] FOREIGN KEY ([DistrictId]) REFERENCES [SchoolDistricts](Id),
    CONSTRAINT [FK_ProviderCaseUploads_Students] FOREIGN KEY (StudentId) REFERENCES [dbo].[Students] ([Id]),
    CONSTRAINT [PK_ProviderCaseUploads] PRIMARY KEY ([Id])
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'ProviderCaseUploads',
    @level2type = N'COLUMN',
    @level2name = N'Id'
