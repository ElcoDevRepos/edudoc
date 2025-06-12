CREATE PROCEDURE [dbo].[SP_Bulk_Insert_ClaimsStudents]
	@ClaimsStudentData ClaimsStudentData READONLY
AS

BEGIN

    INSERT INTO [dbo].[ClaimsStudents]
	(
        [IdentificationCode],
        [LastName],
        [FirstName],
        [Address],
        [City],
        [State],
        [PostalCode],
        [InsuredDateTimePeriod],
        [ClaimsDistrictId],
        [StudentId]
    )
    OUTPUT Inserted.Id as InsertedId
    SELECT
        [IdentificationCode],
        [LastName],
        [FirstName],
        [Address],
        [City],
        [State],
        [PostalCode],
        [InsuredDateTimePeriod],
        [ClaimsDistrictId],
        [StudentId]
    FROM @ClaimsStudentData
    ORDER BY BulkIndex

END
