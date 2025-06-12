CREATE TABLE [dbo].[UserTypesClaimTypes]
(
	[ClaimTypeId] INT NOT NULL ,
    [UserTypeId] INT NOT NULL,
    CONSTRAINT [FK_UserTypesClaimTypes_UserType] FOREIGN KEY (UserTypeId) REFERENCES [dbo].[UserTypes] ([Id]), 
    CONSTRAINT [FK_UserTypesClaimTypes_ClaimType] FOREIGN KEY (ClaimTypeId) REFERENCES [dbo].[ClaimTypes] ([Id]), 
    CONSTRAINT [PK_UserTypesClaimTypes] PRIMARY KEY(ClaimTypeId, UserTypeId)
)
