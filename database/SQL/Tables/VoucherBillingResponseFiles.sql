CREATE TABLE [dbo].[VoucherBillingResponseFiles]
(
	[Id] INT NOT NULL IDENTITY,
    [VoucherId] INT NOT NULL,
    [BillingResponseFileId] INT NOT NULL,
    [CreatedById] INT NOT NULL DEFAULT 1, 
    [DateCreated] DATETIME NULL DEFAULT GETUTCDATE(), 
    CONSTRAINT [FK_VoucherBillingResponseFiles_CreatedBy] FOREIGN KEY ([CreatedById]) REFERENCES [dbo].[Users] ([Id]),
    CONSTRAINT [FK_VoucherBillingResponseFiles_Providers] FOREIGN KEY ([VoucherId]) REFERENCES [dbo].[Vouchers] ([Id]),
    CONSTRAINT [FK_VoucherBillingResponseFiles_Students] FOREIGN KEY ([BillingResponseFileId]) REFERENCES [dbo].[BillingResponseFiles] ([Id]),
    CONSTRAINT [PK_VoucherBillingResponseFiles] PRIMARY KEY ([Id]),
)
Go

