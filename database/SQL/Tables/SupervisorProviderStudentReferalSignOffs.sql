CREATE TABLE [dbo].[SupervisorProviderStudentReferalSignOffs]
(
	[Id] INT NOT NULL IDENTITY,
    [SupervisorId] INT NOT NULL ,
    [StudentId] INT NOT NULL ,
    [SignOffText] VARCHAR(1000) NULL, 
    [SignOffDate] DATETIME NULL, 
    [SignedOffById] INT NULL,
    [ServiceCodeId] INT NULL,
    [EffectiveDateFrom] DATETIME NULL, 
    [EffectiveDateTo] DATETIME NULL,
    [CreatedById] INT NOT NULL, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [FK_SupervisorProviderStudentReferalSignOff_SignedOffBy] FOREIGN KEY ([SignedOffById]) REFERENCES [dbo].[Users]([Id]),
    CONSTRAINT [FK_SupervisorProviderStudentReferalSignOff_Supervisor] FOREIGN KEY ([SupervisorId]) REFERENCES [dbo].[Providers]([Id]),
    CONSTRAINT [FK_SupervisorProviderStudentReferalSignOff_Student] FOREIGN KEY ([StudentId]) REFERENCES [dbo].[Students]([Id]),
    CONSTRAINT [FK_SupervisorProviderStudentReferalSignOff_ServiceCode] FOREIGN KEY ([ServiceCodeId]) REFERENCES [dbo].[ServiceCodes]([Id]),
    CONSTRAINT [FK_SupervisorProviderStudentReferalSignOff_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_SupervisorProviderStudentReferalSignOff_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_SupervisorProviderStudentReferalSignOff] PRIMARY KEY ([Id])
)
Go
EXEC sp_addextendedproperty
@name = N'MS_Description',
@value = N'Module',
@level0type = N'SCHEMA',
@level0name = N'dbo',
@level1type = N'TABLE',
@level1name = N'SupervisorProviderStudentReferalSignOffs',
@level2type = N'COLUMN',
@level2name = N'Id'

GO
CREATE NONCLUSTERED INDEX IX_SupervisorProviderStudentReferalSignOffs_1 ON [dbo].[SupervisorProviderStudentReferalSignOffs] ([StudentId], [SignOffDate]);
GO
CREATE NONCLUSTERED INDEX IX_SupervisorProviderStudentReferalSignOffs_2 ON [dbo].[SupervisorProviderStudentReferalSignOffs] ([StudentId]) INCLUDE ([SupervisorId], [SignOffText], [SignOffDate], [SignedOffById], [ServiceCodeId], [EffectiveDateFrom], [EffectiveDateTo], [CreatedById], [ModifiedById], [DateCreated], [DateModified]);
GO
CREATE NONCLUSTERED INDEX [IX_SupervisorProviderStudentReferalSignOffs_StudentId_ServiceCodeId] ON [dbo].[SupervisorProviderStudentReferalSignOffs] ([StudentId], [ServiceCodeId]) INCLUDE ([SignOffDate]);

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_SupervisorProviderStudentReferalSignOffs_SignedOffById] 
ON [dbo].[SupervisorProviderStudentReferalSignOffs] ([SignedOffById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SupervisorProviderStudentReferalSignOffs_SupervisorId] 
ON [dbo].[SupervisorProviderStudentReferalSignOffs] ([SupervisorId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SupervisorProviderStudentReferalSignOffs_StudentId] 
ON [dbo].[SupervisorProviderStudentReferalSignOffs] ([StudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SupervisorProviderStudentReferalSignOffs_ServiceCodeId] 
ON [dbo].[SupervisorProviderStudentReferalSignOffs] ([ServiceCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SupervisorProviderStudentReferalSignOffs_CreatedById] 
ON [dbo].[SupervisorProviderStudentReferalSignOffs] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SupervisorProviderStudentReferalSignOffs_ModifiedById] 
ON [dbo].[SupervisorProviderStudentReferalSignOffs] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Referral date range filtering (common in EF)
CREATE NONCLUSTERED INDEX [IX_SupervisorProviderStudentReferalSignOffs_EffectiveDateFrom_EffectiveDateTo] 
ON [dbo].[SupervisorProviderStudentReferalSignOffs] ([EffectiveDateFrom], [EffectiveDateTo])
INCLUDE ([StudentId], [ServiceCodeId], [SupervisorId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Service code referral tracking
CREATE NONCLUSTERED INDEX [IX_SupervisorProviderStudentReferalSignOffs_ServiceCodeId_StudentId_EffectiveDateFrom] 
ON [dbo].[SupervisorProviderStudentReferalSignOffs] ([ServiceCodeId], [StudentId], [EffectiveDateFrom])
INCLUDE ([EffectiveDateTo], [SupervisorId])
WITH (FILLFACTOR = 90, ONLINE = ON, DATA_COMPRESSION = ROW);
