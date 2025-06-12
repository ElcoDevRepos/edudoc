-- Query 1: Find encounters incorrectly marked as group when they're individual sessions
SELECT DISTINCT
    d.Name AS 'District Name',
    s.FirstName AS 'Student First Name',
    s.LastName AS 'Student Last Name',
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS 'Student Birthdate',
    c.Code AS 'CPT Code',
    c.Description AS 'CPT Description',
    es.EncounterNumber AS 'Encounter No',
    u.FirstName AS 'Provider First Name',
    u.LastName AS 'Provider Last Name',
    e.AdditionalStudents AS 'Additional Students',
    (SELECT COUNT(DISTINCT es2.StudentId) 
     FROM dbo.EncounterStudents es2 
     WHERE es2.EncounterId = e.Id 
     AND es2.StudentDeviationReasonId IS NULL
     AND es2.DateESigned IS NOT NULL) AS 'Unique Students',
    es.EncounterDate AS 'Session Date',
    est.Name AS 'Encounter Status',
    ce.ClaimId AS 'Claim ID',
    ce.PaidAmount AS 'Paid Amount'
FROM dbo.Encounters e
JOIN dbo.EncounterStudents es ON e.Id = es.EncounterId
JOIN dbo.EncounterStudentCptCodes esc ON es.Id = esc.EncounterStudentId
JOIN dbo.CPTCodes c ON esc.CptCodeId = c.Id
JOIN dbo.Students s ON es.StudentId = s.Id
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN dbo.Providers p ON e.ProviderId = p.Id
JOIN dbo.Users u ON p.ProviderUserId = u.Id
JOIN dbo.EncounterStatuses est ON es.EncounterStatusId = est.Id
LEFT JOIN dbo.ProviderLicenses pl ON p.Id = pl.ProviderId
LEFT JOIN dbo.ClaimsEncounters ce ON es.Id = ce.EncounterStudentId
LEFT JOIN dbo.EncounterStudentStatuses ess ON es.Id = ess.EncounterStudentId
WHERE 
    e.AdditionalStudents = 0
    AND es.ESignedById IS NOT NULL
    AND es.DateESigned IS NOT NULL
    AND es.StudentDeviationReasonId IS NULL
    AND c.Code IN ('90853', '92508', '96164', '96165', '97150')
    AND ce.PaidAmount IS NOT NULL
    AND CAST(ce.PaidAmount AS decimal(10,2)) > 0
    AND d.Id != 125
    AND est.Id NOT IN (31, 34)
    AND EXISTS (
        SELECT 1
        FROM dbo.EncounterStudents es2
        WHERE es2.EncounterId = e.Id
        AND es2.StudentDeviationReasonId IS NULL
        AND es2.DateESigned IS NOT NULL
        GROUP BY es2.EncounterId
        HAVING COUNT(DISTINCT StudentId) = 1
    )
    AND esc.Minutes IS NOT NULL
    AND esc.Minutes > 0
ORDER BY 
    d.Name,
    s.LastName,
    s.FirstName,
    es.EncounterDate;
