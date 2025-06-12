CREATE TABLE [dbo].[SchoolDistrictAdmins]
(
    [DistrictAdminId] INT NOT NULL,
    [DistrictId] INT NOT NULL,
    CONSTRAINT [PK_SchoolDistrictAdmins] PRIMARY KEY ([DistrictAdminId], [DistrictId]),
    CONSTRAINT [FK_SchoolDistrictAdmins_Users_DistrictAdminId] FOREIGN KEY (DistrictAdminId) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_SchoolDistrictAdmins_SchoolDistricts_DistrictId] FOREIGN KEY (DistrictId) REFERENCES [dbo].[SchoolDistricts] ([Id])
);
