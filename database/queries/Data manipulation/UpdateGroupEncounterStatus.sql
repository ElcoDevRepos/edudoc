-- Update script for encounters incorrectly marked as group when they're individual sessions
-- This script sets the encounter status to 31 and adds corresponding records in EncounterStudentStatuses

-- First, let's create a temporary table with the encounter student IDs we need to update
-- This query is based on GroupVsIndividualEncounterIssues_Query1.sql
WITH EncountersToUpdate AS (
    SELECT DISTINCT es.Id AS EncounterStudentId
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
        AND c.Code IN ('90853', '92508', '96164', '97150')
        AND (es.EncounterStatusId = 22 OR ess.EncounterStatusId = 22)
        AND ce.PaidAmount IS NOT NULL
        AND CAST(ce.PaidAmount AS DECIMAL(18,2)) > 0
        AND EXISTS (
            SELECT 1
            FROM dbo.EncounterStudents es2
            WHERE es2.EncounterId = e.Id
            AND es2.StudentDeviationReasonId IS NULL
            GROUP BY es2.EncounterId
            HAVING COUNT(DISTINCT StudentId) = 1
        )
)

-- Begin transaction for safety
BEGIN TRANSACTION;

-- Print the count of records we're going to update
DECLARE @UpdateCount INT;
SELECT @UpdateCount = COUNT(*) FROM EncountersToUpdate;
PRINT 'Number of encounter students to update: ' + CAST(@UpdateCount AS VARCHAR);

-- Update the EncounterStatusId to 31 in EncounterStudents table
UPDATE es
SET es.EncounterStatusId = 31
FROM dbo.EncounterStudents es
JOIN EncountersToUpdate etu ON es.Id = etu.EncounterStudentId;

-- Insert records into EncounterStudentStatuses table
INSERT INTO dbo.EncounterStudentStatuses (
    EncounterStudentId,
    EncounterStatusId,
    CreatedById,
    DateCreated
)
SELECT 
    etu.EncounterStudentId,
    31, -- Status ID 31
    1,  -- Default CreatedById (replace with appropriate user ID if needed)
    GETUTCDATE() -- Current date/time
FROM EncountersToUpdate etu;

-- Uncomment the following line to commit the transaction
-- COMMIT TRANSACTION;

-- Comment out the following line if you want to commit the transaction
ROLLBACK TRANSACTION;

-- Print a message to indicate that this is a test run by default
PRINT 'This was a test run. The transaction was rolled back.';
PRINT 'To actually perform the updates, uncomment the COMMIT line and comment out the ROLLBACK line.'; 