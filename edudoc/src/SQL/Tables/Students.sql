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
CREATE NONCLUSTERED INDEX [IX_Students_DistrictId_Archived] ON [dbo].[Students] ([DistrictId],[Archived]) INCLUDE ([FirstName],[LastName],[StudentCode],[DateOfBirth])
GO
CREATE NONCLUSTERED INDEX [IX_Students_SchoolId_Archived] ON [dbo].[Students] ([SchoolId],[Archived]) INCLUDE ([FirstName],[LastName],[StudentCode],[DateOfBirth])



