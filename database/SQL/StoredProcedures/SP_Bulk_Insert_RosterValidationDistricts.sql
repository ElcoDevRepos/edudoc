CREATE PROCEDURE [dbo].[SP_Bulk_Insert_RosterValidationDistricts]
	@RosterValidationDistrictData RosterValidationDistrictData READONLY
AS

BEGIN

    INSERT INTO [dbo].[RosterValidationDistricts]
	(
        IdentificationCode,
        DistrictOrganizationName,
        [Address],
        City,
        [State],
        PostalCode,
        EmployerId,
        [Index],
        RosterValidationId,
        SchoolDistrictId
    )
    OUTPUT Inserted.Id as InsertedId
    SELECT
        IdentificationCode,
        DistrictOrganizationName,
        [Address],
        City,
        [State],
        PostalCode,
        EmployerId,
        [Index],
        RosterValidationId,
        SchoolDistrictId
    FROM @RosterValidationDistrictData
    ORDER BY BulkIndex

END
