-- Comprehensive query to find all encounters where the current status differs from the latest status log entry
-- Shows school district, provider, student, and status details for analysis
-- This is useful for identifying status synchronization issues in the system

SELECT 
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
    current_status.Name AS CurrentStatus,
    log_status.Name AS LatestLogStatus,
    CONVERT(VARCHAR, latest_status.DateCreated, 101) AS StatusLogDate,
    u.FirstName + ' ' + u.LastName AS StatusChangedBy
FROM 
    dbo.EncounterStudents es
JOIN 
    dbo.EncounterStatuses current_status ON es.EncounterStatusId = current_status.Id
JOIN 
    dbo.Students s ON es.StudentId = s.Id
JOIN 
    dbo.SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN 
    dbo.Encounters e ON es.EncounterId = e.Id
JOIN 
    dbo.Providers p ON e.ProviderId = p.Id
JOIN 
    dbo.Users prov_user ON p.ProviderUserId = prov_user.Id
JOIN 
    (
        -- Get the most recent status log entry for each encounter student
        SELECT 
            ess.EncounterStudentId,
            ess.EncounterStatusId,
            ess.DateCreated,
            ess.CreatedById
        FROM 
            dbo.EncounterStudentStatuses ess
        INNER JOIN 
            (
                SELECT 
                    EncounterStudentId, 
                    MAX(DateCreated) AS MaxDate
                FROM 
                    dbo.EncounterStudentStatuses
                GROUP BY 
                    EncounterStudentId
            ) AS latest ON ess.EncounterStudentId = latest.EncounterStudentId 
            AND ess.DateCreated = latest.MaxDate
    ) AS latest_status ON es.Id = latest_status.EncounterStudentId
JOIN 
    dbo.EncounterStatuses log_status ON latest_status.EncounterStatusId = log_status.Id
LEFT JOIN
    dbo.Users u ON latest_status.CreatedById = u.Id
WHERE 
    -- Only show if current status doesn't match any of the latest statuses
    NOT EXISTS (
        SELECT 1
        FROM dbo.EncounterStudentStatuses ess
        INNER JOIN (
            SELECT 
                EncounterStudentId, 
                MAX(DateCreated) AS MaxDate
            FROM 
                dbo.EncounterStudentStatuses
            GROUP BY 
                EncounterStudentId
        ) AS latest ON ess.EncounterStudentId = latest.EncounterStudentId 
            AND ess.DateCreated = latest.MaxDate
        WHERE ess.EncounterStudentId = es.Id
            AND ess.EncounterStatusId = es.EncounterStatusId
    )
ORDER BY 
    latest_status.DateCreated DESC; 
