-- Find encounters missing case load IDs for treatment/therapy services
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
    es.CaseLoadId AS 'Case Load ID',
    estat.Name AS 'Status',
    es.EncounterNumber AS 'Encounter Number',
    e.EncounterDate AS 'Encounter Date',
    e.EncounterStartTime AS 'Start Time',
    e.EncounterEndTime AS 'End Time'
FROM EncounterStudents es
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN EncounterStatuses estat ON es.EncounterStatusId = estat.Id
JOIN Providers p ON e.ProviderId = p.Id
JOIN Users up ON p.ProviderUserId = up.Id
WHERE e.ServiceTypeId = 3  -- Treatment/Therapy
  AND es.CaseLoadId IS NULL
ORDER BY
    sd.Name,
    up.LastName,
    up.FirstName,
    s.LastName,
    s.FirstName,
    e.EncounterDate DESC;

-- Find encounters missing both case load ID and diagnosis code ID for treatment/therapy services
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
    es.CaseLoadId AS 'Case Load ID',
    es.DiagnosisCodeId AS 'Diagnosis Code ID',
    estat.Name AS 'Status',
    es.EncounterNumber AS 'Encounter Number',
    e.EncounterDate AS 'Encounter Date',
    e.EncounterStartTime AS 'Start Time',
    e.EncounterEndTime AS 'End Time'
FROM EncounterStudents es
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN EncounterStatuses estat ON es.EncounterStatusId = estat.Id
JOIN Providers p ON e.ProviderId = p.Id
JOIN Users up ON p.ProviderUserId = up.Id
WHERE e.ServiceTypeId = 3  -- Treatment/Therapy
  AND es.CaseLoadId IS NULL
  AND es.DiagnosisCodeId IS NULL
ORDER BY
    sd.Name,
    up.LastName,
    up.FirstName,
    s.LastName,
    s.FirstName,
    e.EncounterDate DESC; 