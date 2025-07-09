CREATE TABLE [dbo].[SchoolDistrictProviderCaseNotes]
(
	[Id] INT NOT NULL IDENTITY,
    [SchoolDistrictId] INT NOT NULL,
    [ProviderTitleId] INT NOT NULL,
    CONSTRAINT [FK_SchoolDistrictProviderCaseNotes_Providers] FOREIGN KEY ([ProviderTitleId]) REFERENCES [dbo].[ProviderTitles] ([Id]),
    CONSTRAINT [FK_SchoolDistrictProviderCaseNotes_SchoolDistricts] FOREIGN KEY ([SchoolDistrictId]) REFERENCES [dbo].[SchoolDistricts] ([Id]),
    CONSTRAINT [PK_SchoolDistrictProviderCaseNotes] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_SchoolDistrictProviderCaseNotes_ProviderTitleId] 
ON [dbo].[SchoolDistrictProviderCaseNotes] ([ProviderTitleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistrictProviderCaseNotes_SchoolDistrictId] 
ON [dbo].[SchoolDistrictProviderCaseNotes] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
