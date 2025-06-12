CREATE TYPE [dbo].[ClaimsEncounterData] AS TABLE
(
    [ClaimAmount] VARCHAR(18) NOT NULL,
    [ProcedureIdentifier] VARCHAR(50) NOT NULL,
    [BillingUnits] VARCHAR(15) NOT NULL,
    [ServiceDate] DateTime NOT NULL,
    [PhysicianFirstName] VARCHAR(35) NULL,
    [PhysicianLastName] VARCHAR(60) NULL,
    [PhysicianId] VARCHAR(80) NULL,
    [ReferringProviderFirstName] VARCHAR(35) NULL,
    [ReferringProviderLastName] VARCHAR(60) NULL,
    [ReasonForServiceCode] VARCHAR(50) NOT NULL,
    [ReferringProviderId] VARCHAR(80) NOT NULL,
    [IsTelehealth] BIT NOT NULL DEFAULT(0),
    [ClaimsStudentId] INT NOT NULL,
    [EncounterStudentId] INT NOT NULL,
    [EncounterStudentCptCodeId] INT NOT NULL,
    [ControlNumberPrefix] VARCHAR(3) NULL,
    [BulkIndex] INT NOT NULL
);
