SELECT
es.Id,
	es.EncounterNumber,
	es.EncounterDate,
	s.FirstName AS 'Student First',
	s.LastName AS 'Student Last',
	cc.Code AS 'CPT Code',
	ce.ClaimAmount AS 'Claim Amount',
	ce.ClaimId AS 'State Claim ID',
	ce.ReferenceNumber AS 'ReferenceNumber',
	ce.BillingUnits,
	ce.PaidAmount AS 'Paid Amount',
	ce.VoucherDate,
	eec.Name AS 'Edi Code',
	es2.Name AS 'Encounter Status'
FROM EncounterStudents es
LEFT JOIN ClaimsEncounters ce ON ce.EncounterStudentId = es.Id
LEFT JOIN Students s ON s.Id = es.StudentId
LEFT JOIN EncounterStudentCptCodes escc ON escc.Id = ce.EncounterStudentCptCodeId
LEFT JOIN CPTCodes cc ON cc.Id = escc.CptCodeId
LEFT JOIN EdiErrorCodes eec ON eec.Id = ce.EdiErrorCodeId
LEFT JOIN EncounterStatuses es2 ON es2.Id = es.EncounterStatusId
WHERE es.EncounterNumber IN ()
