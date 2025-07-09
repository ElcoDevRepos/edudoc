CREATE TABLE [dbo].[ProviderAcknowledgmentLogs]
(
	[Id] INT NOT NULL IDENTITY,
	[ProviderId] INT NOT NULL,
    [DateAcknowledged] DATETIME NOT NULL, 
    CONSTRAINT [FK_ProviderAcknowledgmentLogs_Providers] FOREIGN KEY (ProviderId) REFERENCES [dbo].[Providers] ([Id]),
    CONSTRAINT [PK_ProviderAcknowledgmentLogs] PRIMARY KEY ([Id])

)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ProviderAcknowledgmentLogs_ProviderId] 
ON [dbo].[ProviderAcknowledgmentLogs] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
