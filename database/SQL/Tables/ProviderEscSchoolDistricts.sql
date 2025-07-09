CREATE TABLE [dbo].[ProviderEscSchoolDistricts]
(
	[Id] INT NOT NULL IDENTITY,
    [ProviderEscAssignmentId] INT NOT NULL,
	[SchoolDistrictId] INT NOT NULL,
    CONSTRAINT [FK_ProviderEscSchoolDistricts_ProviderEsc] FOREIGN KEY ([ProviderEscAssignmentId]) REFERENCES [dbo].[ProviderEscAssignments] ([Id]),
    CONSTRAINT [FK_ProviderEscSchoolDistricts_SchoolDistrict] FOREIGN KEY ([SchoolDistrictId]) REFERENCES [SchoolDistricts]([Id]),
    CONSTRAINT [PK_ProviderEscSchoolDistricts] PRIMARY KEY ([Id])
)
GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ProviderEscSchoolDistricts_ProviderEscAssignmentId] 
ON [dbo].[ProviderEscSchoolDistricts] ([ProviderEscAssignmentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProviderEscSchoolDistricts_SchoolDistrictId] 
ON [dbo].[ProviderEscSchoolDistricts] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
