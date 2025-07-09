CREATE TABLE [dbo].[EncounterStudentStatuses]
(
	[Id] INT NOT NULL IDENTITY,
    [EncounterStudentId] INT NOT NULL,
    [EncounterStatusId] INT NOT NULL DEFAULT 1,
    [CreatedById] INT NOT NULL DEFAULT 1,
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
    CONSTRAINT [PK_EncounterStudentStatuses] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_EncounterStudentStatuses_EncounterStudent] FOREIGN KEY ([EncounterStudentId]) REFERENCES [dbo].[EncounterStudents] ([Id]),
    CONSTRAINT [FK_EncounterStudentStatuses_EncounterStatus] FOREIGN KEY (EncounterStatusId) REFERENCES [dbo].[EncounterStatuses] ([Id]),
	CONSTRAINT [FK_EncounterStudentStatuses_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_EncounterStudentStatuses_EncounterStudentId] 
ON [dbo].[EncounterStudentStatuses] ([EncounterStudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudentStatuses_EncounterStatusId] 
ON [dbo].[EncounterStudentStatuses] ([EncounterStatusId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_EncounterStudentStatuses_CreatedById] 
ON [dbo].[EncounterStudentStatuses] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Primary filtering index - covers most common query patterns
CREATE NONCLUSTERED INDEX [IX_EncounterStudentStatuses_EncounterStudentId_StatusId] 
ON [dbo].[EncounterStudentStatuses] ([EncounterStudentId], [EncounterStatusId])
INCLUDE ([DateCreated], [CreatedById])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Status-based filtering
CREATE NONCLUSTERED INDEX [IX_EncounterStudentStatuses_StatusId_DateCreated] 
ON [dbo].[EncounterStudentStatuses] ([EncounterStatusId], [DateCreated])
WITH (FILLFACTOR = 85, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

