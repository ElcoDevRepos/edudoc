SELECT DISTINCT
    d.Name AS 'District Name',
    s.FirstName AS 'Student First Name',
    s.LastName AS 'Student Last Name',
    es.EncounterDate AS 'Most Recent Encounter Date',
    u.FirstName AS 'Provider First Name',
    u.LastName AS 'Provider Last Name',
	u.Email AS 'Provider Email',
    pt.Name AS 'Provider Title',
    (
        SELECT COUNT(*)
        FROM dbo.CaseLoads cl
        JOIN dbo.CaseLoadScripts cs ON cl.Id = cs.CaseLoadId
        WHERE cl.StudentId = s.Id
        AND cs.DiagnosisCodeId IS NULL
        AND cs.Archived = 0
        AND cl.Archived = 0
    ) AS 'Null Diagnosis Script Count'
FROM dbo.Students s
INNER JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
INNER JOIN dbo.EncounterStudents es ON s.Id = es.StudentId
INNER JOIN dbo.Encounters e ON es.EncounterId = e.Id
INNER JOIN dbo.Providers p ON e.ProviderId = p.Id
INNER JOIN dbo.Users u ON p.ProviderUserId = u.Id
INNER JOIN dbo.ProviderTitles pt ON p.TitleId = pt.Id
WHERE 
    EXISTS (
        SELECT 1
        FROM dbo.CaseLoads cl
        JOIN dbo.CaseLoadScripts cs ON cl.Id = cs.CaseLoadId
        WHERE cl.StudentId = s.Id
        AND cs.DiagnosisCodeId IS NULL
        AND cs.Archived = 0
        AND cl.Archived = 0
    )
    AND s.Archived = 0
    AND es.Archived = 0
    AND pt.ServiceCodeId = 5  -- Nursing service code
    AND es.EncounterDate = (
        SELECT MAX(es2.EncounterDate)
        FROM dbo.EncounterStudents es2
        JOIN dbo.Encounters e2 ON es2.EncounterId = e2.Id
        JOIN dbo.Providers p2 ON e2.ProviderId = p2.Id
        JOIN dbo.ProviderTitles pt2 ON p2.TitleId = pt2.Id
        WHERE es2.StudentId = s.Id
        AND es2.Archived = 0
        AND pt2.ServiceCodeId = 5
    )
ORDER BY 
    d.Name,
    s.LastName,
    s.FirstName;
