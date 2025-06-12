BEGIN TRANSACTION;

-- Update encounters with group CPT codes that only have one student
UPDATE es
SET es.EncounterStatusId = 31
FROM dbo.EncounterStudents es
JOIN dbo.EncounterStudentCptCodes esc ON es.Id = esc.EncounterStudentId
JOIN dbo.CPTCodes c ON esc.CptCodeId = c.Id
JOIN dbo.Encounters e ON es.EncounterId = e.Id
JOIN dbo.Students s ON es.StudentId = s.Id
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN dbo.EncounterStatuses est ON es.EncounterStatusId = est.Id
LEFT JOIN dbo.ClaimsEncounters ce ON es.Id = ce.EncounterStudentId
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
    AND esc.Minutes > 0;

-- Update encounters with individual CPT codes that have multiple students
UPDATE es
SET es.EncounterStatusId = 31
FROM dbo.EncounterStudents es
JOIN dbo.EncounterStudentCptCodes esc ON es.Id = esc.EncounterStudentId
JOIN dbo.CPTCodes c ON esc.CptCodeId = c.Id
JOIN dbo.Encounters e ON es.EncounterId = e.Id
JOIN dbo.Students s ON es.StudentId = s.Id
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN dbo.EncounterStatuses est ON es.EncounterStatusId = est.Id
LEFT JOIN dbo.ClaimsEncounters ce ON es.Id = ce.EncounterStudentId
WHERE 
    (
        e.AdditionalStudents > 0
        OR EXISTS (
            SELECT 1
            FROM dbo.EncounterStudents es2
            WHERE es2.EncounterId = e.Id
            AND es2.StudentDeviationReasonId IS NULL
            AND es2.DateESigned IS NOT NULL
            GROUP BY es2.EncounterId
            HAVING COUNT(DISTINCT StudentId) > 1
        )
    )
    AND es.ESignedById IS NOT NULL
    AND es.DateESigned IS NOT NULL
    AND es.StudentDeviationReasonId IS NULL
    AND c.Code NOT IN ('90853', '92508', '96164', '96165', '97150')
    AND ce.PaidAmount IS NOT NULL
    AND CAST(ce.PaidAmount AS decimal(10,2)) > 0
    AND d.Id != 125
    AND est.Id NOT IN (31, 34)
    AND esc.Minutes IS NOT NULL
    AND esc.Minutes > 0;

-- Insert records into EncounterStudentStatuses for group CPT codes with one student
INSERT INTO dbo.EncounterStudentStatuses (EncounterStudentId, EncounterStatusId)
SELECT DISTINCT es.Id, 31
FROM dbo.EncounterStudents es
JOIN dbo.EncounterStudentCptCodes esc ON es.Id = esc.EncounterStudentId
JOIN dbo.CPTCodes c ON esc.CptCodeId = c.Id
JOIN dbo.Encounters e ON es.EncounterId = e.Id
JOIN dbo.Students s ON es.StudentId = s.Id
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN dbo.EncounterStatuses est ON es.EncounterStatusId = est.Id
LEFT JOIN dbo.ClaimsEncounters ce ON es.Id = ce.EncounterStudentId
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
    AND NOT EXISTS (
        SELECT 1 
        FROM dbo.EncounterStudentStatuses ess 
        WHERE ess.EncounterStudentId = es.Id 
        AND ess.EncounterStatusId = 31
        AND ess.Id = (
            SELECT TOP 1 ess2.Id
            FROM dbo.EncounterStudentStatuses ess2
            WHERE ess2.EncounterStudentId = es.Id
            ORDER BY ess2.Id DESC
        )
    );

-- Insert records into EncounterStudentStatuses for individual CPT codes with multiple students
INSERT INTO dbo.EncounterStudentStatuses (EncounterStudentId, EncounterStatusId)
SELECT DISTINCT es.Id, 31
FROM dbo.EncounterStudents es
JOIN dbo.EncounterStudentCptCodes esc ON es.Id = esc.EncounterStudentId
JOIN dbo.CPTCodes c ON esc.CptCodeId = c.Id
JOIN dbo.Encounters e ON es.EncounterId = e.Id
JOIN dbo.Students s ON es.StudentId = s.Id
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN dbo.EncounterStatuses est ON es.EncounterStatusId = est.Id
LEFT JOIN dbo.ClaimsEncounters ce ON es.Id = ce.EncounterStudentId
WHERE 
    (
        e.AdditionalStudents > 0
        OR EXISTS (
            SELECT 1
            FROM dbo.EncounterStudents es2
            WHERE es2.EncounterId = e.Id
            AND es2.StudentDeviationReasonId IS NULL
            AND es2.DateESigned IS NOT NULL
            GROUP BY es2.EncounterId
            HAVING COUNT(DISTINCT StudentId) > 1
        )
    )
    AND es.ESignedById IS NOT NULL
    AND es.DateESigned IS NOT NULL
    AND es.StudentDeviationReasonId IS NULL
    AND c.Code NOT IN ('90853', '92508', '96164', '96165', '97150')
    AND ce.PaidAmount IS NOT NULL
    AND CAST(ce.PaidAmount AS decimal(10,2)) > 0
    AND d.Id != 125
    AND est.Id NOT IN (31, 34)
    AND esc.Minutes IS NOT NULL
    AND esc.Minutes > 0
    AND NOT EXISTS (
        SELECT 1 
        FROM dbo.EncounterStudentStatuses ess 
        WHERE ess.EncounterStudentId = es.Id 
        AND ess.EncounterStatusId = 31
        AND ess.Id = (
            SELECT TOP 1 ess2.Id
            FROM dbo.EncounterStudentStatuses ess2
            WHERE ess2.EncounterStudentId = es.Id
            ORDER BY ess2.Id DESC
        )
    );

COMMIT TRANSACTION;