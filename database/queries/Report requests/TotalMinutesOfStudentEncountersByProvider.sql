SELECT 
    u.FirstName AS 'Provider First Name',
    u.LastName AS 'Provider Last Name',
    s.FirstName AS 'Student First Name',
    s.LastName AS 'Student Last Name',
    SUM(DATEDIFF(MINUTE, e.EncounterStartTime, e.EncounterEndTime)) AS 'Total Minutes',
    COUNT(*) AS 'Number of Encounters'
FROM dbo.SchoolDistricts sd
INNER JOIN dbo.Students s ON sd.Id = s.DistrictId
INNER JOIN dbo.EncounterStudents es ON s.Id = es.StudentId
INNER JOIN dbo.Encounters e ON es.EncounterId = e.Id
INNER JOIN dbo.Providers p ON e.ProviderId = p.Id
INNER JOIN dbo.Users u ON p.ProviderUserId = u.Id
INNER JOIN dbo.ProviderTitles pt ON p.TitleId = pt.Id
WHERE 
    sd.Id = 160
    AND e.EncounterDate BETWEEN '2023-07-01' AND '2024-06-30'
    AND s.Archived = 0
    AND es.Archived = 0
    AND e.Archived = 0
GROUP BY
    u.FirstName,
    u.LastName,
    s.FirstName,
    s.LastName
ORDER BY 
    u.LastName,
    u.FirstName,
    s.LastName,
    s.FirstName;