-- ProviderLookupByEmail.sql
-- This query retrieves provider information based on the provided email address or name
-- It joins the Providers, Users, and AuthUsers tables to fetch comprehensive information

DECLARE @ProviderEmail VARCHAR(254) = NULL -- Set to provider's email or NULL if searching by name
DECLARE @FirstName VARCHAR(50) = NULL -- Set to provider's first name or NULL
DECLARE @LastName VARCHAR(50) = NULL -- Set to provider's last name or NULL

SELECT *
FROM 
    dbo.Users u
INNER JOIN 
    dbo.AuthUsers au ON u.AuthUserId = au.Id
INNER JOIN 
    dbo.Providers p ON u.Id = p.ProviderUserId
LEFT JOIN 
    dbo.ProviderTitles pt ON p.TitleId = pt.Id
LEFT JOIN 
    dbo.ProviderEmploymentTypes pet ON p.ProviderEmploymentTypeId = pet.Id
LEFT JOIN 
    dbo.ProviderDoNotBillReasons dnbr ON p.DoNotBillReasonId = dnbr.Id
WHERE 
    (@ProviderEmail IS NULL OR u.Email = @ProviderEmail)
    AND (@FirstName IS NULL OR u.FirstName LIKE @FirstName + '%')
    AND (@LastName IS NULL OR u.LastName LIKE @LastName + '%') 