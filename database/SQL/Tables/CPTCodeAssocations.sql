CREATE TABLE [dbo].[CPTCodeAssocations] 
(
	[Id] INT NOT NULL  IDENTITY, 
    [CPTCodeId] INT NOT NULL,
    [ServiceCodeId] INT NOT NULL,
    [ServiceTypeId] INT NOT NULL,
    [ProviderTitleId] INT NOT NULL,
    [EvaluationTypeId] INT NULL,
    [IsGroup]  BIT NOT NULL   DEFAULT 0,
    [Default]  BIT NOT NULL   DEFAULT 0,
    [IsTelehealth]  BIT NOT NULL   DEFAULT 0,
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [FK_CPTCodeAssocations_CPTCodes] FOREIGN KEY ([CPTCodeId]) REFERENCES [dbo].[CPTCodes] ([Id]),
    CONSTRAINT [FK_CPTCodeAssocations_ServiceCodes] FOREIGN KEY ([ServiceCodeId]) REFERENCES [dbo].[ServiceCodes] ([Id]),
    CONSTRAINT [FK_CPTCodeAssocations_ServiceTypes] FOREIGN KEY ([ServiceTypeId]) REFERENCES [dbo].[ServiceTypes] ([Id]),
    CONSTRAINT [FK_CPTCodeAssocations_ProviderTitles] FOREIGN KEY (ProviderTitleId) REFERENCES [dbo].[ProviderTitles] ([Id]),
    CONSTRAINT [FK_CPTCodeAssocations_EvaluationTypes] FOREIGN KEY (EvaluationTypeId) REFERENCES [dbo].[EvaluationTypes] ([Id]),
    CONSTRAINT [FK_CPTCodeAssocations_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CPTCodeAssocations_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_CPTCodeAssocations] PRIMARY KEY ([Id]) 
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_CPTCodeAssocations_CPTCodeId] 
ON [dbo].[CPTCodeAssocations] ([CPTCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CPTCodeAssocations_ServiceCodeId] 
ON [dbo].[CPTCodeAssocations] ([ServiceCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CPTCodeAssocations_ServiceTypeId] 
ON [dbo].[CPTCodeAssocations] ([ServiceTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CPTCodeAssocations_ProviderTitleId] 
ON [dbo].[CPTCodeAssocations] ([ProviderTitleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CPTCodeAssocations_EvaluationTypeId] 
ON [dbo].[CPTCodeAssocations] ([EvaluationTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CPTCodeAssocations_CreatedById] 
ON [dbo].[CPTCodeAssocations] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CPTCodeAssocations_ModifiedById] 
ON [dbo].[CPTCodeAssocations] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

