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

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_SchoolDistrictsSchools_SchoolDistrictId] 
ON [dbo].[SchoolDistrictsSchools] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistrictsSchools_SchoolId] 
ON [dbo].[SchoolDistrictsSchools] ([SchoolId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistrictsSchools_CreatedById] 
ON [dbo].[SchoolDistrictsSchools] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistrictsSchools_ModifiedById] 
ON [dbo].[SchoolDistrictsSchools] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
