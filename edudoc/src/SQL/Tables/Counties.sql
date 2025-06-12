CREATE TABLE [dbo].[Counties]
(
    [Zip] NVARCHAR(20) NOT NULL, 
    [City] VARCHAR(50) NOT NULL, 
    [StateCode] CHAR(2) NOT NULL, 
    [CountyName] VARCHAR(50) NOT NULL, 
    [Latitude] DECIMAL NULL, 
    [Longitude] DECIMAL NULL, 
    [Id] INT NOT NULL IDENTITY, 
    CONSTRAINT [PK_Counties] PRIMARY KEY ([Zip])
)
