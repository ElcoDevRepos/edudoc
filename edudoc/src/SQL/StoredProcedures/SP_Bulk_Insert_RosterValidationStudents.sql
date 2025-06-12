CREATE PROCEDURE [dbo].[SP_Bulk_Insert_RosterValidationStudents]
	@RosterValidationStudentData RosterValidationStudentData READONLY
AS

BEGIN

    INSERT INTO [dbo].[RosterValidationStudents]
	(
        [IdentificationCode],
        [ReferenceId],
        [LastName],
        [FirstName],
        [Address],
        [City],
        [State],
        [PostalCode],
        [InsuredDateTimePeriod],
        [RosterValidationDistrictId],
        [StudentId]
    )
    OUTPUT Inserted.Id as InsertedId
    SELECT
        [IdentificationCode],
        [ReferenceId],
        [LastName],
        [FirstName],
        [Address],
        [City],
        [State],
        [PostalCode],
        [InsuredDateTimePeriod],
        [RosterValidationDistrictId],
        [StudentId]
    FROM @RosterValidationStudentData
    ORDER BY BulkIndex

END
