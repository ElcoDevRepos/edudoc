CREATE TABLE [dbo].[ProviderEscAssignments]
(
	[Id] INT NOT NULL IDENTITY,
	[ProviderId] INT NOT NULL,
    [EscId] INT NULL,
	[StartDate] DATETIME NOT NULL DEFAULT GETUTCDATE(),
	[EndDate] DATETIME  NULL,
    [CreatedById] INT NULL , 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL, 
    [Archived] BIT NOT NULL DEFAULT 0,
    [AgencyTypeId] INT NULL,             
    [AgencyId] INT NULL,                -- Stores the Agency ID for Agency when Agency or Agency with Provider is selected - The options could be DDL on the Front-end only
    CONSTRAINT [FK_ProviderEscs_AgencyType] FOREIGN KEY (AgencyTypeId) REFERENCES [dbo].[AgencyTypes] ([Id]),
    CONSTRAINT [FK_ProviderEscs_Esc] FOREIGN KEY (EscId) REFERENCES [dbo].[Escs] ([Id]),
	CONSTRAINT [FK_ProviderEscs_Agencies] FOREIGN KEY (AgencyId) REFERENCES [dbo].[Agencies] ([Id]),
    CONSTRAINT [FK_ProviderEscs_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_ProviderEscs_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_ProviderEscs_Providers] FOREIGN KEY (ProviderId) REFERENCES [dbo].[Providers] ([Id]),
    CONSTRAINT [PK_ProviderEscs] PRIMARY KEY ([Id])
)
GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ProviderEscAssignments_ProviderId] 
ON [dbo].[ProviderEscAssignments] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderEscAssignments_EscId] 
ON [dbo].[ProviderEscAssignments] ([EscId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderEscAssignments_AgencyTypeId] 
ON [dbo].[ProviderEscAssignments] ([AgencyTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderEscAssignments_AgencyId] 
ON [dbo].[ProviderEscAssignments] ([AgencyId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderEscAssignments_CreatedById] 
ON [dbo].[ProviderEscAssignments] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderEscAssignments_ModifiedById] 
ON [dbo].[ProviderEscAssignments] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
