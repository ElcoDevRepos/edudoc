WITH DateRange AS (
    SELECT CAST('2024-07-01' AS DATE) AS MonthStart
    UNION ALL
    SELECT DATEADD(MONTH, 1, MonthStart)
    FROM DateRange
    WHERE DATEADD(MONTH, 1, MonthStart) <= CAST(GETDATE() AS DATE)
),
MonthsTable AS (
    SELECT FORMAT(MonthStart, 'yyyy-MM') AS MonthFormat, MonthStart
    FROM DateRange
),
ProviderAssignments AS (
    SELECT 
        esc.Id AS EscId,
        esc.Name AS EscName,
        p.Id AS ProviderId,
        u.LastName AS ProviderLast,
        u.FirstName AS ProviderFirst,
        pt.Name AS ProviderTitle,
        d.Id AS DistrictId,
        d.Name AS DistrictName,
        st.Id AS ServiceTypeId,
        st.Name AS ServiceTypeName
    FROM 
        Escs esc
    INNER JOIN ProviderEscAssignments pea ON pea.EscId = esc.Id
    INNER JOIN ProviderEscSchoolDistricts pesd ON pesd.ProviderEscAssignmentId = pea.Id
    INNER JOIN SchoolDistricts d ON d.Id = pesd.SchoolDistrictId
    INNER JOIN Providers p ON p.Id = pea.ProviderId
    INNER JOIN ProviderTitles pt ON p.TitleId = pt.Id
    INNER JOIN Users u ON u.Id = p.ProviderUserId
    CROSS JOIN ServiceTypes st
    WHERE 
        esc.Name IN (
            'Ashtabula County ESC',
            'ESC of Eastern Ohio',
            'ESC of the Western Reserve',
            'Greene ESC',
            'North Point ESC',
            'Northwest Ohio ESC'
        )
        AND p.Archived = 0
        AND (
            (pea.StartDate IS NULL OR pea.StartDate <= GETDATE())
            AND (pea.EndDate IS NULL OR pea.EndDate >= '2024-07-01')
        )
        AND pea.Archived = 0
),
DistrictResults AS (
    -- First query with district breakdown
    SELECT
        pa.EscName AS 'ESC Name',
        pa.ProviderLast AS 'Provider Last',
        pa.ProviderFirst AS 'Provider First',
        pa.ProviderTitle AS 'Provider Title',
        pa.DistrictName AS 'School District',
        pa.ServiceTypeName AS 'Service Type',
        m.MonthFormat AS 'Month',
        COUNT(DISTINCT CASE 
            WHEN s.DistrictId = pa.DistrictId THEN es.Id 
            ELSE NULL 
        END) AS 'Count'
    FROM
        ProviderAssignments pa
    CROSS JOIN
        MonthsTable m
    LEFT JOIN Encounters e ON 
        e.ProviderId = pa.ProviderId 
        AND e.ServiceTypeId = pa.ServiceTypeId
        AND e.Archived = 0
        AND FORMAT(e.EncounterDate, 'yyyy-MM') = m.MonthFormat
    LEFT JOIN EncounterStudents es ON 
        es.EncounterId = e.Id 
        AND es.Archived = 0
        AND es.EncounterStatusId NOT IN (12, 13, 14, 15, 26, 8)
    LEFT JOIN Students s ON 
        s.Id = es.StudentId 
        AND s.Archived = 0
    GROUP BY
        pa.EscName,
        pa.ProviderLast,
        pa.ProviderFirst,
        pa.ProviderTitle,
        pa.DistrictName,
        pa.ServiceTypeName,
        m.MonthFormat
),
ServiceResults AS (
    -- Second query without district breakdown
    SELECT
        pa.EscName AS 'ESC Name',
        pa.ProviderLast AS 'Provider Last',
        pa.ProviderFirst AS 'Provider First',
        pa.ProviderTitle AS 'Provider Title',
        pa.ServiceTypeName AS 'Service Type',
        m.MonthFormat AS 'Month',
        COUNT(DISTINCT es.Id) AS 'Count'
    FROM
        ProviderAssignments pa
    CROSS JOIN
        MonthsTable m
    LEFT JOIN Encounters e ON 
        e.ProviderId = pa.ProviderId 
        AND e.ServiceTypeId = pa.ServiceTypeId
        AND e.Archived = 0
        AND FORMAT(e.EncounterDate, 'yyyy-MM') = m.MonthFormat
    LEFT JOIN EncounterStudents es ON 
        es.EncounterId = e.Id 
        AND es.Archived = 0
        AND es.EncounterStatusId NOT IN (12, 13, 14, 15, 26, 8)
    LEFT JOIN Students s ON 
        s.Id = es.StudentId 
        AND s.DistrictId = pa.DistrictId
        AND s.Archived = 0
    GROUP BY
        pa.EscName,
        pa.ProviderLast,
        pa.ProviderFirst,
        pa.ProviderTitle,
        pa.ServiceTypeName,
        m.MonthFormat
)

-- Comment/uncomment to toggle between district and service results

-- Output district results
SELECT * FROM DistrictResults
ORDER BY
    [ESC Name],
    [Provider Last],
    [Provider First],
    [School District],
    [Service Type],
    [Month];

-- -- Output service results
-- SELECT * FROM ServiceResults
-- ORDER BY
--     [ESC Name],
--     [Provider Last],
--     [Provider First],
--     [Service Type],
--     [Month];
