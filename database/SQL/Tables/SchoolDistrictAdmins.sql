CREATE TABLE [dbo].[SchoolDistrictAdmins]
(
    [DistrictAdminId] INT NOT NULL,
    [DistrictId] INT NOT NULL,
    CONSTRAINT [PK_SchoolDistrictAdmins] PRIMARY KEY ([DistrictAdminId], [DistrictId]),
    CONSTRAINT [FK_SchoolDistrictAdmins_Users_DistrictAdminId] FOREIGN KEY (DistrictAdminId) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_SchoolDistrictAdmins_SchoolDistricts_DistrictId] FOREIGN KEY (DistrictId) REFERENCES [dbo].[SchoolDistricts] ([Id])
);

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_SchoolDistrictAdmins_DistrictAdminId] 
ON [dbo].[SchoolDistrictAdmins] ([DistrictAdminId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistrictAdmins_DistrictId] 
ON [dbo].[SchoolDistrictAdmins] ([DistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
