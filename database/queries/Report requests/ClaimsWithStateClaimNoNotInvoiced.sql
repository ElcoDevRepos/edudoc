SELECT DISTINCT
    CAST(d.Id AS VARCHAR(50)) AS 'District ID',
    d.Name AS 'District Name',
    CAST(s.Id AS VARCHAR(50)) AS 'Student ID',
    s.FirstName AS 'Student First Name',
    s.LastName AS 'Student Last Name',
    CAST(s.StudentCode AS VARCHAR(50)) AS 'Student Code',
    CONVERT(VARCHAR, s.DateOfBirth, 110) AS 'Student Birthdate',
    s.MedicaidNo AS 'Medicaid No',
    ce.ReferenceNumber AS 'EDI Claim No',
    ce.ProcedureIdentifier AS 'CPT Code',
    CONVERT(VARCHAR, es.EncounterDate, 110) AS 'Session Date',
    ce.BillingUnits AS 'Service Units',
    COALESCE(sc.Name, 'Treatment') AS 'Service Desc',
    st.Name AS 'Service Type Desc',
    ce.BillingUnits AS 'Units Paid',
    ce.PaidAmount AS 'Paid Amount',
    CONVERT(VARCHAR, ce.VoucherDate, 110) AS 'Voucher Date',
    es.EncounterNumber AS 'Encounter No',
    ce.ClaimId AS 'State Claim No',
    CAST(p.Id AS VARCHAR(50)) AS 'Provider ID',
    u.FirstName AS 'Provider First Name',
    u.LastName AS 'Provider Last Name',
    pl.License AS 'License No',
    p.NPI AS 'NPI Number',
    estat.Id AS 'Status ID',
    estat.Name AS 'Status Name'
FROM dbo.EncounterStudents es
JOIN dbo.EncounterStatuses estat ON es.EncounterStatusId = estat.Id
JOIN dbo.Students s ON es.StudentId = s.Id
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN dbo.Encounters e ON es.EncounterId = e.Id
JOIN dbo.Providers p ON e.ProviderId = p.Id
JOIN ProviderTitles pt ON p.TitleId = pt.Id
JOIN dbo.Users u ON p.ProviderUserId = u.Id
JOIN dbo.ClaimsEncounters ce ON es.Id = ce.EncounterStudentId
LEFT JOIN dbo.ProviderLicenses pl ON p.Id = pl.ProviderId
LEFT JOIN dbo.ServiceCodes sc ON pt.ServiceCodeId = sc.Id
LEFT JOIN dbo.ServiceTypes st ON e.ServiceTypeId = st.Id
WHERE 
    es.EncounterDate BETWEEN '2023-07-01' AND '2024-06-30'
    AND ce.ClaimId IS NOT NULL
    AND es.EncounterStatusId NOT IN (22, 23)  -- Not in expected statuses
    AND es.Archived = 0  -- Filter out archived encounter students
    AND e.Archived = 0   -- Filter out archived encounters
    AND s.Archived = 0   -- Filter out archived students
    AND p.Archived = 0   -- Filter out archived providers
    AND d.Archived = 0   -- Filter out archived districts (if this column exists)
ORDER BY 
    estat.Name,
    [District Name],
    [Student Last Name],
    [Student First Name],
    [Session Date];