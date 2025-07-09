CREATE TABLE [dbo].[AdminSchoolDistricts]
(
    [Id] INT NOT NULL IDENTITY,
    [AdminId] INT NOT NULL, 
    [SchoolDistrictId] INT NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL, 
    [Archived] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [FK_AdminSchoolDistrict_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_AdminSchoolDistrict_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_AdminSchoolDistrict_Admin] FOREIGN KEY ([AdminId]) REFERENCES Users(Id), 
    CONSTRAINT [FK_AdminSchoolDistrict_SchoolDistrict] FOREIGN KEY (SchoolDistrictId) REFERENCES [SchoolDistricts]([Id]),
    CONSTRAINT [PK_AdminSchoolDistrict] PRIMARY KEY ([Id]), 
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_AdminSchoolDistricts_AdminId] 
ON [dbo].[AdminSchoolDistricts] ([AdminId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_AdminSchoolDistricts_SchoolDistrictId] 
ON [dbo].[AdminSchoolDistricts] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_AdminSchoolDistricts_CreatedById] 
ON [dbo].[AdminSchoolDistricts] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_AdminSchoolDistricts_ModifiedById] 
ON [dbo].[AdminSchoolDistricts] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

