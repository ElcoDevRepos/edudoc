CREATE TABLE [dbo].[NursingGoalResponse]
(
	[Id] INT NOT NULL IDENTITY,
    [Name] VARCHAR(250) NOT NULL,
    [ResponseNoteLabel] VARCHAR(250) NULL,
    [ResponseNote] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [PK_NursingGoalResponse] PRIMARY KEY ([Id]), 
)

GO 
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'NursingGoalResponse',
    @level2type = N'COLUMN',
    @level2name = N'Id'
