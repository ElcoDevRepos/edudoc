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

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_Users_AuthUserId] 
ON [dbo].[Users] ([AuthUserId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Users_ImageId] 
ON [dbo].[Users] ([ImageId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Users_AddressId] 
ON [dbo].[Users] ([AddressId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Users_CreatedById] 
ON [dbo].[Users] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Users_ModifiedById] 
ON [dbo].[Users] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Users_SchoolDistrictId] 
ON [dbo].[Users] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Email-based lookups (common in EF)
CREATE NONCLUSTERED INDEX [IX_Users_Email_Archived] 
ON [dbo].[Users] ([Email], [Archived])
INCLUDE ([FirstName], [LastName], [AuthUserId])
WITH (FILLFACTOR = 95, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- District admin lookups
CREATE NONCLUSTERED INDEX [IX_Users_SchoolDistrictId_Archived] 
ON [dbo].[Users] ([SchoolDistrictId], [Archived])
INCLUDE ([FirstName], [LastName], [Email])
WITH (FILLFACTOR = 95, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Users',
    @level2type = N'COLUMN',
    @level2name = N'Id'
