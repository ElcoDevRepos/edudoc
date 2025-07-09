CREATE TABLE [dbo].[SchoolDistrictsFinancialReps]
(
	[Id] INT NOT NULL IDENTITY,
    [FinancialRepId] INT NOT NULL,
	[SchoolDistrictId] INT NOT NULL,
    CONSTRAINT [FK_SchoolDistrictsFinancialReps_FinancialRep] FOREIGN KEY ([FinancialRepId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_SchoolDistrictsFinancialReps_SchoolDistrict] FOREIGN KEY ([SchoolDistrictId]) REFERENCES [SchoolDistricts]([Id]),
    CONSTRAINT [PK_SchoolDistrictsFinancialReps] PRIMARY KEY ([Id])
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_SchoolDistrictsFinancialReps_FinancialRepId] 
ON [dbo].[SchoolDistrictsFinancialReps] ([FinancialRepId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistrictsFinancialReps_SchoolDistrictId] 
ON [dbo].[SchoolDistrictsFinancialReps] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
