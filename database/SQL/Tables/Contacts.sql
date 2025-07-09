CREATE TABLE [dbo].[Contacts]
(
	[Id] INT NOT NULL  IDENTITY, 
    [FirstName] VARCHAR(100) NOT NULL, 
    [LastName] VARCHAR(100) NOT NULL, 
    [Title] VARCHAR(100) NOT NULL DEFAULT '', 
    [Email] VARCHAR(100) NOT NULL, 
    [AddressId] INT NULL,
    [RoleId] INT NOT NULL,
    [StatusId] INT NOT NULL DEFAULT 0, 
    [CreatedById] INT NULL , 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL, 
    [Archived] BIT NOT NULL DEFAULT 0,
    CONSTRAINT [FK_Contacts_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_Contacts_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_Contacts_ContactStatuses] FOREIGN KEY (StatusId) REFERENCES [dbo].[ContactStatuses] ([Id]),
    CONSTRAINT [FK_Contacts_Addresses] FOREIGN KEY ([AddressId]) REFERENCES [Addresses]([Id]),
    CONSTRAINT [FK_Contacts_ContactRoles] FOREIGN KEY ([RoleId]) REFERENCES [dbo].[ContactRoles] ([Id]),
    CONSTRAINT [PK_Contacts] PRIMARY KEY ([Id])
)

GO

-- Indexes for Foreign Keys
CREATE NONCLUSTERED INDEX [IX_Contacts_CreatedById] 
ON [dbo].[Contacts] ([CreatedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Contacts_ModifiedById] 
ON [dbo].[Contacts] ([ModifiedById])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Contacts_StatusId] 
ON [dbo].[Contacts] ([StatusId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Contacts_AddressId] 
ON [dbo].[Contacts] ([AddressId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO

CREATE NONCLUSTERED INDEX [IX_Contacts_RoleId] 
ON [dbo].[Contacts] ([RoleId])
WITH (FILLFACTOR = 100, ONLINE = ON, DATA_COMPRESSION = ROW);

GO
