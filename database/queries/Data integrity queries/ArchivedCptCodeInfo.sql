-- Get all archived CPT Codes
SELECT * FROM CPTCodes c
WHERE c.Archived = 1;

-- Encounters with archived CPT Codes
SELECT
    sd.Name AS 'District Name',
    s.FirstName AS 'Student First',
    s.LastName AS 'Student Last',
    s.DateOfBirth AS 'Student DOB',
    s.Archived AS 'Student Archived',
    e.Archived AS 'Global Encounter Archived',
    es.Archived AS 'Student Encounter Archived',
    c.Code AS 'CPT Code',
    c.Description AS 'CPT Description',
    estat.Name AS 'Status'
FROM EncounterStudentCptCodes escc
JOIN EncounterStudents es ON escc.EncounterStudentId = es.Id
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN CPTCodes c ON escc.CptCodeId = c.Id
JOIN EncounterStatuses estat ON es.EncounterStatusId = estat.Id
WHERE c.Archived = 1
ORDER BY
    sd.Name,
    s.LastName,
    s.FirstName;

-- CPT Code Associations with archived CPT Codes
SELECT
    cca.Id AS 'Association ID',
    c.Code AS 'CPT Code',
    c.Description AS 'CPT Description',
    sc.Code AS 'Service Code',
    st.Name AS 'Service Type',
    cca.Archived AS 'Association Archived',
    cca.DateCreated AS 'Date Created',
    cca.DateModified AS 'Date Modified'
FROM CPTCodeAssocations cca
JOIN CPTCodes c ON cca.CPTCodeId = c.Id
JOIN ServiceCodes sc ON cca.ServiceCodeId = sc.Id
JOIN ServiceTypes st ON cca.ServiceTypeId = st.Id
WHERE c.Archived = 1
ORDER BY
    c.Code,
    sc.Code,
    st.Name;

-- Service Unit Rules with archived CPT Codes
SELECT
    sur.Id AS 'Rule ID',
    sur.Name AS 'Rule Name',
    sur.Description AS 'Rule Description',
    c.Code AS 'CPT Code',
    c.Description AS 'CPT Description',
    sur.Archived AS 'Rule Archived',
    sur.DateCreated AS 'Date Created',
    sur.DateModified AS 'Date Modified'
FROM ServiceUnitRules sur
JOIN CPTCodes c ON sur.CptCodeId = c.Id
WHERE c.Archived = 1
ORDER BY
    c.Code,
    sur.Name;

-- Billing Schedule Exclusions with archived CPT Codes
SELECT
    bsec.Id AS 'Exclusion ID',
    bs.Name AS 'Billing Schedule',
    c.Code AS 'CPT Code',
    c.Description AS 'CPT Description',
    bsec.DateCreated AS 'Date Created'
FROM BillingScheduleExcludedCptCodes bsec
JOIN CPTCodes c ON bsec.CptCodeId = c.Id
JOIN BillingSchedules bs ON bsec.BillingScheduleId = bs.Id
WHERE c.Archived = 1
ORDER BY
    bs.Name,
    c.Code; 