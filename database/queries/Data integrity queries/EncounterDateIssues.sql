-- Query 1: Find encounters where the global encounter date differs from the student encounter date
-- This helps identify potential date entry issues where student dates don't match the encounter date
SELECT DISTINCT
    d.Name AS 'District',
    s.FirstName AS 'Student First',
    s.LastName AS 'Student Last',
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS 'Student DOB',
    s.Archived AS 'Student Archived',
    e.Archived AS 'Global Encounter Archived',
    es.Archived AS 'Student Encounter Archived',
    estat.Name AS 'Status',
    u.FirstName AS 'Provider First',
    u.LastName AS 'Provider Last',
    es.EncounterNumber AS 'Encounter No',
    e.EncounterDate AS 'Global Encounter Date',
    es.EncounterDate AS 'Student Encounter Date',
    DATEDIFF(DAY, e.EncounterDate, es.EncounterDate) AS 'Date Diff (days)',
    e.EncounterStartTime AS 'Start Time',
    e.EncounterEndTime AS 'End Time',
    es.EncounterStartTime AS 'Student Start',
    es.EncounterEndTime AS 'Student End'
FROM dbo.Encounters e
JOIN dbo.EncounterStudents es ON e.Id = es.EncounterId
JOIN dbo.Students s ON es.StudentId = s.Id
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN dbo.Providers p ON e.ProviderId = p.Id
JOIN dbo.Users u ON p.ProviderUserId = u.Id
JOIN dbo.EncounterStatuses estat ON es.EncounterStatusId = estat.Id
WHERE 
    -- Global encounter date is different from student encounter date (ignoring time)
    CONVERT(DATE, e.EncounterDate) <> CONVERT(DATE, es.EncounterDate)
ORDER BY 
    d.Name,
    s.LastName,
    s.FirstName,
    e.EncounterDate;

-- Query 2: Find encounters with dates before July 1, 2022
-- This helps identify potential date entry issues where encounters were entered with dates too early
SELECT DISTINCT
    d.Name AS 'District',
    s.FirstName AS 'Student First',
    s.LastName AS 'Student Last',
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS 'Student DOB',
    s.Archived AS 'Student Archived',
    e.Archived AS 'Global Encounter Archived',
    es.Archived AS 'Student Encounter Archived',
    estat.Name AS 'Status',
    u.FirstName AS 'Provider First',
    u.LastName AS 'Provider Last',
    es.EncounterNumber AS 'Encounter No',
    e.EncounterDate AS 'Global Encounter Date',
    es.EncounterDate AS 'Student Encounter Date',
    e.EncounterStartTime AS 'Start Time',
    e.EncounterEndTime AS 'End Time',
    es.EncounterStartTime AS 'Student Start',
    es.EncounterEndTime AS 'Student End'
FROM dbo.Encounters e
JOIN dbo.EncounterStudents es ON e.Id = es.EncounterId
JOIN dbo.Students s ON es.StudentId = s.Id
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN dbo.Providers p ON e.ProviderId = p.Id
JOIN dbo.Users u ON p.ProviderUserId = u.Id
JOIN dbo.EncounterStatuses estat ON es.EncounterStatusId = estat.Id
WHERE 
    -- Either global or student encounter date is before July 1, 2022
    CONVERT(DATE, e.EncounterDate) < '2022-07-01'
    OR CONVERT(DATE, es.EncounterDate) < '2022-07-01'
    -- OR one date is before July 1, 2022 and the other is NULL
    OR (CONVERT(DATE, e.EncounterDate) < '2022-07-01' AND es.EncounterDate IS NULL)
    OR (CONVERT(DATE, es.EncounterDate) < '2022-07-01' AND e.EncounterDate IS NULL)
ORDER BY 
    d.Name,
    s.LastName,
    s.FirstName,
    e.EncounterDate;