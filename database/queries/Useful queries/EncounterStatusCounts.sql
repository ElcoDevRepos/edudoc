SELECT
	es.Id,
    es.Name AS StatusName,
    COUNT(*) AS EncounterCount
FROM EncounterStudents enc_student
JOIN EncounterStatuses es ON enc_student.EncounterStatusId = es.Id
WHERE enc_student.Archived = 0
GROUP BY es.Name, es.Id
ORDER BY EncounterCount DESC;