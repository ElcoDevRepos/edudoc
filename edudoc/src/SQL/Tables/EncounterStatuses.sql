CREATE TABLE [dbo].[EncounterStatuses]
(
	[Id] INT NOT NULL IDENTITY, 
    [Name] VARCHAR(50) NOT NULL,
    [IsAuditable] BIT NOT NULL DEFAULT 1,
    [IsBillable] BIT NOT NULL DEFAULT 1,
    [ForReview] BIT NOT NULL DEFAULT 1,
    [HPCAdminOnly] BIT NOT NULL DEFAULT 1,
    CONSTRAINT [PK_EncounterStatusess] PRIMARY KEY ([Id])
)
