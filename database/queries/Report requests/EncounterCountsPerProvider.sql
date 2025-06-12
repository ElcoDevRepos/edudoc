SELECT 
    sd.Name AS 'District',
    u.LastName AS 'Provider Last Name',
    u.FirstName AS 'Provider First Name',
    p.Id AS 'Provider ID',
    sc.Name AS 'Service Area',  -- Using ServiceCode.Name as the service area
    pet.Name AS 'Employment Type',
    CASE WHEN p.Archived = 1 THEN 'Yes' ELSE 'No' END AS 'Provider Archived',
    COUNT(DISTINCT es.Id) AS 'Number of Encounters'
FROM dbo.Providers p
INNER JOIN dbo.Users u ON p.ProviderUserId = u.Id
INNER JOIN dbo.ProviderTitles pt ON p.TitleId = pt.Id
INNER JOIN dbo.ServiceCodes sc ON pt.ServiceCodeId = sc.Id  -- Join to ServiceCodes
INNER JOIN dbo.ProviderEmploymentTypes pet ON p.ProviderEmploymentTypeId = pet.Id  -- Join to ProviderEmploymentTypes
INNER JOIN dbo.Encounters e ON p.Id = e.ProviderId
INNER JOIN dbo.EncounterStudents es ON e.Id = es.EncounterId
INNER JOIN dbo.Students s ON es.StudentId = s.Id
INNER JOIN dbo.SchoolDistricts sd ON s.DistrictId = sd.Id
WHERE 
    e.EncounterDate BETWEEN '2023-07-01' AND '2024-06-30'
    AND e.Archived = 0
    AND es.Archived = 0
GROUP BY
    sd.Name,
    u.LastName,
    u.FirstName,
    p.Id,
    sc.Name,
    pet.Name,
    p.Archived
ORDER BY 
    sd.Name,
    u.LastName,
    u.FirstName,
    sc.Name;