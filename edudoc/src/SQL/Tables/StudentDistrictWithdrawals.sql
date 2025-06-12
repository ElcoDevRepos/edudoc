CREATE TABLE [dbo].[StudentDistrictWithdrawals]
(
	[Id] INT NOT NULL IDENTITY,
    [StudentId] INT NOT NULL,
    [DistrictId] INT NOT NULL,
    [EnrollmentDate] DATETIME NULL,
    [WithdrawalDate] DATETIME NULL,
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [PK_StudentDistrictWithdrawals] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_StudentDistrictWithdrawals_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_StudentDistrictWithdrawals_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_StudentDistrictWithdrawals_Student] FOREIGN KEY ([StudentId]) REFERENCES [dbo].[Students] ([Id]),
	CONSTRAINT [FK_StudentDistrictWithdrawals_SchoolDistrict] FOREIGN KEY ([DistrictId]) REFERENCES [dbo].[SchoolDistricts] ([Id]),
)
