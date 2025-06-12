CREATE TABLE [dbo].[AuditLogRelationships]
(
	[Id] BIGINT NOT NULL IDENTITY, 
    [AuditLogId] BIGINT NOT NULL, 
    [TypeFullName] NVARCHAR(512) NOT NULL, 
    [KeyName] NVARCHAR(512) NULL, 
    [KeyValue] NVARCHAR(512) NOT NULL, 
    CONSTRAINT [PK_AuditLogRelationships] PRIMARY KEY ([Id]), 
    CONSTRAINT [FK_AuditLogRelationships_AuditLogs] FOREIGN KEY ([AuditLogId]) REFERENCES [dbo].[AuditLogs] ([AuditLogId]) ON DELETE CASCADE
)

GO

-- Please Note this index could fail with KeyValue and TypeFullName combined length is over 1700 bytes (so AuditLogId = 8 bytes, TypeFullName = 2xlength, KeyValue 2xlength)
CREATE INDEX [IX_AuditLogRelationships_Search] ON [dbo].[AuditLogRelationships] ([AuditLogId] ASC,[TypeFullName] ASC,[KeyValue] ASC)
