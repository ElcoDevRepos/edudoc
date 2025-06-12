CREATE TABLE [dbo].[Addresses] (
    [Id]       INT          IDENTITY (1, 1) NOT NULL,
    [Address1] NVARCHAR(250) NOT NULL DEFAULT (''),
    [Address2] NVARCHAR(250) CONSTRAINT [DF_Addresses_Address2] DEFAULT ('') NOT NULL,
    [City]     NVARCHAR(50) CONSTRAINT [DF_Addresses_City] DEFAULT ('') NOT NULL,
    [StateCode]    CHAR (2)  NOT NULL DEFAULT ('') ,
    [Zip]      NVARCHAR(20) NOT NULL DEFAULT (''),
    [CountryCode] CHAR(2) NULL, 
    [Province] NVARCHAR(50) NOT NULL DEFAULT (''), 
    [County] VARCHAR(50) NULL, 
    CONSTRAINT [PK_Addresses] PRIMARY KEY CLUSTERED ([Id] ASC),
	CONSTRAINT [FK_Addresses_States] FOREIGN KEY ([StateCode]) REFERENCES [dbo].[States] ([StateCode]),
	CONSTRAINT [FK_Addresses_Countries] FOREIGN KEY ([CountryCode]) REFERENCES [dbo].[Countries] ([CountryCode])
);
