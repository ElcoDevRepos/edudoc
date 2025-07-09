CREATE TABLE [dbo].[ProgressReports]
(
	[Id] INT NOT NULL IDENTITY,
    [StudentId] INT NOT NULL,
    [StartDate] DATETIME NULL,
    [EndDate] DATETIME NULL,
    [Progress] BIT NULL,
    [ProgressNotes] VARCHAR(5000) NULL,
    [MedicalStatusChange] BIT NULL,
    [MedicalStatusChangeNotes] VARCHAR(5000) NULL,
    [TreatmentChange] BIT NULL,
    [TreatmentChangeNotes] VARCHAR(5000) NULL,
    [ESignedById] INT NULL,
    [SupervisorESignedById] INT NULL,
    [DateESigned] DATETIME NULL,
    [SupervisorDateESigned] DATETIME NULL,
    [Quarter] INT NULL, 
    [CreatedById] INT NOT NULL DEFAULT 1,
    [ModifiedById] INT NULL,
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(),
    [DateModified] DATETIME NULL,
    CONSTRAINT [FK_ProgressReports_Student] FOREIGN KEY ([StudentId]) REFERENCES [dbo].[Students]([Id]),
    CONSTRAINT [FK_ProgressReports_ESignedBy] FOREIGN KEY ([ESignedById]) REFERENCES [dbo].[Users]([Id]),
    CONSTRAINT [FK_ProgressReports_SupervisorESignedBy] FOREIGN KEY ([SupervisorESignedById]) REFERENCES [dbo].[Users]([Id]),
    CONSTRAINT [FK_ProgressReports_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_ProgressReports_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_ProgressReports] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ProgressReports_StudentId] 
ON [dbo].[ProgressReports] ([StudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProgressReports_ESignedById] 
ON [dbo].[ProgressReports] ([ESignedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProgressReports_SupervisorESignedById] 
ON [dbo].[ProgressReports] ([SupervisorESignedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProgressReports_CreatedById] 
ON [dbo].[ProgressReports] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ProgressReports_ModifiedById] 
ON [dbo].[ProgressReports] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
