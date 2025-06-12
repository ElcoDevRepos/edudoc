CREATE TABLE [dbo].[SchoolDistrictProviderCaseNotes]
(
	[Id] INT NOT NULL IDENTITY,
    [SchoolDistrictId] INT NOT NULL,
    [ProviderTitleId] INT NOT NULL,
    CONSTRAINT [FK_SchoolDistrictProviderCaseNotes_Providers] FOREIGN KEY ([ProviderTitleId]) REFERENCES [dbo].[ProviderTitles] ([Id]),
    CONSTRAINT [FK_SchoolDistrictProviderCaseNotes_SchoolDistricts] FOREIGN KEY ([SchoolDistrictId]) REFERENCES [dbo].[SchoolDistricts] ([Id]),
    CONSTRAINT [PK_SchoolDistrictProviderCaseNotes] PRIMARY KEY ([Id]),
)
