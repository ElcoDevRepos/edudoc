CREATE TYPE [dbo].[RosterValidationDistrictData] AS TABLE
(
    [IdentificationCode] VARCHAR(80) NOT NULL,
    [DistrictOrganizationName] VARCHAR(60) NOT NULL,
    [Address] VARCHAR(55) NOT NULL,
    [City] VARCHAR(30) NOT NULL,
    [State] VARCHAR(2) NOT NULL,
    [PostalCode] VARCHAR(15) NOT NULL,
    [EmployerId] VARCHAR(50) NOT NULL,
    [Index] INT NULL,
    [RosterValidationId] INT NOT NULL,
    [SchoolDistrictId] INT NOT NULL,
    [BulkIndex] INT NOT NULL
);
