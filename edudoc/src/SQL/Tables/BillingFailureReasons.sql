CREATE TABLE [dbo].[BillingFailureReasons]
(
	[Id] INT NOT NULL IDENTITY, 
    [Name] VARCHAR(50) NOT NULL, 
    CONSTRAINT [PK_BillingFailureReasons] PRIMARY KEY ([Id]) 
)
