CREATE TABLE [dbo].[ConsoleJobLogs]
(
	[Id] INT NOT NULL IDENTITY,
    [Date] DATETIME NOT NULL DEFAULT GETDATE(),
    [IsError] BIT NOT NULL DEFAULT 0,
    [StackTrace] VARCHAR(MAX) NULL,
    [ErrorMessage] VARCHAR(MAX) NULL,
    [ConsoleJobTypeId] INT NOT NULL,
    [RelatedEntityId] INT NULL,
    CONSTRAINT [PK_ConsoleJobLogs] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ConsoleJobLogs_ConsoleJobTypes] FOREIGN KEY ([ConsoleJobTypeId]) REFERENCES [ConsoleJobTypes](Id),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ConsoleJobLogs_ConsoleJobTypeId] 
ON [dbo].[ConsoleJobLogs] ([ConsoleJobTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
