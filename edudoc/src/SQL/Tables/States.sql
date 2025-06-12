CREATE TABLE [dbo].[States] (
    [StateCode] CHAR (2)     NOT NULL,
    [Name]  VARCHAR (64) NOT NULL,
    CONSTRAINT [PK_States] PRIMARY KEY CLUSTERED ([StateCode] ASC)
);

