CREATE TABLE [dbo].[Escs]
(
	[Id] INT NOT NULL IDENTITY,
    [Name] VARCHAR(250) NOT NULL,
    [Code] VARCHAR(50) NOT NULL,
    [Notes] VARCHAR(1000) NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL, 
    [Archived] BIT NOT NULL DEFAULT 0,
    [AddressId] INT NULL,
    CONSTRAINT [FK_Escs_Addresses] FOREIGN KEY (AddressId) REFERENCES Addresses(Id),
    CONSTRAINT [FK_Escs_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_Escs_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_Escs] PRIMARY KEY ([Id]),
)
GO
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Escs',
    @level2type = N'COLUMN',
    @level2name = N'Id'
