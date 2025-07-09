CREATE TABLE [dbo].[EncounterIdentifiers]
(
	[Id] INT NOT NULL ,
    [Counter]  INT NOT NULL,
    [DateCreated] DATE NOT NULL DEFAULT GETUTCDate(), -- Please use UTC Date Comparision
    [SchoolDistrictId] INT NOT NULL,
    CONSTRAINT [PK_EncounterIdentifiers] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EncounterIdentifiers_SchoolDistricts] FOREIGN KEY ([SchoolDistrictId]) REFERENCES [SchoolDistricts]([Id]),

)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_EncounterIdentifiers_SchoolDistrictId] 
ON [dbo].[EncounterIdentifiers] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

