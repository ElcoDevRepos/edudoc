CREATE TABLE [dbo].[DiagnosisCodeAssociations]
(
	[Id] INT NOT NULL IDENTITY,
    [DiagnosisCodeId] INT NOT NULL,
    [ServiceCodeId] INT NOT NULL,
    [ServiceTypeId] INT NOT NULL,
    [Archived] BIT NOT NULL DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [FK_DiagnosisCodeAssociations_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_DiagnosisCodeAssociations_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_DiagnosisCodeAssociations_DiagnosisCodes] FOREIGN KEY (DiagnosisCodeId) REFERENCES [dbo].[DiagnosisCodes] ([Id]),
    CONSTRAINT [FK_DiagnosisCodeAssociations_ServiceCodes] FOREIGN KEY (ServiceCodeId) REFERENCES [dbo].[ServiceCodes] ([Id]),
    CONSTRAINT [FK_DiagnosisCodeAssociations_ServiceTypes] FOREIGN KEY ([ServiceTypeId]) REFERENCES [dbo].[ServiceTypes] ([Id]),
    CONSTRAINT [PK_DiagnosisCodeAssociations] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_DiagnosisCodeAssociations_DiagnosisCodeId] 
ON [dbo].[DiagnosisCodeAssociations] ([DiagnosisCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_DiagnosisCodeAssociations_ServiceCodeId] 
ON [dbo].[DiagnosisCodeAssociations] ([ServiceCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_DiagnosisCodeAssociations_ServiceTypeId] 
ON [dbo].[DiagnosisCodeAssociations] ([ServiceTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_DiagnosisCodeAssociations_CreatedById] 
ON [dbo].[DiagnosisCodeAssociations] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_DiagnosisCodeAssociations_ModifiedById] 
ON [dbo].[DiagnosisCodeAssociations] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

