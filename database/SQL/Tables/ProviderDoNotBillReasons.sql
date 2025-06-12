CREATE TABLE [dbo].[ProviderDoNotBillReasons]
(
	[Id] INT NOT NULL, 
    [Name] VARCHAR(50) NOT NULL, 
    [Sort] INT NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_ProviderDoNotBillReasons] PRIMARY KEY ([Id])
)
