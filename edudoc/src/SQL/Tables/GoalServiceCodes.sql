CREATE TABLE [dbo].[GoalServiceCodes]
(
	[GoalId] INT NOT NULL,
    [ServiceCodeId] INT NOT NULL,
    CONSTRAINT [PK_GoalServiceCodes] PRIMARY KEY ([GoalId], [ServiceCodeId]),
    CONSTRAINT [FK_GoalServiceCodeGoals] FOREIGN KEY ([GoalId]) REFERENCES [dbo].[Goals]([Id]),
    CONSTRAINT [FK_GoalServiceCodeServiceCodes] FOREIGN KEY ([ServiceCodeId]) REFERENCES [dbo].[ServiceCodes]([Id]),
)
