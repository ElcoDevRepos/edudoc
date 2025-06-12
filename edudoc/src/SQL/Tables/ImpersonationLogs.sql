CREATE TABLE [dbo].[ImpersonationLogs]
(
	[Id] INT NOT NULL IDENTITY,
    [AuthTokenId] INT NOT NULL,
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [ImpersonaterId] INT NOT NULL,
    CONSTRAINT [FK_ImpersonationLogs_User] FOREIGN KEY (ImpersonaterId) REFERENCES dbo.Users ([Id]), 
    CONSTRAINT [PK_ImpersonationLogs] PRIMARY KEY (Id)
)
