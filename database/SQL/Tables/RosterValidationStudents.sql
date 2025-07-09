CREATE TABLE [dbo].[RosterValidationStudents]
(
	[Id] INT NOT NULL  IDENTITY, 
    [LastName] VARCHAR(60) NOT NULL,
    [FirstName] VARCHAR(35) NOT NULL,
    [IdentificationCode] VARCHAR(12) NULL,
    [ReferenceId] VARCHAR(15) NOT NULL,
    [RejectReasonCode] VARCHAR(3) NULL,
    [FollowUpActionCode] VARCHAR(3) NULL,
    [Address] VARCHAR(55) NOT NULL,
    [City] VARCHAR(30) CONSTRAINT [CK_RosterValidationStudents_City] CHECK (LEN([City]) >= 2) NOT NULL,
    [State] VARCHAR(2) CONSTRAINT [CK_RosterValidationStudents_State] CHECK (LEN([State]) >= 2) NOT NULL,
    [PostalCode] VARCHAR(15) CONSTRAINT [CK_RosterValidationStudents_PostalCode] CHECK (LEN([PostalCode]) >= 3) NOT NULL,
    [InsuredDateTimePeriod] VARCHAR(35) NOT NULL,
    [RosterValidationDistrictId] INT NOT NULL,
    [StudentId] INT NOT NULL,
    [IsSuccessfullyProcessed] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [FK_RosterValidationStudents_RosterValidationDistrict] FOREIGN KEY ([RosterValidationDistrictId]) REFERENCES RosterValidationDistricts(Id),
    CONSTRAINT [FK_RosterValidationStudents_Student] FOREIGN KEY ([StudentId]) REFERENCES Students(Id),
    CONSTRAINT [PK_RosterValidationStudents] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_RosterValidationStudents_RosterValidationDistrictId] 
ON [dbo].[RosterValidationStudents] ([RosterValidationDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_RosterValidationStudents_StudentId] 
ON [dbo].[RosterValidationStudents] ([StudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'RosterValidationStudents',
    @level2type = N'COLUMN',
    @level2name = N'Id'
