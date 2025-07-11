CREATE TABLE [dbo].[ContactPhones]
(
	[ContactId] INT NOT NULL ,
    [Phone] VARCHAR(20) NOT NULL,
    [Extension] VARCHAR(5) NOT NULL DEFAULT '',
    [PhoneTypeId] INT NOT NULL,
    [IsPrimary] BIT NOT NULL DEFAULT ((0)),
    CONSTRAINT [FK_ContactPhones_PhoneTypes] FOREIGN KEY (PhoneTypeId) REFERENCES PhoneTypes([Id]),
    CONSTRAINT [FK_ContactPhones_Contacts] FOREIGN KEY (ContactId) REFERENCES [Contacts]([Id]), 
    CONSTRAINT [PK_ContactPhones] PRIMARY KEY ([ContactId], [Phone]),
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_ContactPhones_PhoneTypeId] 
ON [dbo].[ContactPhones] ([PhoneTypeId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_ContactPhones_ContactId] 
ON [dbo].[ContactPhones] ([ContactId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
