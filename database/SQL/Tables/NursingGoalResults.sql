CREATE TABLE [dbo].[NursingGoalResults]
(
	[Id] INT NOT NULL IDENTITY,
    [Name] VARCHAR(250) NOT NULL,
    [ResultsNote] BIT NOT NULL DEFAULT 0,
    [Archived] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [PK_NursingGoalResults] PRIMARY KEY ([Id]),
)
