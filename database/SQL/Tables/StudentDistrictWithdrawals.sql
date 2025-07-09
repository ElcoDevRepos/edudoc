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

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_StudentDistrictWithdrawals_StudentId] 
ON [dbo].[StudentDistrictWithdrawals] ([StudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentDistrictWithdrawals_DistrictId] 
ON [dbo].[StudentDistrictWithdrawals] ([DistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentDistrictWithdrawals_CreatedById] 
ON [dbo].[StudentDistrictWithdrawals] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_StudentDistrictWithdrawals_ModifiedById] 
ON [dbo].[StudentDistrictWithdrawals] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
