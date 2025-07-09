CREATE TABLE [dbo].[CPTCodes] 
(
	[Id] INT NOT NULL  IDENTITY, 
    [Code] VARCHAR(50) NOT NULL, 
    [Description] VARCHAR(500) NOT NULL, 
    [BillAmount] DECIMAL(18,2) NOT NULL, 
    [ServiceUnitRuleId] INT NULL, 
    [RNDefault]  BIT NOT NULL DEFAULT 0,
    [LPNDefault]  BIT NOT NULL DEFAULT 0,
    [Notes] VARCHAR(250) NULL, 
    [Archived]  BIT NOT NULL   DEFAULT 0,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    CONSTRAINT [FK_CPTCodes_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CPTCodes_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_CPTCodes_ServiceUnitRule] FOREIGN KEY (ServiceUnitRuleId) REFERENCES [dbo].[ServiceUnitRules] ([Id]),
    CONSTRAINT [PK_CPTCodes] PRIMARY KEY ([Id]) 
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_CPTCodes_CreatedById] 
ON [dbo].[CPTCodes] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CPTCodes_ModifiedById] 
ON [dbo].[CPTCodes] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_CPTCodes_ServiceUnitRuleId] 
ON [dbo].[CPTCodes] ([ServiceUnitRuleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

