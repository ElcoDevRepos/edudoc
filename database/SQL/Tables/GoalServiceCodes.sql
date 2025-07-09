CREATE TABLE [dbo].[GoalServiceCodes]
(
	[GoalId] INT NOT NULL,
    [ServiceCodeId] INT NOT NULL,
    CONSTRAINT [PK_GoalServiceCodes] PRIMARY KEY ([GoalId], [ServiceCodeId]),
    CONSTRAINT [FK_GoalServiceCodeGoals] FOREIGN KEY ([GoalId]) REFERENCES [dbo].[Goals]([Id]),
    CONSTRAINT [FK_GoalServiceCodeServiceCodes] FOREIGN KEY ([ServiceCodeId]) REFERENCES [dbo].[ServiceCodes]([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_GoalServiceCodes_GoalId] 
ON [dbo].[GoalServiceCodes] ([GoalId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_GoalServiceCodes_ServiceCodeId] 
ON [dbo].[GoalServiceCodes] ([ServiceCodeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO