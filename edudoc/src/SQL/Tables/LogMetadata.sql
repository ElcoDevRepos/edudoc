CREATE TABLE [dbo].[LogMetadata]
(
	[Id] BIGINT NOT NULL IDENTITY, 
    [AuditLogId] BIGINT NOT NULL, 
    [Key] NVARCHAR(MAX) NULL, 
    [Value] NVARCHAR(MAX) NULL, 
    CONSTRAINT [PK_LogMetadata] PRIMARY KEY ([Id]) 
)
