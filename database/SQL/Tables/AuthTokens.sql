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





