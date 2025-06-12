CREATE TABLE [dbo].[SchoolDistrictRosters]
(
	[Id] INT NOT NULL IDENTITY,
    [SchoolDistrictId] INT NOT NULL,
    [FirstName] VARCHAR(MAX)  NULL,
    [MiddleName] VARCHAR(MAX) NULL,
    [LastName] VARCHAR(MAX)  NULL,
    [StudentCode] VARCHAR(MAX)  NULL,
    [Grade] VARCHAR(MAX)  NULL,
    [DateOfBirth] VARCHAR(MAX)  NULL,
    [Address1] VARCHAR(MAX)  NULL ,
    [Address2] VARCHAR(MAX)   NULL,
    [City]     VARCHAR(MAX)   NULL,
    [StateCode]   VARCHAR(MAX)  NULL ,
    [Zip]      VARCHAR(MAX) NOT NULL ,
    [SchoolBuilding] VARCHAR(MAX) NULL,
    [ModifiedById] INT NULL, -- No created by since the roster is alway going to be created by a job
    [DateCreated] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    [DateModified] DATETIME NULL,
    [SchoolDistrictRosterDocumentId] INT NOT NULL,
    [HasDuplicates] BIT NULL DEFAULT 0,
    [HasDataIssues] BIT NULL DEFAULT 0,
    [Archived] BIT NOT NULL DEFAULT 0,
    [StudentId] INT NULL,
    -- use when user decides to NOT take any action with the Issues
    CONSTRAINT [FK_SchoolDistrictRosters_SchoolDistrictRosterDocuments] FOREIGN KEY (SchoolDistrictRosterDocumentId) REFERENCES [dbo].[SchoolDistrictRosterDocuments] ([Id]),
	CONSTRAINT [FK_SchoolDistrictRosters_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_SchoolDistrictRosters_SchoolDistricts] FOREIGN KEY ([SchoolDistrictId]) REFERENCES SchoolDistricts(Id),
    CONSTRAINT [FK_SchoolDistrictRosters_Students] FOREIGN KEY (StudentId) REFERENCES [dbo].[Students] ([Id]),
   CONSTRAINT [PK_SchoolDistrictRosters] PRIMARY KEY ([Id])

)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'SchoolDistrictRosters',
    @level2type = N'COLUMN',
    @level2name = N'Id'
