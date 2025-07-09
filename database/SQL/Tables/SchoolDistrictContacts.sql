CREATE TABLE [dbo].[SchoolDistrictContacts]
(
	[SchoolDistrictId] INT NOT NULL , 
    [ContactId] INT NOT NULL, 
    CONSTRAINT [FK_SchoolDistrictContacts_SchoolDistricts] FOREIGN KEY ([SchoolDistrictId]) REFERENCES [SchoolDistricts]([Id]), 
    CONSTRAINT [FK_SchoolDistrictContacts_Contacts] FOREIGN KEY ([ContactId]) REFERENCES [Contacts]([Id]), 
    CONSTRAINT [PK_SchoolDistrictContacts] PRIMARY KEY ([SchoolDistrictId], [ContactId]), 
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_SchoolDistrictContacts_SchoolDistrictId] 
ON [dbo].[SchoolDistrictContacts] ([SchoolDistrictId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_SchoolDistrictContacts_ContactId] 
ON [dbo].[SchoolDistrictContacts] ([ContactId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);
