CREATE TABLE [dbo].[EdiErrorCodeAdminNotifications]
(
	[Id] INT NOT NULL IDENTITY, 
	[AdminId] INT NOT NULL,
    [Archived] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [FK_EdiErrorCodeAdminNotifications_User] FOREIGN KEY ([AdminId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_EdiErrorCodeAdminNotfications] PRIMARY KEY ([Id]),
)
