CREATE TABLE [dbo].[ProviderLicenses]
(
	[Id] INT NOT NULL IDENTITY,
	[ProviderId] INT NOT NULL,
	[License] VARCHAR(50) NOT NULL,
    [AsOfDate] DATETIME NOT NULL,
    [ExpirationDate] DATETIME NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    CONSTRAINT [FK_ProviderLicenses_Providers] FOREIGN KEY (ProviderId) REFERENCES [dbo].[Providers] ([Id]),
    CONSTRAINT [FK_ProviderLicenses_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_ProviderLicenses] PRIMARY KEY ([Id])
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ProviderLicenses_ProviderId] 
ON [dbo].[ProviderLicenses] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderLicenses_CreatedById] 
ON [dbo].[ProviderLicenses] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
