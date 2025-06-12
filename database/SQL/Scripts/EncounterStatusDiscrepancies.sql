DECLARE @DiscrepantStatusLogs table(EncounterStudentId INT, EncounterStatusId INT)

INSERT INTO @DiscrepantStatusLogs
SELECT
	es.Id,
    es.EncounterStatusId
FROM
	encounterstudents es
	JOIN EncounterStudentStatuses ess ON es.id = ess.EncounterStudentId
WHERE ess.DateCreated = (SELECT
		max(DateCreated)
	FROM
		EncounterStudentStatuses
	WHERE EncounterStudentId = es.Id)
	AND ess.EncounterStatusId != es.EncounterStatusId


INSERT INTO EncounterStudentStatuses (CreatedById, DateCreated, EncounterStatusId, EncounterStudentId)
SELECT 1 as CreatedById, GETDATE(), s.EncounterStatusId, s.EncounterStudentId
FROM @DiscrepantStatusLogs s
