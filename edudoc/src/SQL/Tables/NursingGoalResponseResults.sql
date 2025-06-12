CREATE TABLE [dbo].[NursingGoalResponseResults]
(
    [NursingGoalResponseId] INT NOT NULL,
    [NursingGoalResultId] INT NOT NULL,
    CONSTRAINT [PK_NursingGoalResponseResults] PRIMARY KEY ([NursingGoalResponseId], [NursingGoalResultId]), 
    CONSTRAINT [FK_NursingGoalResponseResults_NursingGoalResponse] FOREIGN KEY ([NursingGoalResponseId]) REFERENCES [NursingGoalResponse]([Id]),
    CONSTRAINT [FK_NursingGoalResponseResults_NursingGoalResults] FOREIGN KEY ([NursingGoalResultId]) REFERENCES [NursingGoalResults]([Id]),
)
