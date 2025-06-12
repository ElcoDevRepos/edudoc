CREATE TABLE [dbo].[SchoolDistrictsAccountAssistants]
(
	[Id] INT NOT NULL IDENTITY,
    [AccountAssistantId] INT NOT NULL,
	[SchoolDistrictId] INT NOT NULL,
    CONSTRAINT [FK_SchoolDistrictsAccountAssistants_AccountAssistant] FOREIGN KEY ([AccountAssistantId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_SchoolDistrictsAccountAssistants_SchoolDistrict] FOREIGN KEY ([SchoolDistrictId]) REFERENCES [SchoolDistricts]([Id]),
    CONSTRAINT [PK_SchoolDistrictsAccountAssistants] PRIMARY KEY ([Id])
)
