CREATE TABLE [dbo].[UserDocuments]
(
	[UserId] INT NOT NULL , 
    [DocumentId] INT NOT NULL, 
    CONSTRAINT [FK_UserDocuments_Users] FOREIGN KEY (UserId) REFERENCES Users(Id), 
    CONSTRAINT [FK_UserDocuments_Documents] FOREIGN KEY (DocumentId) REFERENCES [Documents]([Id]), 
    CONSTRAINT [PK_UserDocuments] PRIMARY KEY ([UserId], [DocumentId]) 
)
