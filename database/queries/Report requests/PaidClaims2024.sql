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
    p.NPI AS 'NPI Number'
FROM dbo.EncounterStudents es
JOIN dbo.EncounterStatuses estat ON es.EncounterStatusId = estat.Id
JOIN dbo.Students s ON es.StudentId = s.Id
JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
JOIN dbo.Encounters e ON es.EncounterId = e.Id
JOIN dbo.Providers p ON e.ProviderId = p.Id
JOIN ProviderTitles pt ON p.TitleId = pt.Id
JOIN dbo.Users u ON p.ProviderUserId = u.Id
JOIN dbo.ClaimsEncounters ce ON es.Id = ce.EncounterStudentId
LEFT JOIN (
    -- Subquery to select one license per provider with preference for non-"cond" licenses
    SELECT 
        pl.ProviderId,
        pl.License
    FROM dbo.ProviderLicenses pl
    WHERE pl.Id IN (
        -- For each provider, select the license ID based on priority
        SELECT TOP 1 pl2.Id
        FROM dbo.ProviderLicenses pl2
        WHERE pl2.ProviderId = pl.ProviderId
        ORDER BY 
            -- Prioritize licenses that don't start with "cond"
            CASE WHEN pl2.License NOT LIKE 'cond%' THEN 0 ELSE 1 END,
            -- Then by expiration date (most recent first)
            pl2.ExpirationDate DESC
    )
) pl ON p.Id = pl.ProviderId
LEFT JOIN dbo.ServiceCodes sc ON pt.ServiceCodeId = sc.Id
LEFT JOIN dbo.ServiceTypes st ON e.ServiceTypeId = st.Id
WHERE 
    es.EncounterDate BETWEEN '2023-07-01' AND '2024-06-30'
    AND es.EncounterStatusId = 22
    AND ce.ClaimId IS NOT NULL
    AND ce.PaidAmount <> '0'
ORDER BY 
    [District Name],
    [Student Last Name],
    [Student First Name],
    [Session Date];

WITH RankedClaims AS (
    SELECT 
        d.Name AS 'District Name',
        CONVERT(VARCHAR, ce.VoucherDate, 110) AS 'Voucher Date',
        CONVERT(VARCHAR, es.EncounterDate, 110) AS 'Session Date',
        es.EncounterNumber AS 'Encounter No',
        s.FirstName + ' ' + s.LastName AS 'Student Name',
        ce.ReferenceNumber AS 'EDI Claim No',
        ce.ClaimId AS 'TCN',
        p.NPI AS 'Provider NPI',
        s.MedicaidNo AS 'Medicaid #',
        ce.ProcedureIdentifier AS 'CPT Code',
        u.FirstName + ' ' + u.LastName AS 'Provider Name',
        ROW_NUMBER() OVER (PARTITION BY es.EncounterNumber ORDER BY ce.VoucherDate DESC) as rn
    FROM dbo.EncounterStudents es
    JOIN dbo.Students s ON es.StudentId = s.Id
    JOIN dbo.SchoolDistricts d ON s.DistrictId = d.Id
    JOIN dbo.Encounters e ON es.EncounterId = e.Id
    JOIN dbo.Providers p ON e.ProviderId = p.Id
    JOIN dbo.Users u ON p.ProviderUserId = u.Id
    JOIN dbo.ClaimsEncounters ce ON es.Id = ce.EncounterStudentId
    WHERE 
        ce.EdiErrorCodeId = 184
        AND es.EncounterDate >= '2024-04-30'
        AND es.EncounterStatusId = 22  -- Ready for Billing status
        AND EXISTS (
            SELECT 1 
            FROM dbo.EncounterStatusHistory esh
            WHERE esh.EncounterStudentId = es.Id
            AND esh.EncounterStatusId = 21  -- Invoiced & Denied status
        )
)
SELECT 
    [District Name],
    [Voucher Date],
    [Session Date],
    [Encounter No],
    [Student Name],
    [EDI Claim No],
    [TCN],
    [Provider NPI],
    [Medicaid #],
    [CPT Code],
    [Provider Name]
FROM RankedClaims
WHERE rn = 1
ORDER BY 
    [District Name],
    [Voucher Date],
    [Session Date],
    [Encounter No];
