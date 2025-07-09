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

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_RevokeAccess_ProviderId] 
ON [dbo].[RevokeAccess] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_RevokeAccess_RevocationReasonId] 
ON [dbo].[RevokeAccess] ([RevocationReasonId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'RevokeAccess',
    @level2type = N'COLUMN',
    @level2name = N'Id'
