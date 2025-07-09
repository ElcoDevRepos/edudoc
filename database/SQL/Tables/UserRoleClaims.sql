CREATE TABLE [dbo].[UserRoleClaims]
(
	[RoleId] INT NOT NULL , 
	[ClaimTypeId] INT NOT NULL, 
    [ClaimValueId] INT NOT NULL, 
    CONSTRAINT [FK_UserRoleClaims_UserRoles] FOREIGN KEY ([RoleId]) REFERENCES UserRoles(Id), 
    CONSTRAINT [PK_UserRoleClaims] PRIMARY KEY ([RoleId], [ClaimValueId], [ClaimTypeId]), 
    CONSTRAINT [FK_UserRoleClaims_ClaimTypes] FOREIGN KEY (ClaimTypeId) REFERENCES [ClaimTypes]([Id]),
	CONSTRAINT [FK_UserRoleClaims_ClaimValues] FOREIGN KEY (ClaimValueId) REFERENCES [ClaimValues]([Id])
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_UserRoleClaims_RoleId] 
ON [dbo].[UserRoleClaims] ([RoleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_UserRoleClaims_ClaimTypeId] 
ON [dbo].[UserRoleClaims] ([ClaimTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_UserRoleClaims_ClaimValueId] 
ON [dbo].[UserRoleClaims] ([ClaimValueId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
