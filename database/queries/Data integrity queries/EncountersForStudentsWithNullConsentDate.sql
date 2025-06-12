-- Students with null parental consent dates
SELECT
	d.Name AS 'District Name',
	s.FirstName,
	s.LastName,
	CONVERT(VARCHAR, s.DateOfBirth, 110) AS 'Student DOB',
	s.Archived AS 'Student Archived',
	spc.ParentalConsentEffectiveDate,
	spct.Name AS 'Parental Consent Type'
FROM Students s
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN StudentParentalConsents spc ON s.Id = spc.StudentId
JOIN StudentParentalConsentTypes spct on spc.ParentalConsentTypeId = spct.Id
WHERE spc.ParentalConsentEffectiveDate IS NULL
ORDER BY d.Name;

-- Students with multiple pending parental consents
SELECT
    d.Name AS 'District Name',
    s.FirstName,
    s.LastName,
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS 'Student DOB',
    s.Archived AS 'Student Archived',
    COUNT(*) AS 'Number of Pending Consents',
    MIN(spc.ParentalConsentEffectiveDate) AS 'Earliest Consent Date',
    MAX(spc.ParentalConsentEffectiveDate) AS 'Latest Consent Date'
FROM Students s
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN StudentParentalConsents spc ON s.Id = spc.StudentId
WHERE spc.ParentalConsentTypeId = 3
GROUP BY d.Name, s.FirstName, s.LastName, s.DateOfBirth, s.Archived
HAVING COUNT(*) > 1
ORDER BY d.Name, s.LastName, s.FirstName;

-- Encounter data for students with null parental consent dates
SELECT
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
    CONVERT(VARCHAR, es.EncounterDate, 110) AS 'Encounter Date',
    spc.ParentalConsentEffectiveDate,
    spct.Name AS 'Parental Consent Type'
FROM dbo.EncounterStudents es
JOIN dbo.EncounterStatuses estat ON es.EncounterStatusId = estat.Id
JOIN dbo.Students s ON es.StudentId = s.Id
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN dbo.Encounters e ON es.EncounterId = e.Id
JOIN dbo.Providers p ON e.ProviderId = p.Id
JOIN dbo.Users u ON p.ProviderUserId = u.Id
JOIN StudentParentalConsents spc ON s.Id = spc.StudentId
JOIN StudentParentalConsentTypes spct ON spc.ParentalConsentTypeId = spct.Id
WHERE 
    es.EncounterDate BETWEEN '2024-01-01' AND '2025-02-25'
    AND spc.ParentalConsentEffectiveDate IS NULL
ORDER BY 
    [District],
    [Student Last],
    [Student First];

-- Encounters that made it to Invoiced outside of consent periods
WITH ConsentPeriods AS (
    SELECT
        s.Id AS StudentId,
        spc.ParentalConsentEffectiveDate AS ConsentStart,
        LEAD(spc.ParentalConsentEffectiveDate) OVER (PARTITION BY s.Id ORDER BY spc.ParentalConsentEffectiveDate) AS NextConsentDate,
        spc.ParentalConsentTypeId
    FROM Students s
    JOIN StudentParentalConsents spc ON s.Id = spc.StudentId
    WHERE spc.ParentalConsentTypeId IN (1, 2)  -- 1 = confirmed consent, 2 = non-consent
),
ValidConsentPeriods AS (
    SELECT
        StudentId,
        ConsentStart,
        CASE 
            WHEN NextConsentDate IS NULL THEN '9999-12-31'  -- Ongoing consent
            ELSE DATEADD(DAY, -1, NextConsentDate)  -- End of consent period is day before next consent
        END AS ConsentEnd,
        ParentalConsentTypeId
    FROM ConsentPeriods
    WHERE ParentalConsentTypeId = 1  -- Only confirmed consents
)
SELECT
    d.Name AS 'District Name',
    s.FirstName AS 'Student First',
    s.LastName AS 'Student Last',
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS 'Student DOB',
    s.Archived AS 'Student Archived',
    e.Archived AS 'Global Encounter Archived',
    es.Archived AS 'Student Encounter Archived',
    es.EncounterNumber AS 'Encounter No',
    CONVERT(VARCHAR, es.EncounterDate, 110) AS 'Encounter Date',
    estat.Name AS 'Status',
    u.FirstName AS 'Provider First',
    u.LastName AS 'Provider Last',
    CONVERT(VARCHAR, vcp.ConsentStart, 110) AS 'Nearest Consent Start',
    CONVERT(VARCHAR, vcp.ConsentEnd, 110) AS 'Nearest Consent End',
    ce.ClaimId AS 'Claim ID',
    ce.PaidAmount AS 'Paid Amount'
FROM dbo.EncounterStudents es
JOIN dbo.EncounterStatuses estat ON es.EncounterStatusId = estat.Id
JOIN dbo.Students s ON es.StudentId = s.Id
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN dbo.Encounters e ON es.EncounterId = e.Id
JOIN dbo.Providers p ON e.ProviderId = p.Id
JOIN dbo.Users u ON p.ProviderUserId = u.Id
LEFT JOIN ValidConsentPeriods vcp ON s.Id = vcp.StudentId
    AND es.EncounterDate >= vcp.ConsentStart
    AND es.EncounterDate <= vcp.ConsentEnd
LEFT JOIN dbo.ClaimsEncounters ce ON es.Id = ce.EncounterStudentId
WHERE 
    es.EncounterDate BETWEEN '2024-01-01' AND '2025-02-25'
    AND vcp.StudentId IS NULL  -- No valid consent period found for this encounter
    AND EXISTS (
        SELECT 1 
        FROM dbo.EncounterStudentStatuses ess 
        WHERE ess.EncounterStudentId = es.Id 
        AND ess.EncounterStatusId = 21
    )
ORDER BY 
    [District Name],
    [Student Last],
    [Student First],
    [Encounter Date];
