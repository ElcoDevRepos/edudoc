CREATE TABLE [dbo].[UserPhones]
(
	[UserId] INT NOT NULL , 
    [Phone] VARCHAR(20) NOT NULL, 
    [Extension] VARCHAR(5) NOT NULL DEFAULT '', 
    [PhoneTypeId] INT NOT NULL, 
    [IsPrimary] BIT NOT NULL DEFAULT (0),
	CONSTRAINT [FK_UserPhones_Users] FOREIGN KEY (UserId) REFERENCES Users(Id), 
    CONSTRAINT [FK_UserPhones_PhoneTypes] FOREIGN KEY (PhoneTypeId) REFERENCES PhoneTypes(Id), 
    CONSTRAINT [PK_UserPhones] PRIMARY KEY ([UserId], [Phone]) 
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_UserPhones_UserId] 
ON [dbo].[UserPhones] ([UserId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_UserPhones_PhoneTypeId] 
ON [dbo].[UserPhones] ([PhoneTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
