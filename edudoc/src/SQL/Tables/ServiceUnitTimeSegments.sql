CREATE TABLE [dbo].[ServiceUnitTimeSegments]
(
	[Id] INT NOT NULL  IDENTITY,
    [UnitDefinition] INT NOT NULL,
    [StartMinutes] INT NOT NULL, 
    [EndMinutes] INT NULL,
    [IsCrossover] BIT NOT NULL DEFAULT 0,
    [ServiceUnitRuleId] INT NULL,
    [CreatedById] INT NULL , 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL, 
    [Archived] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [FK_ServiceUnitTimeSegments_ServiceUnitRule] FOREIGN KEY (ServiceUnitRuleId) REFERENCES [dbo].[ServiceUnitRules] ([Id]),
    CONSTRAINT [FK_ServiceUnitTimeSegments_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_ServiceUnitTimeSegments_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]), 
    CONSTRAINT [PK_ServiceUnitTimeSegments] PRIMARY KEY ([Id]),
)
