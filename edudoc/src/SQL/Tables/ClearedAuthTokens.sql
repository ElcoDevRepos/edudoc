CREATE TABLE [dbo].[ClearedAuthTokens] (
    [Id]              INT             IDENTITY (1, 1) NOT NULL,
    [IdentifierKey]      VARBINARY (64) NOT NULL,
    [Salt]            VARBINARY (64) NOT NULL,
    [AuthUserId]      INT             NOT NULL,
    [AuthClientId]    INT             NOT NULL,
    [IssuedUtc]       DATETIME        NOT NULL,
    [ExpiresUtc]      DATETIME        NOT NULL,
    [Token] VARCHAR (MAX)             NOT NULL,
    [ClearedDate] Datetime            NOT NULL DEFAULT GetDate()
    CONSTRAINT [PK_ClearedAuthTokens] PRIMARY KEY CLUSTERED ([Id] ASC) 
);





