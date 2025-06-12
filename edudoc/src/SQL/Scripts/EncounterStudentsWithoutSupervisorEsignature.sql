update EncounterStudents
set EncounterStatusId = 9
where Id in (select
es.Id
 from EncounterStudents es
join users u on u.Id = es.ESignedById
join providers p on p.ProviderUserId = u.Id
join ProviderTitles pt on pt.Id = p.TitleId
where es.Archived = 0 and es.EncounterStatusId in (2,30) and es.ESignedById is not null and es.SupervisorESignedById is null
and u.Archived = 0
and p.Archived = 0
and pt.SupervisorTitleId is not null)

