CREATE PROCEDURE [dbo].[SP_Bulk_Insert_ClaimsDistricts]
	@ClaimsDistrictData ClaimsDistrictData READONLY
AS

BEGIN

    INSERT INTO [dbo].[ClaimsDistricts]
	(
        [IdentificationCode],
        [DistrictOrganizationName],
        [Address],
        [City],
        [State],
        [PostalCode],
        [EmployerId],
        [Index],
        [HealthCareClaimsId],
        [SchoolDistrictId]
    )
    OUTPUT Inserted.Id as InsertedId
    SELECT
        [IdentificationCode],
        [DistrictOrganizationName],
        [Address],
        [City],
        [State],
        [PostalCode],
        [EmployerId],
        [Index],
        [HealthCareClaimsId],
        [SchoolDistrictId]
    FROM @ClaimsDistrictData
    ORDER BY BulkIndex

END
