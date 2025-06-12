CREATE TABLE [dbo].[MergedStudents]
(
	[Id] INT NOT NULL IDENTITY,
    [FirstName] VARCHAR(50) NOT NULL,
    [MiddleName] VARCHAR(50) NULL,
    [LastName] VARCHAR(50) NOT NULL,
    [StudentCode] VARCHAR(12) NOT NULL,
    [Grade] VARCHAR(2) NOT NULL,
    [DateOfBirth] DATETIME NOT NULL,
    [AddressId] INT NULL,
    [SchoolId] INT NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1,
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
    [MergedToStudentId] INT NOT NULL,
    CONSTRAINT [PK_MergedStudents] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_MergedStudents_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_MergedStudents_Addresses] FOREIGN KEY (AddressId) REFERENCES [dbo].[Addresses] ([Id]),
    CONSTRAINT [FK_MergedStudents_Students] FOREIGN KEY (MergedToStudentId) REFERENCES [dbo].[Students] ([Id]),
    CONSTRAINT [FK_MergedStudents_School] FOREIGN KEY (SchoolId) REFERENCES [dbo].[Schools] (Id)
)

GO

