-- Query 1: Find encounters where student times fall outside the encounter time boundaries
-- This helps identify potential time entry issues where student times don't match the encounter time range
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
    e.EncounterDate AS 'Encounter Date',
    e.EncounterStartTime AS 'Start Time',
    e.EncounterEndTime AS 'End Time',
    es.EncounterStartTime AS 'Student Start',
    es.EncounterEndTime AS 'Student End',
    DATEDIFF(MINUTE, e.EncounterStartTime, es.EncounterStartTime) AS 'Start Diff (min)',
    DATEDIFF(MINUTE, e.EncounterEndTime, es.EncounterEndTime) AS 'End Diff (min)'
FROM dbo.Encounters e
JOIN dbo.EncounterStudents es ON e.Id = es.EncounterId
JOIN dbo.Students s ON es.StudentId = s.Id
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN dbo.Providers p ON e.ProviderId = p.Id
JOIN dbo.Users u ON p.ProviderUserId = u.Id
JOIN dbo.EncounterStatuses estat ON es.EncounterStatusId = estat.Id
WHERE 
    -- Student start time is before encounter start time
    es.EncounterStartTime < e.EncounterStartTime
    OR
    -- Student end time is after encounter end time
    es.EncounterEndTime > e.EncounterEndTime
ORDER BY 
    d.Name,
    s.LastName,
    s.FirstName,
    e.EncounterDate; 

-- Query 2: Find encounters with time mismatches between Encounter and EncounterStudent
-- This helps identify potential DST-related issues where times are exactly one hour apart
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
    e.EncounterDate AS 'Encounter Date',
    e.EncounterStartTime AS 'Start Time',
    e.EncounterEndTime AS 'End Time',
    es.EncounterStartTime AS 'Student Start',
    es.EncounterEndTime AS 'Student End',
    DATEDIFF(MINUTE, e.EncounterStartTime, es.EncounterStartTime) AS 'Start Diff (min)',
    DATEDIFF(MINUTE, e.EncounterEndTime, es.EncounterEndTime) AS 'End Diff (min)'
FROM dbo.Encounters e
JOIN dbo.EncounterStudents es ON e.Id = es.EncounterId
JOIN dbo.Students s ON es.StudentId = s.Id
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN dbo.Providers p ON e.ProviderId = p.Id
JOIN dbo.Users u ON p.ProviderUserId = u.Id
JOIN dbo.EncounterStatuses estat ON es.EncounterStatusId = estat.Id
WHERE 
    -- Check for exactly one hour difference in either direction
    (DATEDIFF(MINUTE, e.EncounterStartTime, es.EncounterStartTime) = 60 
     AND DATEDIFF(MINUTE, e.EncounterEndTime, es.EncounterEndTime) = 60)
    OR
    (DATEDIFF(MINUTE, e.EncounterStartTime, es.EncounterStartTime) = -60 
     AND DATEDIFF(MINUTE, e.EncounterEndTime, es.EncounterEndTime) = -60)
ORDER BY 
    d.Name,
    s.LastName,
    s.FirstName,
    e.EncounterDate; 
