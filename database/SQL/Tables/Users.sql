CREATE TABLE [dbo].[Users]
(
	[Id] INT NOT NULL  IDENTITY,
    [FirstName] VARCHAR(50) NOT NULL,
    [LastName] VARCHAR(50) NOT NULL,
	[Email] VARCHAR(254) NOT NULL ,
    [AuthUserId] INT NOT NULL,
    [ImageId] INT NULL,
	[AddressId] INT NULL,
    [SchoolDistrictId] INT NULL,
    [Version] ROWVERSION NOT NULL,
    [CreatedById] INT NULL ,
    [ModifiedById] INT NULL,
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
    [DateModified] DATETIME NULL,
    [Archived] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [FK_Users_AuthUsers] FOREIGN KEY (AuthUserId) REFERENCES AuthUsers(Id),
    CONSTRAINT [FK_Users_Images] FOREIGN KEY (ImageId) REFERENCES Images(Id),
    CONSTRAINT [FK_Users_Addresses] FOREIGN KEY (AddressId) REFERENCES Addresses(Id),
    CONSTRAINT [FK_Users_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_Users_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_Users_SchoolDistrict] FOREIGN KEY (SchoolDistrictId) REFERENCES [dbo].[SchoolDistricts] ([Id]),
    CONSTRAINT [PK_Users] PRIMARY KEY ([Id])
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Users',
    @level2type = N'COLUMN',
    @level2name = N'Id'
