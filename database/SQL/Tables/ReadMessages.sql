CREATE TABLE [dbo].[ReadMessages]
(
	[Id] INT NOT NULL IDENTITY,
    [MessageId] INT NOT NULL,
    [ReadById] INT NOT NULL,
    [DateRead] DATETIME NOT NULL DEFAULT GETUTCDATE(), 
    CONSTRAINT [PK_ReadMessages] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_ReadMessages_Message] FOREIGN KEY ([MessageId]) REFERENCES Messages(Id),
    CONSTRAINT [FK_ReadMessages_ReadBy] FOREIGN KEY ([ReadById]) REFERENCES Users(Id)

)
