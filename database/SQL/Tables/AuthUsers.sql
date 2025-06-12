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
