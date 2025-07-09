CREATE TABLE [dbo].[ClaimsDistricts]
(
	[Id] INT NOT NULL  IDENTITY, 
    [IdentificationCode] VARCHAR(80) CONSTRAINT [CK_ClaimsDistricts_IdentificationCode] CHECK (LEN([IdentificationCode]) >= 2) NOT NULL,
    [DistrictOrganizationName] VARCHAR(60) NOT NULL,
    [Address] VARCHAR(55) NOT NULL,
    [City] VARCHAR(30) CONSTRAINT [CK_ClaimsDistricts_City] CHECK (LEN([City]) >= 2) NOT NULL,
    [State] VARCHAR(2) CONSTRAINT [CK_ClaimsDistricts_State] CHECK (LEN([State]) >= 2) NOT NULL,
    [PostalCode] VARCHAR(15) CONSTRAINT [CK_ClaimsDistricts_PostalCode] CHECK (LEN([PostalCode]) >= 3) NOT NULL,
    [EmployerId] VARCHAR(50) NOT NULL,
    [Index] INT CONSTRAINT [Ck_ClaimsDistricts_Index] CHECK ([Index] BETWEEN 1 and 999999999999) NULL,
    [HealthCareClaimsId] INT NOT NULL,
    [SchoolDistrictId] INT NOT NULL,
    CONSTRAINT [FK_ClaimsDistricts_HealthCareClaims] FOREIGN KEY ([HealthCareClaimsId]) REFERENCES HealthCareClaims(Id),
    CONSTRAINT [FK_ClaimsDistricts_SchoolDistrict] FOREIGN KEY ([SchoolDistrictId]) REFERENCES SchoolDistricts(Id),
    CONSTRAINT [PK_ClaimsDistricts] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ClaimsDistricts_HealthCareClaimsId] 
ON [dbo].[ClaimsDistricts] ([HealthCareClaimsId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ClaimsDistricts_SchoolDistrictId] 
ON [dbo].[ClaimsDistricts] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
