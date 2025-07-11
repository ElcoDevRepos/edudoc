CREATE TABLE [dbo].[ClaimsStudents]
(
	[Id] INT NOT NULL  IDENTITY, 
    [LastName] VARCHAR(60) NOT NULL,
    [FirstName] VARCHAR(35) NOT NULL,
    [IdentificationCode] VARCHAR(12) CONSTRAINT [CK_ClaimsStudents_IdentificationCode] CHECK (LEN([IdentificationCode]) >= 2) NOT NULL,
    [Address] VARCHAR(55) NOT NULL,
    [City] VARCHAR(30) CONSTRAINT [CK_ClaimsStudents_City] CHECK (LEN([City]) >= 2) NOT NULL,
    [State] VARCHAR(2) CONSTRAINT [CK_ClaimsStudents_State] CHECK (LEN([State]) >= 2) NOT NULL,
    [PostalCode] VARCHAR(15) CONSTRAINT [CK_ClaimsStudents_PostalCode] CHECK (LEN([PostalCode]) >= 3) NOT NULL,
    [InsuredDateTimePeriod] VARCHAR(35) NOT NULL,
    [ResponseValid] BIT NULL,
    [ResponseRejectReason] INT NULL,
    [ResponseFollowUpAction] VARCHAR(2) NULL,
    [ClaimsDistrictId] INT NOT NULL,
    [StudentId] INT NOT NULL,
    CONSTRAINT [FK_ClaimsStudents_ClaimsDistrict] FOREIGN KEY ([ClaimsDistrictId]) REFERENCES ClaimsDistricts(Id),
    CONSTRAINT [FK_ClaimsStudents_Student] FOREIGN KEY ([StudentId]) REFERENCES Students(Id),
    CONSTRAINT [PK_ClaimsStudents] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ClaimsStudents_ClaimsDistrictId] 
ON [dbo].[ClaimsStudents] ([ClaimsDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ClaimsStudents_StudentId] 
ON [dbo].[ClaimsStudents] ([StudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
