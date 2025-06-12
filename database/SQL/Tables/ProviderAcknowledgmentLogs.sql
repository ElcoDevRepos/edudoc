CREATE TABLE [dbo].[ProviderAcknowledgmentLogs]
(
	[Id] INT NOT NULL IDENTITY,
	[ProviderId] INT NOT NULL,
    [DateAcknowledged] DATETIME NOT NULL, 
    CONSTRAINT [FK_ProviderAcknowledgmentLogs_Providers] FOREIGN KEY (ProviderId) REFERENCES [dbo].[Providers] ([Id]),
    CONSTRAINT [PK_ProviderAcknowledgmentLogs] PRIMARY KEY ([Id])

)
