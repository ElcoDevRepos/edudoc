CREATE TABLE [dbo].[AnnualEntries]
(
	[Id] INT NOT NULL IDENTITY,
    [Year] VARCHAR(4) NOT NULL,
    [StatusId] INT NOT NULL,
    [AllowableCosts] VARCHAR(18) NOT NULL,
    [InterimPayments] VARCHAR(18) NOT NULL,
    [SettlementAmount] VARCHAR(18) NOT NULL,
    [MER] VARCHAR(18) NULL,
    [RMTS] VARCHAR(18) NULL,
    [SchoolDistrictId] INT NOT NULL,
    [Archived]  BIT NOT NULL DEFAULT 0,
    CONSTRAINT [PK_AnnualEntries] PRIMARY KEY ([Id]), 
    CONSTRAINT [FK_AnnualEntries_AnnualEntryStatuses] FOREIGN KEY ([StatusId]) REFERENCES [AnnualEntryStatuses]([Id]), 
    CONSTRAINT [FK_AnnualEntries_SchoolDistricts] FOREIGN KEY ([SchoolDistrictId]) REFERENCES [SchoolDistricts]([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_AnnualEntries_StatusId] 
ON [dbo].[AnnualEntries] ([StatusId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_AnnualEntries_SchoolDistrictId] 
ON [dbo].[AnnualEntries] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'AnnualEntries',
    @level2type = N'COLUMN',
    @level2name = N'Id'
