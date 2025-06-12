CREATE TABLE [dbo].[ProviderInactivityReasons]
(
	[Id] INT NOT NULL , 
    [Name] VARCHAR(50) NOT NULL, 
    [Code] VARCHAR(3) NULL, 
    CONSTRAINT [PK_ProviderInactivityReasons] PRIMARY KEY ([Id])
)
