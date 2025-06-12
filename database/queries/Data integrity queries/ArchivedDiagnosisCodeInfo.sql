-- Get all archived Diagnosis Codes
SELECT * FROM DiagnosisCodes dc
WHERE dc.Archived = 1;

-- Student Case Loads (Plans) with archived Diagnosis Codes
SELECT
	sd.Name AS 'District Name',
	s.FirstName AS 'Student First',
	s.LastName AS 'Student Last',
	s.DateOfBirth AS 'Student DOB',
	s.Archived AS 'Student Archived',
	cl.Archived AS 'Plan Archived',
	dc.Code,
	dc.Description
FROM CaseLoads cl
JOIN Students s ON cl.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN DiagnosisCodes dc ON cl.DiagnosisCodeId = dc.Id
WHERE dc.Archived = 1
ORDER BY
	sd.Name,
	s.LastName,
	s.FirstName;

-- Student Case Load (Plan) Scripts (Prescriptions) with archived Diagnosis Codes
SELECT
	sd.Name AS 'District Name',
	s.FirstName AS 'Student First',
	s.LastName AS 'Student Last',
	s.DateOfBirth AS 'Student DOB',
	s.Archived AS 'Student Archived',
	cl.Archived AS 'Plan Archived',
	cls.Archived AS 'Prescription Archived',
	cls.InitiationDate AS 'Prescription Start',
	cls.ExpirationDate AS 'Prescription End',
	dc.Code,
	dc.Description
FROM CaseLoads cl
JOIN Students s ON cl.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
JOIN DiagnosisCodes dc ON cl.DiagnosisCodeId = dc.Id
JOIN CaseLoadScripts cls ON cls.CaseLoadId = cl.Id
WHERE dc.Archived = 1
ORDER BY
	sd.Name,
	s.LastName,
	s.FirstName;

-- Encounter data with archived Diagnosis Codes
SELECT
	sd.Name AS 'District Name',
	s.FirstName AS 'Student First',
	s.LastName AS 'Student Last',
	s.DateOfBirth AS 'Student DOB',
	s.Archived AS 'Student Archived',
	e.Archived AS 'Global Encounter Archived',
	es.Archived AS 'Student Encounter Archived',
	dc2.Code AS 'Global Encounter Diag Code',
	dc2.Description AS 'Global Encounter Diag Desc',
	dc.Code AS 'Student Encounter Diag Code',
	dc.Description AS 'Student Encounter Diag Desc',
	estat.Name AS 'Status'
FROM EncounterStudents es
JOIN Encounters e ON es.EncounterId = e.Id
JOIN Students s ON es.StudentId = s.Id
JOIN SchoolDistricts sd ON s.DistrictId = sd.Id
LEFT JOIN DiagnosisCodes dc ON es.DiagnosisCodeId = dc.Id
LEFT JOIN DiagnosisCodes dc2 ON e.DiagnosisCodeId = dc2.Id
JOIN EncounterStatuses estat ON es.EncounterStatusId = estat.Id
WHERE (dc.Archived = 1 OR dc2.Archived = 1)
  AND (es.DiagnosisCodeId IS NOT NULL OR e.DiagnosisCodeId IS NOT NULL)
ORDER BY
	sd.Name,
	s.LastName,
	s.FirstName;

-- Diagnosis Code Associations with archived Diagnosis Codes
SELECT
    dca.Id AS 'Association ID',
    dc.Code AS 'Diagnosis Code',
    dc.Description AS 'Diagnosis Description',
    sc.Code AS 'Service Code',
    st.Name AS 'Service Type',
    dca.Archived AS 'Association Archived',
    dca.DateCreated AS 'Date Created',
    dca.DateModified AS 'Date Modified'
FROM DiagnosisCodeAssociations dca
JOIN DiagnosisCodes dc ON dca.DiagnosisCodeId = dc.Id
JOIN ServiceCodes sc ON dca.ServiceCodeId = sc.Id
JOIN ServiceTypes st ON dca.ServiceTypeId = st.Id
WHERE dc.Archived = 1
ORDER BY
    dc.Code,
    sc.Code,
    st.Name;
