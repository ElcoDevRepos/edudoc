CREATE TABLE [dbo].[ProviderInactivityDates]
(
	[Id] INT NOT NULL IDENTITY, 
    [ProviderId] INT NOT NULL, 
    [ProviderInactivityStartDate] DATETIME NOT NULL, 
    [ProviderInactivityEndDate] DATETIME NULL,
    [ProviderDoNotBillReasonId] INT NOT NULL DEFAULT 1,
    [Archived] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [PK_ProviderInactivityDates] PRIMARY KEY ([Id]), 
    CONSTRAINT [FK_ProviderInactivityDates_Providers] FOREIGN KEY ([ProviderId]) REFERENCES [Providers]([Id]), 
    CONSTRAINT [FK_ProviderInactivityDates_ProviderDoNotBillReasons] FOREIGN KEY ([ProviderDoNotBillReasonId]) REFERENCES [ProviderDoNotBillReasons]([Id])
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ProviderInactivityDates_ProviderId] 
ON [dbo].[ProviderInactivityDates] ([ProviderId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderInactivityDates_ProviderDoNotBillReasonId] 
ON [dbo].[ProviderInactivityDates] ([ProviderDoNotBillReasonId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
