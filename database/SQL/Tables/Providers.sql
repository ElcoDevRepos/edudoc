CREATE TABLE [dbo].[Providers]
(
	[Id] INT NOT NULL IDENTITY,
    [ProviderUserId] INT NOT NULL,
    [TitleId] INT NOT NULL,
    [VerifiedORP] BIT NOT NULL DEFAULT 0,
    [ORPApprovalRequestDate] DATETIME NULL,
    [ORPApprovalDate] DATETIME NULL,
    [ORPDenialDate] DATETIME NULL,
    [NPI] VARCHAR(10) NULL,
    [Phone] varchar(50) NULL DEFAULT 000-000-0000,
    [ProviderEmploymentTypeId] INT NOT NULL,
    [Notes] VARCHAR(2000) NULL, 
    [DocumentationDate] DATETIME NULL DEFAULT GETUTCDATE(), 
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [ModifiedById] INT NULL, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    [DateModified] DATETIME NULL,
    [Archived] BIT NOT NULL DEFAULT 0, -- This field is going to be used for Blocking
    [BlockedReason] VARCHAR(250) NULL, 
    [DoNotBillReasonId] INT NULL
    CONSTRAINT [FK_Providers_ProviderTitle] FOREIGN KEY (TitleId) REFERENCES [dbo].[ProviderTitles] ([Id]),
    CONSTRAINT [FK_Providers_ProviderEmploymentTypes] FOREIGN KEY (ProviderEmploymentTypeId) REFERENCES [dbo].[ProviderEmploymentTypes] ([Id]),
    CONSTRAINT [FK_Providers_DoNotBillReason] FOREIGN KEY (DoNotBillReasonId) REFERENCES [dbo].[ProviderDoNotBillReasons] ([Id]),
 	CONSTRAINT [FK_Providers_ProviderUser] FOREIGN KEY ([ProviderUserId]) REFERENCES [dbo].[Users] ([Id]),
 	CONSTRAINT [FK_Providers_CreatedBy] FOREIGN KEY (CreatedById) REFERENCES [dbo].[Users] ([Id]),
	CONSTRAINT [FK_Providers_ModifiedBy] FOREIGN KEY (ModifiedById) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [PK_Providers] PRIMARY KEY ([Id]) 
)

GO
EXEC sp_addextendedproperty @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'Providers',
    @level2type = N'COLUMN',
    @level2name = N'Id'

GO
CREATE NONCLUSTERED INDEX IX_Providers ON [dbo].[Providers] ([ProviderUserId]);
