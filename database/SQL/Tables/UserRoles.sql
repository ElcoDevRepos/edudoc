CREATE TABLE [dbo].[UserRoles]
(
	[Id] INT NOT NULL  IDENTITY, 
    [Name] VARCHAR(50) NOT NULL, 
    [Description] VARCHAR(500) NOT NULL DEFAULT '', 
    [IsEditable] BIT NOT NULL DEFAULT 1, 
    [UserTypeId] INT NOT NULL DEFAULT 1,
    [CreatedById] INT NULL , 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL, 
    [Archived] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [FK_UserRoles_UserType] FOREIGN KEY (UserTypeId) REFERENCES [dbo].[UserTypes] ([Id]),
    CONSTRAINT [FK_UserRoles_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_UserRoles_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]), 
    CONSTRAINT [PK_UserRoles] PRIMARY KEY ([Id])
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_UserRoles_UserTypeId] 
ON [dbo].[UserRoles] ([UserTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_UserRoles_CreatedById] 
ON [dbo].[UserRoles] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_UserRoles_ModifiedById] 
ON [dbo].[UserRoles] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
