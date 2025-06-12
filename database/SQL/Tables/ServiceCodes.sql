CREATE TABLE [dbo].[ServiceCodes] -- Not a user facing table
(
	[Id] INT NOT NULL  IDENTITY,
    [Name] VARCHAR(50) NOT NULL,
    [Code] VARCHAR(50) NOT NULL,
    [Area] VARCHAR(50) NULL,
    [IsBillable] BIT NOT NULL,
    [NeedsReferral] BIT NOT NULL DEFAULT(0),
    [CanHaveMultipleProgressReportsPerStudent] BIT NOT NULL DEFAULT(0),
    [CanCosignProgressReports] BIT NOT NULL DEFAULT(0),
    CONSTRAINT [PK_ServiceCodes] PRIMARY KEY ([Id])
)

