CREATE TABLE [dbo].[RosterValidationDistricts]
(
	[Id] INT NOT NULL  IDENTITY, 
    [IdentificationCode] VARCHAR(80) CONSTRAINT [CK_RosterValidationDistricts_IdentificationCode] CHECK (LEN([IdentificationCode]) >= 2) NOT NULL,
    [DistrictOrganizationName] VARCHAR(60) NOT NULL,
    [Address] VARCHAR(55) NOT NULL,
    [City] VARCHAR(30) CONSTRAINT [CK_RosterValidationDistricts_City] CHECK (LEN([City]) >= 2) NOT NULL,
    [State] VARCHAR(2) CONSTRAINT [CK_RosterValidationDistricts_State] CHECK (LEN([State]) >= 2) NOT NULL,
    [PostalCode] VARCHAR(15) CONSTRAINT [CK_RosterValidationDistricts_PostalCode] CHECK (LEN([PostalCode]) >= 3) NOT NULL,
    [EmployerId] VARCHAR(50) NOT NULL,
    [SegmentsCount] INT NULL,
    [Index] INT CONSTRAINT [Ck_RosterValidationDistricts_Index] CHECK ([Index] BETWEEN 1 and 999999999999) NULL,
    [RosterValidationId] INT NOT NULL,
    [SchoolDistrictId] INT NOT NULL,
    CONSTRAINT [FK_RosterValidationDistricts_RosterValidations] FOREIGN KEY ([RosterValidationId]) REFERENCES RosterValidations(Id),
    CONSTRAINT [FK_RosterValidationDistricts_SchoolDistrict] FOREIGN KEY ([SchoolDistrictId]) REFERENCES SchoolDistricts(Id),
    CONSTRAINT [PK_RosterValidationDistricts] PRIMARY KEY ([Id]),
)
