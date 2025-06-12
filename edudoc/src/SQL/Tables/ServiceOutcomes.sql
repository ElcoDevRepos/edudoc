CREATE TABLE [dbo].[ServiceOutcomes]
(
	[Id] INT NOT NULL IDENTITY,
    [Notes] VARCHAR(250) NOT NULL,
    [GoalId] INT NOT NULL,
    [CreatedById] INT NULL , 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL, 
    [Archived] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [PK_ServiceOutcomes] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ServiceOutcomes_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_ServiceOutcomes_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_ServiceOutcomes_Goal] FOREIGN KEY (GoalId) REFERENCES [dbo].[Goals] ([Id])
)
