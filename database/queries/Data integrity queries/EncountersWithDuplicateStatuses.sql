WITH StatusSequence AS (
    SELECT 
        ess.EncounterStudentId,
        ess.EncounterStatusId,
        es.Name as StatusName,
        ess.DateCreated,
        ROW_NUMBER() OVER (PARTITION BY ess.EncounterStudentId ORDER BY ess.DateCreated) as RowNum,
        LAG(ess.EncounterStatusId) OVER (PARTITION BY ess.EncounterStudentId ORDER BY ess.DateCreated) as PrevStatus,
        LAG(es.Name) OVER (PARTITION BY ess.EncounterStudentId ORDER BY ess.DateCreated) as PrevStatusName,
        LAG(ess.DateCreated) OVER (PARTITION BY ess.EncounterStudentId ORDER BY ess.DateCreated) as PrevDateCreated
    FROM EncounterStudentStatuses ess
    JOIN EncounterStatuses es ON ess.EncounterStatusId = es.Id
)
SELECT DISTINCT
    sd.Name AS SchoolDistrict,
    prov_user.FirstName AS ProviderFirstName,
    prov_user.LastName AS ProviderLastName,
    s.FirstName AS StudentFirstName,
    s.LastName AS StudentLastName,
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS StudentDOB,
    s.Archived AS StudentArchived,
    e.Archived AS GlobalEncounterArchived,
    es.Archived AS StudentEncounterArchived,
    es.EncounterNumber,
    CONVERT(VARCHAR, es.EncounterDate, 101) AS EncounterDate,
    ss.EncounterStudentId,
    ss.StatusName,
    MIN(ss.DateCreated) as FirstOccurrence,
    ss.PrevStatusName as PreviousStatus,
    MIN(ss.PrevDateCreated) as PreviousStatusDate
FROM StatusSequence ss
JOIN EncounterStudents es ON ss.EncounterStudentId = es.Id
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN Users prov_user ON e.ProviderId = prov_user.Id
WHERE ss.EncounterStatusId = ss.PrevStatus 
    AND ss.RowNum > 1
GROUP BY 
    sd.Name,
    prov_user.FirstName,
    prov_user.LastName,
    s.FirstName,
    s.LastName,
    s.DateOfBirth,
    s.Archived,
    e.Archived,
    es.Archived,
    es.EncounterNumber,
    es.EncounterDate,
    ss.EncounterStudentId,
    ss.StatusName,
    ss.PrevStatusName
ORDER BY 
    sd.Name,
    prov_user.LastName,
    prov_user.FirstName,
    s.LastName,
    s.FirstName,
    FirstOccurrence;

-- Query to find encounters with multiple status entries at the same timestamp
WITH SameTimestampStatuses AS (
    SELECT 
        ess.EncounterStudentId,
        ess.EncounterStatusId,
        es.Name as StatusName,
        ess.DateCreated,
        COUNT(*) OVER (PARTITION BY ess.EncounterStudentId, ess.DateCreated) as StatusCount
    FROM EncounterStudentStatuses ess
    JOIN EncounterStatuses es ON ess.EncounterStatusId = es.Id
)
SELECT DISTINCT
    sd.Name AS SchoolDistrict,
    prov_user.FirstName AS ProviderFirstName,
    prov_user.LastName AS ProviderLastName,
    s.FirstName AS StudentFirstName,
    s.LastName AS StudentLastName,
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS StudentDOB,
    s.Archived AS StudentArchived,
    e.Archived AS GlobalEncounterArchived,
    es.Archived AS StudentEncounterArchived,
    es.EncounterNumber,
    CONVERT(VARCHAR, es.EncounterDate, 101) AS EncounterDate,
    sts.EncounterStudentId,
    sts.StatusName,
    sts.DateCreated,
    sts.StatusCount
FROM SameTimestampStatuses sts
JOIN EncounterStudents es ON sts.EncounterStudentId = es.Id
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN Users prov_user ON e.ProviderId = prov_user.Id
WHERE sts.StatusCount > 1
ORDER BY 
    sd.Name,
    prov_user.LastName,
    prov_user.FirstName,
    s.LastName,
    s.FirstName,
    sts.DateCreated;
