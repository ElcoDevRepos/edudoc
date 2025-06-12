CREATE TABLE [dbo].[AuthClients] (
    [Id]                    INT             IDENTITY (1, 1) NOT NULL,
    [Name]                  VARCHAR (200)   NOT NULL,
    [Secret]                VARBINARY (MAX) NOT NULL,
    [Salt]                  VARBINARY (MAX) NOT NULL,
    [Description]           VARCHAR (200)   NULL,
    [AuthApplicationTypeId] INT             NOT NULL,
    [RefreshTokenMinutes]   INT             NOT NULL,
    [AllowedOrigin]         VARCHAR (500)   NOT NULL,
    CONSTRAINT [PK_AuthClients] PRIMARY KEY CLUSTERED ([Id] ASC),
    CONSTRAINT [FK_AuthClients_AuthApplicationTypes] FOREIGN KEY ([AuthApplicationTypeId]) REFERENCES [dbo].[AuthApplicationTypes] ([Id])
);



