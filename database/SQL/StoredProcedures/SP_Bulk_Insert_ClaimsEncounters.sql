CREATE PROCEDURE [dbo].[SP_Bulk_Insert_ClaimsEncounters]
	@ClaimsEncounterData ClaimsEncounterData READONLY
AS

BEGIN

    INSERT INTO [dbo].[ClaimsEncounters]
	(
        [ClaimAmount],
        [ProcedureIdentifier],
        [BillingUnits],
        [ServiceDate],
        [PhysicianFirstName],
        [PhysicianLastName],
        [PhysicianId],
        [ReferringProviderFirstName],
        [ReferringProviderLastName],
        [ReasonForServiceCode],
        [ReferringProviderId],
        [IsTelehealth],
        [ClaimsStudentId],
        [EncounterStudentId],
        [EncounterStudentCptCodeId],
        [ControlNumberPrefix]
    )
    OUTPUT Inserted.Id as InsertedId
    SELECT
        [ClaimAmount],
        [ProcedureIdentifier],
        [BillingUnits],
        [ServiceDate],
        [PhysicianFirstName],
        [PhysicianLastName],
        [PhysicianId],
        [ReferringProviderFirstName],
        [ReferringProviderLastName],
        [ReasonForServiceCode],
        [ReferringProviderId],
        [IsTelehealth],
        [ClaimsStudentId],
        [EncounterStudentId],
        [EncounterStudentCptCodeId],
        [ControlNumberPrefix]
    FROM @ClaimsEncounterData
    ORDER BY BulkIndex

END
