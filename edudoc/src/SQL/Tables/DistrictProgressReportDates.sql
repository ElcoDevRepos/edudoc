
-- Duplicate data in Partials/DistrictProgressReportDates.cs
CREATE TABLE [dbo].[DistrictProgressReportDates]
(
    [Id]                     INT      NOT NULL IDENTITY,
    [DistrictId]             INT      NOT NULL,
    [FirstQuarterStartDate]  DATETIME NOT NULL DEFAULT DATETIMEFROMPARTS(dbo.CurrentSchoolYear() - 1, 9, 1, 12, 0, 0, 0),
    [FirstQuarterEndDate]    DATETIME NOT NULL DEFAULT DATETIMEFROMPARTS(dbo.CurrentSchoolYear() - 1, 11, 30, 12, 0, 0, 0),
    [SecondQuarterStartDate] DATETIME NOT NULL DEFAULT DATETIMEFROMPARTS(dbo.CurrentSchoolYear() - 1, 12, 1, 12, 0, 0, 0),
    [SecondQuarterEndDate]   DATETIME NOT NULL DEFAULT DATETIMEFROMPARTS(dbo.CurrentSchoolYear(), 3, 1, 12, 0, 0, 0),
    [ThirdQuarterStartDate]  DATETIME NOT NULL DEFAULT DATETIMEFROMPARTS(dbo.CurrentSchoolYear(), 3, 2, 12, 0, 0, 0),
    [ThirdQuarterEndDate]    DATETIME NOT NULL DEFAULT DATETIMEFROMPARTS(dbo.CurrentSchoolYear(), 5, 31, 12, 0, 0, 0),
    [FourthQuarterStartDate] DATETIME NOT NULL DEFAULT DATETIMEFROMPARTS(dbo.CurrentSchoolYear(), 6, 1, 12, 0, 0, 0),
    [FourthQuarterEndDate]   DATETIME NOT NULL DEFAULT DATETIMEFROMPARTS(dbo.CurrentSchoolYear(), 8, 31, 12, 0, 0, 0),
    CONSTRAINT [PK_DistrictProgressReportDates] PRIMARY KEY ([Id]),
    CONSTRAINT [FK_DistrictProgressReportDates_SchoolDistricts] FOREIGN KEY ([DistrictId]) REFERENCES [SchoolDistricts]([Id])
)

GO
EXEC sp_addextendedproperty
    @name = N'MS_Description',
    @value = N'Module',
    @level0type = N'SCHEMA',
    @level0name = N'dbo',
    @level1type = N'TABLE',
    @level1name = N'DistrictProgressReportDates',
    @level2type = N'COLUMN',
    @level2name = N'Id'



