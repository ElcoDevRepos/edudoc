-- Query to find encounters marked as missing Medicaid number (status 33) but where the student actually has a Medicaid number
SELECT
    sd.Name AS SchoolDistrict,
    prov_user.FirstName AS ProviderFirstName,
    prov_user.LastName AS ProviderLastName,
    s.FirstName AS StudentFirstName,
    s.LastName AS StudentLastName,
    s.MedicaidNo AS MedicaidNumber,
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS StudentDOB,
    s.Archived AS StudentArchived,
    e.Archived AS GlobalEncounterArchived,
    es.Archived AS StudentEncounterArchived,
    es.EncounterNumber,
    CONVERT(VARCHAR, es.EncounterDate, 101) AS EncounterDate
FROM EncounterStudents es
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN Users prov_user ON e.ProviderId = prov_user.Id
WHERE es.EncounterStatusId = 33
    AND s.MedicaidNo IS NOT NULL 
    AND LTRIM(RTRIM(s.MedicaidNo)) != '';

-- Query to find encounters marked as pending consent (status 27) or encounter entered prior to consent (status 17) but occurred during a valid consent period
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
    sd.Name AS SchoolDistrict,
    prov_user.FirstName AS ProviderFirstName,
    prov_user.LastName AS ProviderLastName,
    s.FirstName AS StudentFirstName,
    s.LastName AS StudentLastName,
    s.MedicaidNo AS MedicaidNumber,
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS StudentDOB,
    s.Archived AS StudentArchived,
    e.Archived AS GlobalEncounterArchived,
    es.Archived AS StudentEncounterArchived,
    es.EncounterNumber,
    CONVERT(VARCHAR, es.EncounterDate, 101) AS EncounterDate,
    CONVERT(VARCHAR, vcp.ConsentStart, 101) AS ConsentStartDate,
    CONVERT(VARCHAR, vcp.ConsentEnd, 101) AS ConsentEndDate
FROM EncounterStudents es
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN Users prov_user ON e.ProviderId = prov_user.Id
JOIN ValidConsentPeriods vcp ON s.Id = vcp.StudentId
    AND es.EncounterDate >= vcp.ConsentStart
    AND es.EncounterDate <= vcp.ConsentEnd
WHERE es.EncounterStatusId IN (27, 17)
ORDER BY 
    sd.Name,
    prov_user.LastName,
    prov_user.FirstName,
    s.LastName,
    s.FirstName,
    es.EncounterDate;

-- Query to find encounters marked as ready for billing (status 30) that are between 30 and 365 days old
SELECT
    sd.Name AS SchoolDistrict,
    prov_user.FirstName AS ProviderFirstName,
    prov_user.LastName AS ProviderLastName,
    s.FirstName AS StudentFirstName,
    s.LastName AS StudentLastName,
    s.MedicaidNo AS MedicaidNumber,
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS StudentDOB,
    s.Archived AS StudentArchived,
    e.Archived AS GlobalEncounterArchived,
    es.Archived AS StudentEncounterArchived,
    es.EncounterNumber,
    CONVERT(VARCHAR, es.EncounterDate, 101) AS EncounterDate,
    DATEDIFF(DAY, es.EncounterDate, GETDATE()) AS DaysOld
FROM EncounterStudents es
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN Users prov_user ON e.ProviderId = prov_user.Id
WHERE es.EncounterStatusId = 30
    AND DATEDIFF(DAY, es.EncounterDate, GETDATE()) BETWEEN 30 AND 365
ORDER BY 
    sd.Name,
    prov_user.LastName,
    prov_user.FirstName,
    s.LastName,
    s.FirstName,
    es.EncounterDate;

-- Query to find encounters marked as claims older than 365 days (status 26) but have a history of being invoiced (status 21)
SELECT
    sd.Name AS SchoolDistrict,
    prov_user.FirstName AS ProviderFirstName,
    prov_user.LastName AS ProviderLastName,
    s.FirstName AS StudentFirstName,
    s.LastName AS StudentLastName,
    s.MedicaidNo AS MedicaidNumber,
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS StudentDOB,
    s.Archived AS StudentArchived,
    e.Archived AS GlobalEncounterArchived,
    es.Archived AS StudentEncounterArchived,
    es.EncounterNumber,
    CONVERT(VARCHAR, es.EncounterDate, 101) AS EncounterDate,
    DATEDIFF(DAY, es.EncounterDate, GETDATE()) AS DaysOld
FROM EncounterStudents es
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN Users prov_user ON e.ProviderId = prov_user.Id
WHERE es.EncounterStatusId = 26
    AND EXISTS (
        SELECT 1 
        FROM EncounterStudentStatuses ess 
        WHERE ess.EncounterStudentId = es.Id 
        AND ess.EncounterStatusId = 21
    )
ORDER BY 
    sd.Name,
    prov_user.LastName,
    prov_user.FirstName,
    s.LastName,
    s.FirstName,
    es.EncounterDate;

-- Query to find encounters marked as e-signed (status 2) but missing e-signature information
SELECT
    sd.Name AS SchoolDistrict,
    prov_user.FirstName AS ProviderFirstName,
    prov_user.LastName AS ProviderLastName,
    s.FirstName AS StudentFirstName,
    s.LastName AS StudentLastName,
    s.MedicaidNo AS MedicaidNumber,
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS StudentDOB,
    s.Archived AS StudentArchived,
    e.Archived AS GlobalEncounterArchived,
    es.Archived AS StudentEncounterArchived,
    es.EncounterNumber,
    CONVERT(VARCHAR, es.EncounterDate, 101) AS EncounterDate,
    es.ESignatureText,
    es.ESignedById,
    es.DateESigned
