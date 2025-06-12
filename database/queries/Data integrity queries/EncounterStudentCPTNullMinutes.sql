-- Query 1: Find all EncounterStudents with exactly one linked CPT code that has NULL minutes
SELECT
    sd.Name AS 'District Name',
    up.FirstName AS 'Provider First',
    up.LastName AS 'Provider Last',
    s.FirstName AS 'Student First',
    s.LastName AS 'Student Last',
    s.DateOfBirth AS 'Student DOB',
    s.Archived AS 'Student Archived',
    e.Archived AS 'Global Encounter Archived',
    es.Archived AS 'Student Encounter Archived',
    estat.Name AS 'Status',
    es.EncounterNumber AS 'Encounter Number',
    e.EncounterDate AS 'Encounter Date',
    e.EncounterStartTime AS 'Start Time',
    e.EncounterEndTime AS 'End Time',
    cpt.Code AS 'CPT Code',
    cpt.Description AS 'CPT Description',
    escc.Minutes AS 'Minutes'
FROM [dbo].[EncounterStudents] es
JOIN [dbo].[Encounters] e ON es.EncounterId = e.Id
JOIN [dbo].[Students] s ON es.StudentId = s.Id
JOIN [dbo].[SchoolDistricts] sd ON s.DistrictId = sd.Id
JOIN [dbo].[EncounterStatuses] estat ON es.EncounterStatusId = estat.Id
JOIN [dbo].[Providers] p ON e.ProviderId = p.Id
JOIN [dbo].[Users] up ON p.ProviderUserId = up.Id
JOIN [dbo].[EncounterStudentCptCodes] escc ON es.Id = escc.EncounterStudentId
JOIN [dbo].[CptCodes] cpt ON escc.CptCodeId = cpt.Id
WHERE es.[Id] IN (
    SELECT escc.[EncounterStudentId]
    FROM [dbo].[EncounterStudentCptCodes] escc
    GROUP BY escc.[EncounterStudentId]
    HAVING COUNT(*) = 1
    AND MAX(CASE WHEN escc.[Minutes] IS NULL THEN 1 ELSE 0 END) = 1
)
AND es.EncounterStatusId NOT IN (12, 13, 14)  -- Exclude deviated, rejected, and cancelled encounters
ORDER BY
    sd.Name,
    up.LastName,
    up.FirstName,
    s.LastName,
    s.FirstName,
    e.EncounterDate DESC;

-- Query 2: Find all EncounterStudents with multiple linked CPT codes where at least one has NULL minutes
SELECT
    sd.Name AS 'District Name',
    up.FirstName AS 'Provider First',
    up.LastName AS 'Provider Last',
    s.FirstName AS 'Student First',
    s.LastName AS 'Student Last',
    s.DateOfBirth AS 'Student DOB',
    s.Archived AS 'Student Archived',
    e.Archived AS 'Global Encounter Archived',
    es.Archived AS 'Student Encounter Archived',
    estat.Name AS 'Status',
    es.EncounterNumber AS 'Encounter Number',
    e.EncounterDate AS 'Encounter Date',
    e.EncounterStartTime AS 'Start Time',
    e.EncounterEndTime AS 'End Time',
    cpt.Code AS 'CPT Code',
    cpt.Description AS 'CPT Description',
    escc.Minutes AS 'Minutes'
FROM [dbo].[EncounterStudents] es
JOIN [dbo].[Encounters] e ON es.EncounterId = e.Id
JOIN [dbo].[Students] s ON es.StudentId = s.Id
JOIN [dbo].[SchoolDistricts] sd ON s.DistrictId = sd.Id
JOIN [dbo].[EncounterStatuses] estat ON es.EncounterStatusId = estat.Id
JOIN [dbo].[Providers] p ON e.ProviderId = p.Id
JOIN [dbo].[Users] up ON p.ProviderUserId = up.Id
JOIN [dbo].[EncounterStudentCptCodes] escc ON es.Id = escc.EncounterStudentId
JOIN [dbo].[CptCodes] cpt ON escc.CptCodeId = cpt.Id
WHERE es.[Id] IN (
    SELECT escc.[EncounterStudentId]
    FROM [dbo].[EncounterStudentCptCodes] escc
    GROUP BY escc.[EncounterStudentId]
    HAVING COUNT(*) > 1
    AND SUM(CASE WHEN escc.[Minutes] IS NULL THEN 1 ELSE 0 END) > 0
)
AND es.EncounterStatusId NOT IN (12, 13, 14)  -- Exclude deviated, rejected, and cancelled encounters
ORDER BY
    sd.Name,
    up.LastName,
    up.FirstName,
    s.LastName,
    s.FirstName,
    e.EncounterDate DESC;
