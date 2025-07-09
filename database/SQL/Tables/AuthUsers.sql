CREATE TABLE [dbo].[AuthUsers] (
    [Id]       INT            IDENTITY (1, 1) NOT NULL,
    [Username] VARCHAR (50)   NOT NULL,
    [Password] VARBINARY (64) NOT NULL,
    [Salt]     VARBINARY (64) NOT NULL,
    [ResetKey] VARBINARY(64) NOT NULL DEFAULT 0x00, 
    [ResetKeyExpirationUtc] DATETIME NOT NULL DEFAULT (GETUTCDATE()), 
    [RoleId] INT NOT NULL, 
    [HasAccess] BIT NOT NULL DEFAULT 1, 
    [IsEditable] BIT NOT NULL DEFAULT 1, 
    [HasLoggedIn] BIT NOT NULL DEFAULT 0, 
    CONSTRAINT [FK_AuthUsers_UserRoles] FOREIGN KEY ([RoleId]) REFERENCES UserRoles(Id), 
    CONSTRAINT [PK_AuthUsers] PRIMARY KEY ([Id])
);

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_AuthUsers_RoleId] 
ON [dbo].[AuthUsers] ([RoleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Access control filtering (very common in EF)
CREATE NONCLUSTERED INDEX [IX_AuthUsers_HasAccess_IsEditable_RoleId] 
ON [dbo].[AuthUsers] ([HasAccess], [IsEditable], [RoleId])
INCLUDE ([Username])
WITH (FILLFACTOR = 95, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

-- Role-based queries
CREATE NONCLUSTERED INDEX [IX_AuthUsers_RoleId_HasAccess_IsEditable] 
ON [dbo].[AuthUsers] ([RoleId], [HasAccess], [IsEditable])
WITH (FILLFACTOR = 95, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
EXECUTE sp_addextendedproperty @name = N'MS_Description', @value = N'Username can be email or other.', @level0type = N'SCHEMA', @level0name = N'dbo', @level1type = N'TABLE', @level1name = N'AuthUsers', @level2type = N'COLUMN', @level2name = N'Username';


GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'FK:UserRole',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'AuthUsers',
    @level2type = N'COLUMN',
    @level2name = N'RoleId'
