CREATE TABLE [dbo].[EscSchoolDistricts]
(
    [Id] INT NOT NULL IDENTITY,
    [EscId] INT NOT NULL, 
    [SchoolDistrictId] INT NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL, 
    [Archived] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [FK_EscSchoolDistricts_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_EscSchoolDistricts_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_EscSchoolDistrict_Esc] FOREIGN KEY ([EscId]) REFERENCES Escs(Id), 
    CONSTRAINT [FK_EscSchoolDistrict_SchoolDistrict] FOREIGN KEY (SchoolDistrictId) REFERENCES [SchoolDistricts]([Id]),
    CONSTRAINT [PK_EscSchoolDistrict] PRIMARY KEY ([Id]), 
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_EscSchoolDistricts_CreatedById] 
ON [dbo].[EscSchoolDistricts] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EscSchoolDistricts_ModifiedById] 
ON [dbo].[EscSchoolDistricts] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EscSchoolDistricts_EscId] 
ON [dbo].[EscSchoolDistricts] ([EscId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EscSchoolDistricts_SchoolDistrictId] 
ON [dbo].[EscSchoolDistricts] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
