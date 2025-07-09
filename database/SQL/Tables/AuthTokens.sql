CREATE TABLE [dbo].[AuthTokens] (
    [Id]              INT             IDENTITY (1, 1) NOT NULL,
    [IdentifierKey]      VARBINARY (64) NOT NULL,
    [Salt]            VARBINARY (64) NOT NULL,
    [AuthUserId]      INT             NOT NULL,
    [AuthClientId]    INT             NOT NULL,
    [IssuedUtc]       DATETIME        NOT NULL,
    [ExpiresUtc]      DATETIME        NOT NULL,
    [Token] VARCHAR (MAX)   NOT NULL,
    CONSTRAINT [PK_RefreshTokens] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AuthTokens_AuthClients] FOREIGN KEY ([AuthClientId]) REFERENCES [dbo].[AuthClients] ([Id]), 
    CONSTRAINT [FK_AuthTokens_AuthUsers] FOREIGN KEY ([AuthUserId]) REFERENCES [dbo].[AuthUsers] ([Id])
);

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_AuthTokens_AuthClientId] 
ON [dbo].[AuthTokens] ([AuthClientId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_AuthTokens_AuthUserId] 
ON [dbo].[AuthTokens] ([AuthUserId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO





