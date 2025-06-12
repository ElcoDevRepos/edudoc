CREATE TABLE [dbo].[RevokeAccess]
(
	[Id] INT NOT NULL IDENTITY,
    [ProviderId] INT NOT NULL,
    [Date] DATETIME NOT NULL DEFAULT GETUTCDATE(),
    [RevocationReasonId] INT NULL ,
    [OtherReason] VARCHAR(250) NULL, 
    [AccessGranted] BIT NULL DEFAULT 0,
    CONSTRAINT [FK_RevokeAccess_Providers] FOREIGN KEY ([ProviderId]) REFERENCES [Providers]([Id]), 
    CONSTRAINT [FK_RevokeAccess_ProviderDoNotBillReasons] FOREIGN KEY ([RevocationReasonId]) REFERENCES [ProviderDoNotBillReasons]([Id]),
    CONSTRAINT [PK_RevokeAccess] PRIMARY KEY ([Id])
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'RevokeAccess',
    @level2type = N'COLUMN',
    @level2name = N'Id'
