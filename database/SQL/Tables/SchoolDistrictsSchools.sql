CREATE TABLE [dbo].[SchoolDistrictsSchools]
(
    [Id] INT NOT NULL IDENTITY,
    [SchoolDistrictId] INT NOT NULL,
	[SchoolId] INT NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL, 
    [Archived] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [FK_SchoolDistrictsSchools_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_SchoolDistrictsSchools_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_SchoolDistrictsSchools_SchoolDistricts] FOREIGN KEY ([SchoolDistrictId]) REFERENCES SchoolDistricts(Id), 
    CONSTRAINT [FK_SchoolDistrictsSchools_Schools] FOREIGN KEY (SchoolId) REFERENCES [Schools]([Id]),
    CONSTRAINT [PK_SchoolDistrictsSchools] PRIMARY KEY ([Id]), 
)
GO
create nonclustered index [IX_SchoolDistrictsSchools_SchoolDistrictId] on dbo.SchoolDistrictsSchools(SchoolDistrictId);
GO
create nonclustered index [IX_SchoolDistrictsSchools_SchoolId] on dbo.SchoolDistrictsSchools(SchoolId);
