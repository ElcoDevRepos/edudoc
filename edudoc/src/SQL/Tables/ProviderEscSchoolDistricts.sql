CREATE TABLE [dbo].[ProviderEscSchoolDistricts]
(
	[Id] INT NOT NULL IDENTITY,
    [ProviderEscAssignmentId] INT NOT NULL,
	[SchoolDistrictId] INT NOT NULL,
    CONSTRAINT [FK_ProviderEscSchoolDistricts_ProviderEsc] FOREIGN KEY ([ProviderEscAssignmentId]) REFERENCES [dbo].[ProviderEscAssignments] ([Id]),
    CONSTRAINT [FK_ProviderEscSchoolDistricts_SchoolDistrict] FOREIGN KEY ([SchoolDistrictId]) REFERENCES [SchoolDistricts]([Id]),
    CONSTRAINT [PK_ProviderEscSchoolDistricts] PRIMARY KEY ([Id])
)
Go
create nonclustered index [IX_ProviderEscSchoolDistricts_ProviderEscAssignmentId] on [dbo].[ProviderEscSchoolDistricts](ProviderEscAssignmentId);
Go
create nonclustered index [IX_ProviderEscSchoolDistricts_SchoolDistrictId] on [dbo].[ProviderEscSchoolDistricts](SchoolDistrictId);
