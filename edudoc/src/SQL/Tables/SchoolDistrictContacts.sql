CREATE TABLE [dbo].[SchoolDistrictContacts]
(
	[SchoolDistrictId] INT NOT NULL , 
    [ContactId] INT NOT NULL, 
    CONSTRAINT [FK_SchoolDistrictContacts_SchoolDistricts] FOREIGN KEY ([SchoolDistrictId]) REFERENCES [SchoolDistricts]([Id]), 
    CONSTRAINT [FK_SchoolDistrictContacts_Contacts] FOREIGN KEY ([ContactId]) REFERENCES [Contacts]([Id]), 
    CONSTRAINT [PK_SchoolDistrictContacts] PRIMARY KEY ([SchoolDistrictId], [ContactId]), 
)
