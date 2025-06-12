-- Provider Report Query
WITH LatestAssignment AS (
    SELECT 
        Id as ProviderEscAssignmentId,
        ProviderId,
        EscId,
        StartDate as AssignmentStartDate,
        EndDate as AssignmentEndDate,
        ROW_NUMBER() OVER (PARTITION BY ProviderId ORDER BY StartDate DESC) as AssignmentRank
    FROM [dbo].[ProviderEscAssignments]
    WHERE Archived = 0
),
ProviderSchoolDistricts AS (
    SELECT 
        pea.ProviderId,
        CASE 
            WHEN COUNT(DISTINCT sd.Name) > 1 THEN 'Multiple'
            ELSE MAX(sd.Name)
        END as SchoolDistrictName
    FROM [dbo].[ProviderEscAssignments] pea
    INNER JOIN [dbo].[ProviderEscSchoolDistricts] pesd ON pea.Id = pesd.ProviderEscAssignmentId
    INNER JOIN [dbo].[SchoolDistricts] sd ON pesd.SchoolDistrictId = sd.Id
    WHERE pea.Archived = 0
    GROUP BY pea.ProviderId
),
ProviderInfo AS (
    SELECT 
        p.Id as ProviderId,
        u.FirstName,
        u.LastName,
        u.Email,
        pt.Name as Title,
        pet.Name as EmploymentType,
        poc.CertificationNumber as ODECertification,
        CASE WHEN la.EscId IS NOT NULL THEN e.Name ELSE NULL END as ESCName,
        psd.SchoolDistrictName,
        la.AssignmentStartDate,
        la.AssignmentEndDate
    FROM [dbo].[Providers] p
    INNER JOIN [dbo].[Users] u ON p.ProviderUserId = u.Id
    INNER JOIN [dbo].[ProviderTitles] pt ON p.TitleId = pt.Id
    INNER JOIN [dbo].[ProviderEmploymentTypes] pet ON p.ProviderEmploymentTypeId = pet.Id
    LEFT JOIN [dbo].[ProviderODECertifications] poc ON p.Id = poc.ProviderId
    LEFT JOIN LatestAssignment la ON p.Id = la.ProviderId AND la.AssignmentRank = 1
    LEFT JOIN [dbo].[Escs] e ON la.EscId = e.Id
    LEFT JOIN ProviderSchoolDistricts psd ON p.Id = psd.ProviderId
    WHERE 
        p.Archived = 0
        AND p.TitleId IN (7, 27, 42)  -- School Psychologist, Licensed Psychologist, Professional Pupil Service License Holder - School Psychologist
        AND la.AssignmentStartDate <= GETUTCDATE()
        AND (la.AssignmentEndDate IS NULL OR la.AssignmentEndDate > GETUTCDATE())
)
SELECT DISTINCT
    pi.LastName,
    pi.FirstName,
    pi.Title,
    pi.ODECertification,
    pi.EmploymentType,
    pi.Email,
    pi.ESCName,
    pi.SchoolDistrictName,
    FORMAT(pi.AssignmentStartDate, 'MM/dd/yyyy') as AssignmentStartDate,
    FORMAT(pi.AssignmentEndDate, 'MM/dd/yyyy') as AssignmentEndDate,
    FORMAT(pid.ProviderInactivityStartDate, 'MM/dd/yyyy') as DoNotBillStartDate,
    FORMAT(pid.ProviderInactivityEndDate, 'MM/dd/yyyy') as DoNotBillEndDate,
    pdnbr.Name as DoNotBillReason
FROM ProviderInfo pi
LEFT JOIN [dbo].[ProviderInactivityDates] pid ON pi.ProviderId = pid.ProviderId AND pid.Archived = 0
LEFT JOIN [dbo].[ProviderDoNotBillReasons] pdnbr ON pid.ProviderDoNotBillReasonId = pdnbr.Id
ORDER BY 
    pi.LastName,
    pi.FirstName;
