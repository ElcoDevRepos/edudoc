CREATE TYPE [dbo].[ClaimsStudentData] AS TABLE
(
    [IdentificationCode] VARCHAR(12) NOT NULL,
    [LastName] VARCHAR(60) NOT NULL,
    [FirstName] VARCHAR(35) NOT NULL,
    [Address] VARCHAR(55) NOT NULL,
    [City] VARCHAR(30) NOT NULL,
    [State] VARCHAR(2) NOT NULL,
    [PostalCode] VARCHAR(15) NOT NULL,
    [InsuredDateTimePeriod] VARCHAR(35) NOT NULL,
    [ClaimsDistrictId] INT NOT NULL,
    [StudentId] INT NOT NULL,
    [BulkIndex] INT NOT NULL
);
