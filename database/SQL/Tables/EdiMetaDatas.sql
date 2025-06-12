CREATE TABLE [dbo].[EdiMetaDatas]
(
	[Id] INT NOT NULL  IDENTITY,
	[SenderId] INT NOT NULL,
	[ReceiverId] VARCHAR(20) NOT NULL,
    [ClaimImplementationReference] VARCHAR(35) NOT NULL,
    [RosterValidationImplementationReference] VARCHAR(35) NOT NULL,
    [SubmitterOrganizationName] VARCHAR(60) NOT NULL,
	[SubmitterQlfrId] VARCHAR(2) NOT NULL,
    [SubmitterName] VARCHAR(60) NOT NULL,
    [SubmitterPhone] VARCHAR(256) NOT NULL,
    [SubmitterPhoneAlt] VARCHAR(256) NOT NULL,
    [SubmitterEmail] VARCHAR(256) NOT NULL,
    [ReceiverOrganizationName] VARCHAR(60) NOT NULL,
	[ProviderCode] VARCHAR(2) NOT NULL,
	[ReferenceQlfrId] VARCHAR(3) CONSTRAINT [CK_EdiMetaDatas_ReferenceQlfrId] CHECK (LEN([ReferenceQlfrId]) >= 2) NOT NULL,
    [ProviderOrganizationName] VARCHAR(60) NOT NULL,
    [ServiceLocationCode] VARCHAR(10) NOT NULL,
    [ClaimNoteDescription] VARCHAR(80) NOT NULL,
    [FacilityCode] VARCHAR(2) NOT NULL,
    CONSTRAINT [PK_EdiMetaDatas] PRIMARY KEY ([Id]),
    
)
