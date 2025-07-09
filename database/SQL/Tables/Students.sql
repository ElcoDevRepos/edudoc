CREATE TABLE [dbo].[Students]
(
	[Id] INT NOT NULL IDENTITY,
    [FirstName] VARCHAR(50) NOT NULL,
    [MiddleName] VARCHAR(50) NULL,
    [LastName] VARCHAR(50) NOT NULL,
    [StudentCode] VARCHAR(12) NULL,
    [MedicaidNo] VARCHAR(12) NULL,
    [Grade] VARCHAR(2) NOT NULL,
    [DateOfBirth] DATETIME NOT NULL,
    [Notes] VARCHAR(250) NULL,
    [AddressId] INT NULL,
    [SchoolId] INT NOT NULL,
    [DistrictId] INT NULL,
    [EnrollmentDate] DATETIME NULL DEFAULT GETUTCDATE(),
    [EscId] INT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1,
    [ModifiedById] INT NULL,
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
    [DateModified] DATETIME NULL,
    [Archived] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Students] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Students_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_Students_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_Students_Addresses] FOREIGN KEY (AddressId) REFERENCES [dbo].[Addresses] ([Id]),
    CONSTRAINT [FK_Students_School] FOREIGN KEY (SchoolId) REFERENCES [dbo].[Schools] (Id),
    CONSTRAINT [FK_Students_SchoolDistrict] FOREIGN KEY (DistrictId) REFERENCES [dbo].[SchoolDistricts] (Id),
    CONSTRAINT [FK_Students_Esc] FOREIGN KEY (EscId) REFERENCES [dbo].[Escs] ([Id]),
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Students',
    @level2type = N'COLUMN',
    @level2name = N'Id'

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_Students_CreatedById] 
ON [dbo].[Students] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Students_ModifiedById] 
ON [dbo].[Students] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Students_AddressId] 
ON [dbo].[Students] ([AddressId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Students_SchoolId] 
ON [dbo].[Students] ([SchoolId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Students_DistrictId] 
ON [dbo].[Students] ([DistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Students_EscId] 
ON [dbo].[Students] ([EscId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Primary student search index (most common EF pattern)
CREATE NONCLUSTERED INDEX [IX_Students_Archived_LastName_FirstName] 
ON [dbo].[Students] ([Archived], [LastName], [FirstName])
INCLUDE ([StudentCode], [MedicaidNo], [DateOfBirth], [DistrictId], [SchoolId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Student code searches
CREATE NONCLUSTERED INDEX [IX_Students_StudentCode_Archived] 
ON [dbo].[Students] ([StudentCode], [Archived])
INCLUDE ([FirstName], [LastName], [DistrictId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- District filtering (very common in EF)
CREATE NONCLUSTERED INDEX [IX_Students_DistrictId_Archived_SchoolId] 
ON [dbo].[Students] ([DistrictId], [Archived], [SchoolId])
INCLUDE ([FirstName], [LastName], [StudentCode])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Date of birth range queries
CREATE NONCLUSTERED INDEX [IX_Students_DateOfBirth_Archived] 
ON [dbo].[Students] ([DateOfBirth], [Archived])
INCLUDE ([FirstName], [LastName], [StudentCode])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Medicaid number searches
CREATE NONCLUSTERED INDEX [IX_Students_MedicaidNo_Archived] 
ON [dbo].[Students] ([MedicaidNo], [Archived])
WHERE ([MedicaidNo] IS NOT NULL)
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);



