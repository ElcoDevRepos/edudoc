CREATE TABLE [dbo].[EdiErrorCodeAdminNotifications]
(
	[Id] INT NOT NULL IDENTITY, 
	[AdminId] INT NOT NULL,
    [Archived] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [FK_EdiErrorCodeAdminNotifications_User] FOREIGN KEY ([AdminId]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_EdiErrorCodeAdminNotfications] PRIMARY KEY ([Id]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_EdiErrorCodeAdminNotifications_AdminId] 
ON [dbo].[EdiErrorCodeAdminNotifications] ([AdminId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
