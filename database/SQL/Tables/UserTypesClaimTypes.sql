CREATE TABLE [dbo].[UserTypesClaimTypes]
(
	[ClaimTypeId] INT NOT NULL ,
    [UserTypeId] INT NOT NULL,
    CONSTRAINT [FK_UserTypesClaimTypes_UserType] FOREIGN KEY (UserTypeId) REFERENCES [dbo].[UserTypes] ([Id]), 
    CONSTRAINT [FK_UserTypesClaimTypes_ClaimType] FOREIGN KEY (ClaimTypeId) REFERENCES [dbo].[ClaimTypes] ([Id]), 
    CONSTRAINT [PK_UserTypesClaimTypes] PRIMARY KEY(ClaimTypeId, UserTypeId)
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_UserTypesClaimTypes_ClaimTypeId] 
ON [dbo].[UserTypesClaimTypes] ([ClaimTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_UserTypesClaimTypes_UserTypeId] 
ON [dbo].[UserTypesClaimTypes] ([UserTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
