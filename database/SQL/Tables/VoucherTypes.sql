CREATE TABLE [dbo].[VoucherTypes]
(
	[Id] INT NOT NULL IDENTITY,
    [Name] VARCHAR(100) NOT NULL,
    [Sort] INT NULL DEFAULT 2,
    [Editable] BIT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_VoucherTypes] PRIMARY KEY ([Id]),
)
