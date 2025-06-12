CREATE TABLE [dbo].[Countries]
(
	[CountryCode] CHAR(2) NOT NULL , 
    [Alpha3Code] CHAR(3) NOT NULL, 
    [Name] VARCHAR(50) NOT NULL, 
    CONSTRAINT [PK_Countries] PRIMARY KEY ([CountryCode])
)
