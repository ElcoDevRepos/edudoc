CREATE TABLE [dbo].[Vouchers]
(
	[Id] INT NOT NULL IDENTITY,
    [VoucherDate] DateTime NOT NULL,
    [VoucherAmount] VARCHAR(18) NOT NULL,
    [PaidAmount] VARCHAR(18) NOT NULL,
    [ServiceCode] VARCHAR(100) NULL,
    [SchoolDistrictId] INT NULL,
    [UnmatchedClaimDistrictId] INT NULL,
    [SchoolYear] VARCHAR(9) NOT NULL,
    [VoucherTypeId] INT NOT NULL DEFAULT 1,
    [Archived] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [PK_Vouchers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_Vouchers_SchoolDistricts] FOREIGN KEY ([SchoolDistrictId]) REFERENCES [SchoolDistricts]([Id]),
    CONSTRAINT [FK_Vouchers_UnmatchedClaimDistricts] FOREIGN KEY ([UnmatchedClaimDistrictId]) REFERENCES [UnmatchedClaimDistricts]([Id]),
    CONSTRAINT [FK_Vouchers_VoucherTypes] FOREIGN KEY ([VoucherTypeId]) REFERENCES [VoucherTypes]([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_Vouchers_SchoolDistrictId] 
ON [dbo].[Vouchers] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Vouchers_UnmatchedClaimDistrictId] 
ON [dbo].[Vouchers] ([UnmatchedClaimDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Vouchers_VoucherTypeId] 
ON [dbo].[Vouchers] ([VoucherTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Voucher date range queries (common in EF)
CREATE NONCLUSTERED INDEX [IX_Vouchers_VoucherDate_Archived_SchoolDistrictId] 
ON [dbo].[Vouchers] ([VoucherDate], [Archived], [SchoolDistrictId])
INCLUDE ([VoucherAmount], [ServiceCode], [SchoolYear])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- District voucher filtering
CREATE NONCLUSTERED INDEX [IX_Vouchers_SchoolDistrictId_VoucherDate] 
ON [dbo].[Vouchers] ([SchoolDistrictId], [VoucherDate])
INCLUDE ([VoucherAmount], [PaidAmount], [ServiceCode])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Vouchers',
    @level2type = N'COLUMN',
    @level2name = N'Id'
