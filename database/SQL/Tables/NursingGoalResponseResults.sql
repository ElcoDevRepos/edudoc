CREATE TABLE [dbo].[NursingGoalResponseResults]
(
    [NursingGoalResponseId] INT NOT NULL,
    [NursingGoalResultId] INT NOT NULL,
    CONSTRAINT [PK_NursingGoalResponseResults] PRIMARY KEY ([NursingGoalResponseId], [NursingGoalResultId]), 
    CONSTRAINT [FK_NursingGoalResponseResults_NursingGoalResponse] FOREIGN KEY ([NursingGoalResponseId]) REFERENCES [NursingGoalResponse]([Id]),
    CONSTRAINT [FK_NursingGoalResponseResults_NursingGoalResults] FOREIGN KEY ([NursingGoalResultId]) REFERENCES [NursingGoalResults]([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_NursingGoalResponseResults_NursingGoalResponseId] 
ON [dbo].[NursingGoalResponseResults] ([NursingGoalResponseId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_NursingGoalResponseResults_NursingGoalResultId] 
ON [dbo].[NursingGoalResponseResults] ([NursingGoalResultId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
