CREATE TABLE [dbo].[UserDocuments]
(
	[UserId] INT NOT NULL , 
    [DocumentId] INT NOT NULL, 
    CONSTRAINT [FK_UserDocuments_Users] FOREIGN KEY (UserId) REFERENCES Users(Id), 
    CONSTRAINT [FK_UserDocuments_Documents] FOREIGN KEY (DocumentId) REFERENCES [Documents]([Id]), 
    CONSTRAINT [PK_UserDocuments] PRIMARY KEY ([UserId], [DocumentId]) 
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_UserDocuments_UserId] 
ON [dbo].[UserDocuments] ([UserId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_UserDocuments_DocumentId] 
ON [dbo].[UserDocuments] ([DocumentId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
