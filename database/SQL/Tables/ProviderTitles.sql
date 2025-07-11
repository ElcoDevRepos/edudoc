CREATE TABLE [dbo].[ProviderTitles]
(
	[Id] INT NOT NULL IDENTITY,
    [Name] VARCHAR(100) NOT NULL, 
    [Code] VARCHAR(50) NULL, 
    [ServiceCodeId] INT NOT NULL,
    [SupervisorTitleId] INT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    [Archived] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [PK_ProviderTitles] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ProviderTitles_ServiceCodes] FOREIGN KEY (ServiceCodeId) REFERENCES [dbo].[ServiceCodes] ([Id]),
    CONSTRAINT [FK_ProviderTitle_SupervisorTitle] FOREIGN KEY ([SupervisorTitleId]) REFERENCES [ProviderTitles]([Id]),
	CONSTRAINT [FK_ProviderTitles_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_ProviderTitles_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ProviderTitles_ServiceCodeId] 
ON [dbo].[ProviderTitles] ([ServiceCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderTitles_SupervisorTitleId] 
ON [dbo].[ProviderTitles] ([SupervisorTitleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderTitles_CreatedById] 
ON [dbo].[ProviderTitles] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderTitles_ModifiedById] 
ON [dbo].[ProviderTitles] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'ProviderTitles',
    @level2type = N'COLUMN',
    @level2name = N'Id'
