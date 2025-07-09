CREATE TABLE [dbo].[ProviderODECertifications]
(
	[Id] INT NOT NULL IDENTITY,
	[ProviderId] INT NOT NULL,
    [AsOfDate] DATETIME NOT NULL,
    [ExpirationDate] DATETIME NOT NULL,
    [CertificationNumber] VARCHAR(10) NOT NULL DEFAULT('0'),
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    CONSTRAINT [FK_ProviderODECertifiactions_Providers] FOREIGN KEY (ProviderId) REFERENCES [dbo].[Providers] ([Id]),
    CONSTRAINT [FK_ProviderODECertifiactions_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_ProviderODECertifiactions] PRIMARY KEY ([Id])
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ProviderODECertifications_ProviderId] 
ON [dbo].[ProviderODECertifications] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderODECertifications_CreatedById] 
ON [dbo].[ProviderODECertifications] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