FROM EncounterStudents es
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN Users prov_user ON e.ProviderId = prov_user.Id
WHERE es.EncounterStatusId = 2
    AND (es.ESignatureText IS NULL 
         OR es.ESignedById IS NULL)
ORDER BY 
    sd.Name,
    prov_user.LastName,
    prov_user.FirstName,
    s.LastName,
    s.FirstName,
    es.EncounterDate;

-- Query to find encounters in billing statuses (21=invoiced, 22=billed, 23=paid, 30=ready for billing) but missing e-signature information
SELECT
    sd.Name AS SchoolDistrict,
    prov_user.FirstName AS ProviderFirstName,
    prov_user.LastName AS ProviderLastName,
    s.FirstName AS StudentFirstName,
    s.LastName AS StudentLastName,
    s.MedicaidNo AS MedicaidNumber,
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS StudentDOB,
    s.Archived AS StudentArchived,
    e.Archived AS GlobalEncounterArchived,
    es.Archived AS StudentEncounterArchived,
    es.EncounterNumber,
    CONVERT(VARCHAR, es.EncounterDate, 101) AS EncounterDate,
    es.ESignatureText,
    es.ESignedById,
    es.DateESigned,
    est.Name AS StatusName
FROM EncounterStudents es
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN Users prov_user ON e.ProviderId = prov_user.Id
JOIN EncounterStatuses est ON es.EncounterStatusId = est.Id
WHERE es.EncounterStatusId IN (21, 22, 23, 30)
    AND (es.ESignatureText IS NULL 
         OR es.ESignedById IS NULL)
ORDER BY 
    sd.Name,
    prov_user.LastName,
    prov_user.FirstName,
    s.LastName,
    s.FirstName,
    es.EncounterDate;

-- Query to find encounters marked as no referral (status 18) but the encounter took place during any valid referral period (ignores service code/type and supervisor)
SELECT
    sd.Name AS SchoolDistrict,
    prov_user.FirstName AS ProviderFirstName,
    prov_user.LastName AS ProviderLastName,
    s.FirstName AS StudentFirstName,
    s.LastName AS StudentLastName,
    s.MedicaidNo AS MedicaidNumber,
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS StudentDOB,
    s.Archived AS StudentArchived,
    e.Archived AS GlobalEncounterArchived,
    es.Archived AS StudentEncounterArchived,
    es.EncounterNumber,
    CONVERT(VARCHAR, es.EncounterDate, 101) AS EncounterDate,
    r.EffectiveDateFrom,
    r.EffectiveDateTo
FROM EncounterStudents es
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN Providers prov ON e.ProviderId = prov.Id
JOIN Users prov_user ON prov.ProviderUserId = prov_user.Id
JOIN SupervisorProviderStudentReferalSignOffs r ON r.StudentId = s.Id
    AND es.EncounterDate >= r.EffectiveDateFrom
    AND (es.EncounterDate <= r.EffectiveDateTo OR r.EffectiveDateTo IS NULL)
WHERE es.EncounterStatusId = 18
ORDER BY 
    sd.Name,
    prov_user.LastName,
    prov_user.FirstName,
    s.LastName,
    s.FirstName,
    es.EncounterDate;

-- Query to find encounters currently in status 21 (invoiced) where the most recent status in the history is 21 and was set more than 90 days ago
WITH LatestStatus AS (
    SELECT
        ess.EncounterStudentId,
        ess.EncounterStatusId,
        ess.DateCreated AS StatusDate,
        ROW_NUMBER() OVER (PARTITION BY ess.EncounterStudentId ORDER BY ess.DateCreated DESC) AS rn
    FROM EncounterStudentStatuses ess
)
SELECT
    sd.Name AS SchoolDistrict,
    prov_user.FirstName AS ProviderFirstName,
    prov_user.LastName AS ProviderLastName,
    s.FirstName AS StudentFirstName,
    s.LastName AS StudentLastName,
    s.MedicaidNo AS MedicaidNumber,
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS StudentDOB,
    s.Archived AS StudentArchived,
    e.Archived AS GlobalEncounterArchived,
    es.Archived AS StudentEncounterArchived,
    es.EncounterNumber,
    CONVERT(VARCHAR, es.EncounterDate, 101) AS EncounterDate,
    ls.StatusDate AS LastStatusDate,
    DATEDIFF(DAY, ls.StatusDate, GETDATE()) AS DaysSinceLastStatus
FROM EncounterStudents es
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN Providers prov ON e.ProviderId = prov.Id
JOIN Users prov_user ON prov.ProviderUserId = prov_user.Id
JOIN LatestStatus ls ON ls.EncounterStudentId = es.Id AND ls.rn = 1
WHERE es.EncounterStatusId = 21
    AND ls.EncounterStatusId = 21
    AND DATEDIFF(DAY, ls.StatusDate, GETDATE()) > 90
ORDER BY 
    sd.Name,
    prov_user.LastName,
    prov_user.FirstName,
    s.LastName,
    s.FirstName,
    es.EncounterDate;

