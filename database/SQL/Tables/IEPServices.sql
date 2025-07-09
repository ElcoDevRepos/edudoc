CREATE TABLE [dbo].[IEPServices]
(
	[Id] INT IDENTITY NOT NULL,
    [StartDate] DATETIME NOT NULL,
    [EndDate] DATETIME NOT NULL,
    [ETRExpirationDate] DATETIME NOT NULL,
    [OTPTotalMinutes] INT NULL DEFAULT 0, 
    [PTTotalMinutes] INT NULL DEFAULT 0, 
    [STPTotalMinutes] INT NULL DEFAULT 0, 
    [AUDTotalMinutes] INT NULL DEFAULT 0, 
    [NursingTotalMinutes] INT NULL DEFAULT 0, 
    [CCTotalMinutes] INT NULL DEFAULT 0, 
    [SOCTotalMinutes] INT NULL DEFAULT 0, 
    [PSYTotalMinutes] INT NULL DEFAULT 0,
    [OTPDate] DATETIME NULL,
    [PTDate] DATETIME NULL, 
    [STPDate] DATETIME NULL, 
    [AUDDate] DATETIME NULL, 
    [NursingDate] DATETIME NULL,
    [CCDate] DATETIME NULL, 
    [SOCDate] DATETIME NULL, 
    [PSYDate] DATETIME NULL,
    [StudentId] INT NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL
    CONSTRAINT [PK_IEPServices] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_IEPServices_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users](Id),
    CONSTRAINT [FK_IEPServices_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users](Id),
    CONSTRAINT [FK_IEPServices_Student] FOREIGN KEY ([StudentId]) REFERENCES [dbo].[Students](Id),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_IEPServices_CreatedById] 
ON [dbo].[IEPServices] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_IEPServices_ModifiedById] 
ON [dbo].[IEPServices] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_IEPServices_StudentId] 
ON [dbo].[IEPServices] ([StudentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'IEPServices',
    @level2type = N'COLUMN',
    @level2name = N'Id'
