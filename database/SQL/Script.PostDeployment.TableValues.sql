/*
Post-Deployment Script Template
--------------------------------------------------------------------------------------
 This file contains SQL statements that will be appended to the build script.
 Use SQLCMD syntax to include a file in the post-deployment script.
 Example:      :r .\myfile.sql
 Use SQLCMD syntax to reference a variable in the post-deployment script.
 Example:      :setvar TableStatus MyTable
			   SELECT * FROM [$(TableStatus)]
--------------------------------------------------------------------------------------

This file should include any data that is required for the project and will not be
altered by the user.

*/


-- Add a blank record to Acknowledgement table since users are only editing one reoc

IF NOT EXISTS (SELECT 1 FROM dbo.Acknowledgements)
BEGIN
    INSERT INTO dbo.Acknowledgements
    (
        Id,
        Name
    )
    VALUES
    (1,
	'' -- Name - varchar(max)
     );
END;

-- Merge Console Job Types
MERGE INTO dbo.ConsoleJobTypes AS Target
USING (
VALUES
	( 1 ,
	  'School District Roster Upload'
	),
	( 2 ,
	  'Billing Schedule Claim Generation'
	),
	( 3 ,
	  'Billing Response File Processing'
	) ) AS Source ( Id, Name )
ON Target.Id = Source.Id
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name )
	VALUES ( Id, Name )
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;

-- Merge Provider Training Types
SET IDENTITY_INSERT dbo.TrainingTypes ON;
MERGE INTO dbo.TrainingTypes AS Target
USING (
VALUES
	( 1 ,
	  'New Person'
	),
    ( 2 ,
	  'Yearly'
	),
	( 3 ,
	  'Updated'
	) ) AS Source ( Id, Name )
ON Target.Id = Source.Id
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name )
	VALUES ( Id, Name )
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;
SET IDENTITY_INSERT dbo.TrainingTypes OFF;


-- Merge Auth Application Types
MERGE INTO dbo.AuthApplicationTypes AS Target
USING (
VALUES
	( 1 ,
	  'Native - Confidential'
	),
	( 2 ,
	  'Unconfidential'
	) ) AS Source ( Id, Name )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name )
	VALUES ( Id, Name )
-- DELETEe rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;

-- Merge AuthClients
DECLARE @salt VARBINARY(64) ,
	@hash VARBINARY(64) ,
	@saltedHash VARBINARY(64);
SET @salt = CRYPT_GEN_RANDOM(64);
SET @hash = HASHBYTES('SHA2_512', 'verysecret');
SET @saltedHash = HASHBYTES('SHA2_512', @salt + @hash);

SET IDENTITY_INSERT dbo.AuthClients ON;
MERGE INTO dbo.AuthClients AS Target
USING (
VALUES
	( 1 ,
	  N'angular-admin' ,
	  @saltedHash ,
	  @salt ,
	  N'The admin site.' ,
	  1 ,
	  481,
	  N'*'
	) ) AS Source ( [Id], [Name], [Secret], [Salt], [Description],
					[AuthApplicationTypeId], [RefreshTokenMinutes],
					[AllowedOrigin] )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name ,
			   [Secret] = Source.[Secret] ,
			   Salt = Source.[Salt] ,
			   Target.[Description] = Source.[Description] ,
			   Target.AuthApplicationTypeId = Source.AuthApplicationTypeId ,
			   Target.RefreshTokenMinutes = Source.RefreshTokenMinutes ,
			   Target.AllowedOrigin = Source.AllowedOrigin
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( [Id] ,
			 [Name] ,
			 [Secret] ,
			 [Salt] ,
			 [Description] ,
			 [AuthApplicationTypeId] ,
			 [RefreshTokenMinutes] ,
			 [AllowedOrigin]
		   )
	VALUES ( [Id] ,
			 [Name] ,
			 [Secret] ,
			 [Salt] ,
			 [Description] ,
			 [AuthApplicationTypeId] ,
			 [RefreshTokenMinutes] ,
			 [AllowedOrigin]
		   )
-- DELETE rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;
SET IDENTITY_INSERT dbo.AuthClients OFF;



MERGE INTO dbo.UserTypes AS Target
USING (
VALUES
	( 1 ,
	  'Admin'
	),
	( 2 ,
	  'Provider'
	),
	( 3 ,
	  'School District Administrator'
	),
    ( 4 ,
      'Account Manager'
    ))
 AS Source ( Id, Name )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name )
	VALUES ( Id, Name )
-- DELETEe rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;


MERGE INTO dbo.AgencyTypes AS Target
USING (
VALUES
	( 1 ,
	  'ESC Name'
	),
	( 2 ,
	  'ESC Name with Provider Name'
	),
	( 3 ,
	  'Agency Name'
	),
    ( 4 ,
	  'Agency Name with Provider Name'
	)
    )
 AS Source ( Id, Name )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name )
	VALUES ( Id, Name )
-- DELETEe rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;


MERGE INTO dbo.ProviderDoNotBillReasons AS Target
USING (
VALUES
	( 1 ,
	  'Deceased'
	),
    ( 2 ,
      'Exit'
    ),
    ( 3 ,
       'Leave'
    ),
	( 4 ,
	  'License'
	),
    ( 5 ,
      'Other'
    ))
 AS Source ( Id, Name )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name )
	VALUES ( Id, Name )
-- DELETEe rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;


MERGE INTO dbo.ProviderEmploymentTypes AS Target
USING (
VALUES
	( 1 ,
	  'District Employed'
	),
	( 2 ,
	  'Contract'
	))
 AS Source ( Id, Name )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name )
	VALUES ( Id, Name )
-- DELETEe rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;

SET IDENTITY_INSERT StudentParentalConsentTypes ON;
MERGE INTO dbo.StudentParentalConsentTypes AS Target
USING (
VALUES
    ( 1,
      'Consent Confirmed'
    ),
    ( 2,
      'Non-Consent'
    ),
    ( 3,
      'Pending Consent'
    ))
 AS Source ( Id, Name )
 ON Target.Id = Source.Id
 -- update matched rows
 WHEN MATCHED THEN
    UPDATE SET Name = Source.Name
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
    INSERT ( Id, Name )
    VALUES ( Id, Name )
-- Delete rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;
SET IDENTITY_INSERT StudentParentalConsentTypes OFF;

-- These are only required for initial deployment of table
SET IDENTITY_INSERT VoucherTypes ON;
MERGE INTO dbo.VoucherTypes AS Target
USING (
VALUES
	( 1 ,
	  'Service Code',
      0,
      0
	),
	( 2 ,
	  'Unknown',
      1,
      0
	))
AS Source ( Id, Name, Sort, Editable )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name,
    Sort = Source.Sort,
    Editable = Source.Editable
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name, Sort, Editable )
	VALUES ( Id, Name, Sort, Editable );
SET IDENTITY_INSERT VoucherTypes OFF;

SET IDENTITY_INSERT BillingFailureReasons ON;
MERGE INTO dbo.BillingFailureReasons AS Target
USING (
VALUES
    ( 1,
      'Missing MedicaidNo'
    ),
    ( 2,
      'Missing Parental Consent'
    ),
    ( 3,
      'Missing Provider Signature'
    ),
    ( 4,
      'Missing Supervisor Signature'
    ),
    ( 5,
      'Missing Referral'
    ),
    ( 6,
      'Missing CPT Code'
    ),
    ( 7,
      'Address Over Max Length'
    ),
    (
      8,
      'Missing Address'
    ),
    (9,
      'Service Unit Rule Violation')
    )
 AS Source ( Id, Name )
 ON Target.Id = Source.Id
 -- update matched rows
 WHEN MATCHED THEN
    UPDATE SET Name = Source.Name
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
    INSERT ( Id, Name )
    VALUES ( Id, Name )
-- Delete rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;
SET IDENTITY_INSERT BillingFailureReasons OFF;

-- Merge UserRoles (Reserve first 50 ids for hard-coded user roles
declare @maxValue int;
select @maxValue = max(Id) from UserRoles
if (@maxValue < 51)
BEGIN
DBCC CHECKIDENT (UserRoles, RESEED, 50)
END
SET IDENTITY_INSERT UserRoles ON;
MERGE INTO UserRoles AS Target
USING (VALUES
	(1, 'Administrator', 0, 1),
    (2, 'Account Manager', 0, 1),
    (3, 'Account Assistant', 0, 1),
    (4, 'School District Administrator', 0, 3),
    (5, 'Provider',0,2)
) AS Source([Id], [Name], [IsEditable],[UserTypeId])
ON (Target.Id = Source.Id)
WHEN MATCHED THEN UPDATE SET
	Name = Source.Name,
	Target.IsEditable = Source.IsEditable,
    Target.UserTypeId= Source.UserTypeId
WHEN NOT MATCHED BY TARGET THEN
	INSERT (Id, Name, IsEditable, UserTypeId)
	VALUES (Source.Id, Source.Name, Source.IsEditable, Source.UserTypeId);
SET IDENTITY_INSERT UserRoles OFF;

-- Auth User
SET @salt = CRYPT_GEN_RANDOM(64);
SET @hash = HASHBYTES('SHA2_512', 'mN5)TV75K8[6v3y');
SET @saltedHash = HASHBYTES('SHA2_512', @salt + @hash);
SET IDENTITY_INSERT [AuthUsers] ON;
MERGE INTO [AuthUsers] AS Target
USING (
VALUES
	( 1 ,'admin' ,@saltedHash ,@salt ,0x, 1, 0, 1)
	 ) AS Source ( [Id], [Username], [Password], [Salt], [ResetKey], [RoleId], [IsEditable], [HasAccess] )
ON ( Target.[Id] = Source.[Id] )
WHEN MATCHED THEN
	UPDATE SET [Username] = Source.[Username] ,
			   [Password] = Source.[Password] ,
			   [Salt] = Source.[Salt] ,
			   [ResetKey] = Source.[ResetKey] ,
			   [RoleId] = SOURCE.[RoleId],
			   [IsEditable] = SOURCE.[IsEditable],
			   [HasAccess] = SOURCE.[HasAccess]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( [Id] ,
			 [Username] ,
			 [Password] ,
			 [Salt] ,
			 [ResetKey] ,
			 [RoleId],
			 [IsEditable],
			 [HasAccess]
		   )
	VALUES ( Source.[Id] ,
			 Source.[Username] ,
			 Source.[Password] ,
			 Source.[Salt] ,
			 Source.[ResetKey] ,
			 Source.[RoleId],
			 SOURCE.[IsEditable],
			 SOURCE.[HasAccess]
		   );
SET IDENTITY_INSERT [AuthUsers] OFF;

-- States
MERGE INTO dbo.States AS Target
USING (
VALUES
	( 'Alaska' , 'AK'),
	( 'Alabama' , 'AL'),
	( 'American Samoa' , 'AS'),
	( 'Arizona' , 'AZ'),
	( 'Arkansas' , 'AR'),
	( 'California' , 'CA'),
	( 'Colorado' , 'CO'),
	( 'Connecticut' , 'CT'),
	( 'Delaware' , 'DE'),
	( 'District of Columbia' , 'DC'),
	( 'Florida' , 'FL'),
	( 'Georgia' , 'GA'),
	( 'Guam' , 'GU'),
	( 'Hawaii' , 'HI'),
	( 'Idaho' , 'ID'),
	( 'Illinois' , 'IL'),
	( 'Indiana' , 'IN'),
	( 'Iowa' , 'IA'),
	( 'Kansas' , 'KS'),
	( 'Kentucky' , 'KY'),
	( 'Louisiana' , 'LA'),
	( 'Maine' , 'ME'),
	( 'Maryland' , 'MD'),
	( 'Massachusetts' , 'MA'),
	( 'Michigan' , 'MI'),
	( 'Minnesota' , 'MN'),
	( 'Mississippi' , 'MS'),
	( 'Missouri' , 'MO'),
	( 'Montana' , 'MT'),
	( 'Nebraska' , 'NE'),
	( 'Nevada' , 'NV'),
	( 'New Hampshire' , 'NH'),
	( 'New Jersey' , 'NJ'),
	( 'New Mexico' , 'NM'),
	( 'New York' , 'NY'),
	( 'North Carolina' , 'NC'),
	( 'North Dakota' , 'ND'),
	( 'Northern Mariana Islands' , 'MP'),
	( 'Ohio' , 'OH'),
	( 'Oklahoma' , 'OK'),
	( 'Oregon' , 'OR'),
	( 'Palau' , 'PW'),
	( 'Pennsylvania' , 'PA'),
	( 'Puerto Rico' , 'PR'),
	( 'Rhode Island' , 'RI'),
	( 'South Carolina' , 'SC'),
	( 'South Dakota' , 'SD'),
	( 'Tennessee' , 'TN'),
	( 'Texas' , 'TX'),
	( 'Utah' , 'UT'),
	( 'Vermont' , 'VT'),
	( 'Virgin Islands' , 'VI'),
	( 'Virginia' , 'VA'),
	( 'Washington' , 'WA'),
	( 'West Virginia' , 'WV'),
	( 'Wisconsin' , 'WI'),
	( 'Wyoming' , 'WY'),
	( 'Alberta' , 'AB'),
	( 'British Columbia' , 'BC'),
	( 'Manitoba' , 'MB'),
	( 'New Brunswick' , 'NB'),
	( 'Newfoundland and Labrador' , 'NL'),
	( 'Northwest Territories' , 'NT'),
	( 'Nova Scotia' , 'NS'),
	( 'Nunavut' , 'NU'),
	( 'Ontario' , 'ON'),
	( 'Prince Edward Island' , 'PE'),
	( 'Québec' , 'QC'),
	( 'Saskatchewan' , 'SK'),
	( 'Yukon Territory' , 'YT'),
	( 'Unknown' , 'UK')
	) AS SOURCE ( NAME, [STATECODE] )
ON SOURCE.[STATECODE] = Target.[StateCode]
WHEN MATCHED THEN
	UPDATE SET Target.Name = SOURCE.NAME
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( [StateCode], Name )
	VALUES ( [StateCode], Name )
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;

-- Countries
MERGE INTO dbo.Countries AS Target
USING (
VALUES
        ( 'AF' , 'AFG', 'Afghanistan'),
        ( 'AL' , 'ALB', 'Albania'),
        ( 'DZ' , 'DZA', 'Algeria'),
        ( 'AS' , 'ASM', 'American Samoa'),
        ( 'AD' , 'AND', 'Andorra'),
        ( 'AO' , 'AGO', 'Angola'),
        ( 'AI' , 'AIA', 'Anguilla'),
        ( 'AQ' , 'ATA', 'Antarctica'),
        ( 'AG' , 'ATG', 'Antigua and Barbuda'),
        ( 'AR' , 'ARG', 'Argentina'),
        ( 'AM' , 'ARM', 'Armenia'),
        ( 'AW' , 'ABW', 'Aruba'),
        ( 'AU' , 'AUS', 'Australia'),
        ( 'AT' , 'AUT', 'Austria'),
        ( 'AZ' , 'AZE', 'Azerbaijan'),
        ( 'BS' , 'BHS', 'Bahamas'),
        ( 'BH' , 'BHR', 'Bahrain'),
        ( 'BD' , 'BGD', 'Bangladesh'),
        ( 'BB' , 'BRB', 'Barbados'),
        ( 'BY' , 'BLR', 'Belarus'),
        ( 'BE' , 'BEL', 'Belgium'),
        ( 'BZ' , 'BLZ', 'Belize'),
        ( 'BJ' , 'BEN', 'Benin'),
        ( 'BM' , 'BMU', 'Bermuda'),
        ( 'BT' , 'BTN', 'Bhutan'),
        ( 'BO' , 'BOL', 'Bolivia'),
        ( 'BA' , 'BIH', 'Bosnia and Herzegovina'),
        ( 'BW' , 'BWA', 'Botswana'),
        ( 'BR' , 'BRA', 'Brazil'),
        ( 'IO' , 'IOT', 'British Indian Ocean Territory'),
        ( 'VG' , 'VGB', 'British Virgin Islands'),
        ( 'BN' , 'BRN', 'Brunei'),
        ( 'BG' , 'BGR', 'Bulgaria'),
        ( 'BF' , 'BFA', 'Burkina Faso'),
        ( 'BI' , 'BDI', 'Burundi'),
        ( 'KH' , 'KHM', 'Cambodia'),
        ( 'CM' , 'CMR', 'Cameroon'),
        ( 'CA' , 'CAN', 'Canada'),
        ( 'CV' , 'CPV', 'Cape Verde'),
        ( 'KY' , 'CYM', 'Cayman Islands'),
        ( 'CF' , 'CAF', 'Central African Republic'),
        ( 'TD' , 'TCD', 'Chad'),
        ( 'CL' , 'CHL', 'Chile'),
        ( 'CN' , 'CHN', 'China'),
        ( 'CX' , 'CXR', 'Christmas Island'),
        ( 'CC' , 'CCK', 'Cocos Islands'),
        ( 'CO' , 'COL', 'Colombia'),
        ( 'KM' , 'COM', 'Comoros'),
        ( 'CK' , 'COK', 'Cook Islands'),
        ( 'CR' , 'CRI', 'Costa Rica'),
        ( 'HR' , 'HRV', 'Croatia'),
        ( 'CU' , 'CUB', 'Cuba'),
        ( 'CW' , 'CUW', 'Curacao'),
        ( 'CY' , 'CYP', 'Cyprus'),
        ( 'CZ' , 'CZE', 'Czech Republic'),
        ( 'CD' , 'COD', 'Democratic Republic of the Congo'),
        ( 'DK' , 'DNK', 'Denmark'),
        ( 'DJ' , 'DJI', 'Djibouti'),
        ( 'DM' , 'DMA', 'Dominica'),
        ( 'DO' , 'DOM', 'Dominican Republic'),
        ( 'TL' , 'TLS', 'East Timor'),
        ( 'EC' , 'ECU', 'Ecuador'),
        ( 'EG' , 'EGY', 'Egypt'),
        ( 'SV' , 'SLV', 'El Salvador'),
        ( 'GQ' , 'GNQ', 'Equatorial Guinea'),
        ( 'ER' , 'ERI', 'Eritrea'),
        ( 'EE' , 'EST', 'Estonia'),
        ( 'ET' , 'ETH', 'Ethiopia'),
        ( 'FK' , 'FLK', 'Falkland Islands'),
        ( 'FO' , 'FRO', 'Faroe Islands'),
        ( 'FJ' , 'FJI', 'Fiji'),
        ( 'FI' , 'FIN', 'Finland'),
        ( 'FR' , 'FRA', 'France'),
        ( 'PF' , 'PYF', 'French Polynesia'),
        ( 'GA' , 'GAB', 'Gabon'),
        ( 'GM' , 'GMB', 'Gambia'),
        ( 'GE' , 'GEO', 'Georgia'),
        ( 'DE' , 'DEU', 'Germany'),
        ( 'GH' , 'GHA', 'Ghana'),
        ( 'GI' , 'GIB', 'Gibraltar'),
        ( 'GR' , 'GRC', 'Greece'),
        ( 'GL' , 'GRL', 'Greenland'),
        ( 'GD' , 'GRD', 'Grenada'),
        ( 'GU' , 'GUM', 'Guam'),
        ( 'GT' , 'GTM', 'Guatemala'),
        ( 'GG' , 'GGY', 'Guernsey'),
        ( 'GN' , 'GIN', 'Guinea'),
        ( 'GW' , 'GNB', 'Guinea-Bissau'),
        ( 'GY' , 'GUY', 'Guyana'),
        ( 'HT' , 'HTI', 'Haiti'),
        ( 'HN' , 'HND', 'Honduras'),
        ( 'HK' , 'HKG', 'Hong Kong'),
        ( 'HU' , 'HUN', 'Hungary'),
        ( 'IS' , 'ISL', 'Iceland'),
        ( 'IN' , 'IND', 'India'),
        ( 'ID' , 'IDN', 'Indonesia'),
        ( 'IR' , 'IRN', 'Iran'),
        ( 'IQ' , 'IRQ', 'Iraq'),
        ( 'IE' , 'IRL', 'Ireland'),
        ( 'IM' , 'IMN', 'Isle of Man'),
        ( 'IL' , 'ISR', 'Israel'),
        ( 'IT' , 'ITA', 'Italy'),
        ( 'CI' , 'CIV', 'Ivory Coast'),
        ( 'JM' , 'JAM', 'Jamaica'),
        ( 'JP' , 'JPN', 'Japan'),
        ( 'JE' , 'JEY', 'Jersey'),
        ( 'JO' , 'JOR', 'Jordan'),
        ( 'KZ' , 'KAZ', 'Kazakhstan'),
        ( 'KE' , 'KEN', 'Kenya'),
        ( 'KI' , 'KIR', 'Kiribati'),
        ( 'XK' , 'XKX', 'Kosovo'),
        ( 'KW' , 'KWT', 'Kuwait'),
        ( 'KG' , 'KGZ', 'Kyrgyzstan'),
        ( 'LA' , 'LAO', 'Laos'),
        ( 'LV' , 'LVA', 'Latvia'),
        ( 'LB' , 'LBN', 'Lebanon'),
        ( 'LS' , 'LSO', 'Lesotho'),
        ( 'LR' , 'LBR', 'Liberia'),
        ( 'LY' , 'LBY', 'Libya'),
        ( 'LI' , 'LIE', 'Liechtenstein'),
        ( 'LT' , 'LTU', 'Lithuania'),
        ( 'LU' , 'LUX', 'Luxembourg'),
        ( 'MO' , 'MAC', 'Macau'),
        ( 'MK' , 'MKD', 'Macedonia'),
        ( 'MG' , 'MDG', 'Madagascar'),
        ( 'MW' , 'MWI', 'Malawi'),
        ( 'MY' , 'MYS', 'Malaysia'),
        ( 'MV' , 'MDV', 'Maldives'),
        ( 'ML' , 'MLI', 'Mali'),
        ( 'MT' , 'MLT', 'Malta'),
        ( 'MH' , 'MHL', 'Marshall Islands'),
        ( 'MR' , 'MRT', 'Mauritania'),
        ( 'MU' , 'MUS', 'Mauritius'),
        ( 'YT' , 'MYT', 'Mayotte'),
        ( 'MX' , 'MEX', 'Mexico'),
        ( 'FM' , 'FSM', 'Micronesia'),
        ( 'MD' , 'MDA', 'Moldova'),
        ( 'MC' , 'MCO', 'Monaco'),
        ( 'MN' , 'MNG', 'Mongolia'),
        ( 'ME' , 'MNE', 'Montenegro'),
        ( 'MS' , 'MSR', 'Montserrat'),
        ( 'MA' , 'MAR', 'Morocco'),
        ( 'MZ' , 'MOZ', 'Mozambique'),
        ( 'MM' , 'MMR', 'Myanmar'),
        ( 'NA' , 'NAM', 'Namibia'),
        ( 'NR' , 'NRU', 'Nauru'),
        ( 'NP' , 'NPL', 'Nepal'),
        ( 'NL' , 'NLD', 'Netherlands'),
        ( 'AN' , 'ANT', 'Netherlands Antilles'),
        ( 'NC' , 'NCL', 'New Caledonia'),
        ( 'NZ' , 'NZL', 'New Zealand'),
        ( 'NI' , 'NIC', 'Nicaragua'),
        ( 'NE' , 'NER', 'Niger'),
        ( 'NG' , 'NGA', 'Nigeria'),
        ( 'NU' , 'NIU', 'Niue'),
        ( 'KP' , 'PRK', 'North Korea'),
        ( 'MP' , 'MNP', 'Northern Mariana Islands'),
        ( 'NO' , 'NOR', 'Norway'),
        ( 'OM' , 'OMN', 'Oman'),
        ( 'PK' , 'PAK', 'Pakistan'),
        ( 'PW' , 'PLW', 'Palau'),
        ( 'PS' , 'PSE', 'Palestine'),
        ( 'PA' , 'PAN', 'Panama'),
        ( 'PG' , 'PNG', 'Papua New Guinea'),
        ( 'PY' , 'PRY', 'Paraguay'),
        ( 'PE' , 'PER', 'Peru'),
        ( 'PH' , 'PHL', 'Philippines'),
        ( 'PN' , 'PCN', 'Pitcairn'),
        ( 'PL' , 'POL', 'Poland'),
        ( 'PT' , 'PRT', 'Portugal'),
        ( 'PR' , 'PRI', 'Puerto Rico'),
        ( 'QA' , 'QAT', 'Qatar'),
        ( 'CG' , 'COG', 'Republic of the Congo'),
        ( 'RE' , 'REU', 'Reunion'),
        ( 'RO' , 'ROU', 'Romania'),
        ( 'RU' , 'RUS', 'Russia'),
        ( 'RW' , 'RWA', 'Rwanda'),
        ( 'BL' , 'BLM', 'Saint Barthelemy'),
        ( 'SH' , 'SHN', 'Saint Helena'),
        ( 'KN' , 'KNA', 'Saint Kitts and Nevis'),
        ( 'LC' , 'LCA', 'Saint Lucia'),
        ( 'MF' , 'MAF', 'Saint Martin'),
        ( 'PM' , 'SPM', 'Saint Pierre and Miquelon'),
        ( 'VC' , 'VCT', 'Saint Vincent and the Grenadines'),
        ( 'WS' , 'WSM', 'Samoa'),
        ( 'SM' , 'SMR', 'San Marino'),
        ( 'ST' , 'STP', 'Sao Tome and Principe'),
        ( 'SA' , 'SAU', 'Saudi Arabia'),
        ( 'SN' , 'SEN', 'Senegal'),
        ( 'RS' , 'SRB', 'Serbia'),
        ( 'SC' , 'SYC', 'Seychelles'),
        ( 'SL' , 'SLE', 'Sierra Leone'),
        ( 'SG' , 'SGP', 'Singapore'),
        ( 'SX' , 'SXM', 'Sint Maarten'),
        ( 'SK' , 'SVK', 'Slovakia'),
        ( 'SI' , 'SVN', 'Slovenia'),
        ( 'SB' , 'SLB', 'Solomon Islands'),
        ( 'SO' , 'SOM', 'Somalia'),
        ( 'ZA' , 'ZAF', 'South Africa'),
        ( 'KR' , 'KOR', 'South Korea'),
        ( 'SS' , 'SSD', 'South Sudan'),
        ( 'ES' , 'ESP', 'Spain'),
        ( 'LK' , 'LKA', 'Sri Lanka'),
        ( 'SD' , 'SDN', 'Sudan'),
        ( 'SR' , 'SUR', 'Suriname'),
        ( 'SJ' , 'SJM', 'Svalbard and Jan Mayen'),
        ( 'SZ' , 'SWZ', 'Swaziland'),
        ( 'SE' , 'SWE', 'Sweden'),
        ( 'CH' , 'CHE', 'Switzerland'),
        ( 'SY' , 'SYR', 'Syria'),
        ( 'TW' , 'TWN', 'Taiwan'),
        ( 'TJ' , 'TJK', 'Tajikistan'),
        ( 'TZ' , 'TZA', 'Tanzania'),
        ( 'TH' , 'THA', 'Thailand'),
        ( 'TG' , 'TGO', 'Togo'),
        ( 'TK' , 'TKL', 'Tokelau'),
        ( 'TO' , 'TON', 'Tonga'),
        ( 'TT' , 'TTO', 'Trinidad and Tobago'),
        ( 'TN' , 'TUN', 'Tunisia'),
        ( 'TR' , 'TUR', 'Turkey'),
        ( 'TM' , 'TKM', 'Turkmenistan'),
        ( 'TC' , 'TCA', 'Turks and Caicos Islands'),
        ( 'TV' , 'TUV', 'Tuvalu'),
        ( 'VI' , 'VIR', 'U.S. Virgin Islands'),
        ( 'UG' , 'UGA', 'Uganda'),
        ( 'UA' , 'UKR', 'Ukraine'),
        ( 'AE' , 'ARE', 'United Arab Emirates'),
        ( 'GB' , 'GBR', 'United Kingdom'),
        ( 'US' , 'USA', 'United States'),
        ( 'UY' , 'URY', 'Uruguay'),
        ( 'UZ' , 'UZB', 'Uzbekistan'),
        ( 'VU' , 'VUT', 'Vanuatu'),
        ( 'VA' , 'VAT', 'Vatican'),
        ( 'VE' , 'VEN', 'Venezuela'),
        ( 'VN' , 'VNM', 'Vietnam'),
        ( 'WF' , 'WLF', 'Wallis and Futuna'),
        ( 'EH' , 'ESH', 'Western Sahara'),
        ( 'YE' , 'YEM', 'Yemen'),
        ( 'ZM' , 'ZMB', 'Zambia'),
        ( 'ZW' , 'ZWE', 'Zimbabwe')
	) AS SOURCE ( [COUNTRYCODE], [ALPHA3CODE], [NAME] )
ON SOURCE.[COUNTRYCODE] = Target.[CountryCode]
WHEN MATCHED THEN
	UPDATE SET Target.Name = SOURCE.NAME
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( [CountryCode], [Alpha3Code], Name )
	VALUES ( [CountryCode], [Alpha3Code], Name )
WHEN NOT MATCHED BY SOURCE THEN
	DELETE;

-- User
SET IDENTITY_INSERT dbo.Users ON;
MERGE INTO Users AS Target
USING (VALUES
(1, 'Admin', 'User', 'bsstest@4miles.com', NULL, 1)
) AS Source(Id, FirstName, LastName, Email, AddressId, AuthUserId)
ON Source.Id = Target.ID
WHEN MATCHED THEN
	UPDATE SET
		Target.FirstName = source.FirstName,
		Target.LastName = source.LastName,
		Target.Email = source.Email,
		Target.AddressId = SOURCE.AddressId,
		TARGET.AuthUserId = SOURCE.AuthUserId
WHEN NOT MATCHED THEN
	INSERT(Id, FirstName, LastName, Email, AuthUserId, AddressId)
	VALUES (Source.Id, Source.FirstName, Source.LastName, Source.Email,
	Source.AuthUserId, Source.AddressId);
SET IDENTITY_INSERT dbo.Users OFF;



-- Phone Types
SET IDENTITY_INSERT PhoneTypes ON;
MERGE INTO PhoneTypes AS Target
USING (
VALUES
	( 1 ,'Home'),
	( 2 ,'Work'),
	( 3 ,'Mobile'),
	( 4, 'Fax')
	) AS Source ( Id, Name )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN
	UPDATE SET Name = Source.Name
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name )
	VALUES ( Id, Name )
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT PhoneTypes OFF;

-- Claim Types  70 TOTAL
SET IDENTITY_INSERT dbo.ClaimTypes ON;
MERGE INTO dbo.ClaimTypes AS Target
USING (VALUES
	(1, 'Application Settings', NULL,1, 'System List Maintenance'),
	    (2, 'HPCUserAccess', 1, 1, 'HPC User Access'),
	    (3, 'DistrictUserAccess', 1, 1, 'District User Access'),
	    (4, 'ProviderTitles', 1, 1, 'Provider Titles'),
	    (5, 'ProviderGoals', 1, 1, 'Provider Goals/Progress'),
	    (6, 'ProviderMethods', 1, 1, 'Provider Methods'),
	    (7, 'CPTCodes', 1, 1, 'CPT Codes'),
	    (8, 'DiagnosisCodes', 1, 1, 'Diagnosis Codes'),
	    (9, 'EncounterLocation', 1, 1, '837 Approved Location'),
	    (10, 'ContractedAgency', 1, 1, 'Contracted Agency'),
	    (11, 'ReturnReasons', 1, 1, 'Return Reasons'),
	    (12, 'Documents', 1, 1, 'Documents'),
	    (13, 'Links', 1, 1, 'Links'),
        (52, 'ManagedListitems', 1, 0, 'Managed List Items'),

	(14, 'Users', NULL,1, 'HPC Users'),

	(15, 'BillingSchedules', NULL,1, 'Billing Schedules'),
        (16, 'ReviewSchedules', 15, 1, 'Review Schedules'),
	    (17, 'ReviewFiles', 15, 1, 'Review Files'),
	    (18, 'RejectedEncounters', 15, 1, 'Rejected Encounters'),
        (66, 'Vouchers', 15, 1, 'Vouchers'),

	(19, 'MessageMaintenance', NULL,1, 'Message Maintenance'),
        (20, 'PublicMessage', 19, 1, 'Public Message'),
	    (21, 'ClientMessage', 19, 1, 'Client Message'),
	    (22, 'TargetMessage', 19, 1, 'Target Message'),

	(23, 'ProviderAttestations', NULL,1, 'Provider Attestations'),
	    (24, 'ProviderAcknowledgements', 23, 1, 'Provider Acknowledgements'),
	    (25, 'ESignAuthorization', 23, 1, 'E-Signature Authorization'),
	    (26, 'MedicalReferralAuthorization', 23, 1, 'Medical Referral Authorization'),

	(27, 'SchoolDistrictMaintenance', NULL,1, 'School District Maintenance'),
	    (28, 'SchoolDistricts', 27, 1, 'School Districts'),
	    (29, 'SchoolDistrictAdministrationUsers', 27, 1, 'School District Administration/Users'),
	    (30, 'SchoolDistrictManagementInformation', 27, 1, 'School District Management Information'),

	(31, 'ESCMaintenance', NULL,1, 'ESC Maintenance'),
	    (32, 'ESCs', 31, 1, 'ESC''s'),
	    (33, 'ESCAdministrationUsers', 31, 1, 'ESC Administration/Users'),
	    (34, 'ESCManagementInformation', 31, 1, 'ESC Management Information'),

	(35, 'ProviderMaintenance', NULL,1, 'Provider Maintenance'),

	(36, 'StudentMaintenance', NULL,1, 'Student Maintenance'),

	(37, 'Encounters', NULL,1, 'Encounters'),
    	(54, 'CreateTherapyEncounter', 37, 1, 'Create Therapy Encounter'),
	    (55, 'EncountersReadyForYou', 37, 1, 'View encounters ready for you'),
	    (56, 'CreateEvaluation', 37, 1, 'Create Evaluation'),
	    (57, 'PendingEvaluation', 37, 1, 'Pending Evaluation'),
	    (58, 'Revise', 37, 1, 'Revise'),
	    (59, 'CreateNonMSPService', 37, 1, 'Create Non-MSP Service'),

	(38, 'MedMatch', NULL,1, 'MedMatch'),

	(39, 'Reports', NULL,1, 'Reports'),
	    (40, 'ReviewParentConsent', 39, 1, 'Review Parent consent'),
	    (41, 'DistrictActivitySummaryByServiceArea', 39, 1, 'District Activity summary by service area'),
	    (42, 'ServiceAreaSummaryByProvider', 39, 1, 'Service area summary by provider'),
	    (43, 'ProviderActivityDetailReport', 39, 1, 'Provider activity detail report'),
	    (44, 'EncounterReportingByStudent', 39, 1, 'Encounter reporting by student'),
	    (45, 'EncounterReportingByTherapist', 39, 1, 'Encounter reporting by Therapist'),
	    (60, 'ReviewEncounters', 39, 1, 'Review Encounters'),
        (65, 'ProgressReports', 39, 1, 'Progress Reports'),
        (67, 'CompletedReferrals', 39,1, 'Completed Referrals'),
	    (68, 'BillingReversals', 39,1, 'Billing Reversals'),
	    (69, 'IneligibleClaims', 39,1, 'Ineligible Claims'),
	    (70, 'FiscalRevenue', 39,1, 'Fiscal Revenue'),
	    (71, 'FiscalSummary', 39,1, 'Fiscal Summary'),

	(46, 'Rosters', NULL,1, 'Rosters'),
	    (47, 'RosterIssues', 46, 1, 'Roster Issues'),
	    (48, 'RosterUpload', 46, 1, 'Roster Upload'),

	(49, 'Students', NULL,1, 'Students'),
	    (50, 'CreateStudent', 49, 1, 'Create a student'),
	    (51, 'MergeStudent', 49, 1, 'Merge a student'),
	    (53, 'ReviewStudent', 49, 1, 'Review a student'),

	(61, 'ScheduleTherapyCalendar', NULL,1, 'Schedule Therapy Calendar'),

	(62, 'MyCaseload', NULL,1, 'My Caseload'),

	(63, 'MissingReferrals', NULL,1, 'Missing Referrals'),

	(64, 'CaseNotesDataBank', NULL,1, 'Case Notes Data Bank')

) AS Source(Id, Name, ParentId, IsVisible, Alias)
ON Source.Id = Target.Id
WHEN MATCHED THEN UPDATE SET
	Target.Name = Source.Name,
    Target.IsVisible = Source.IsVisible,
    Target.Alias = Source.Alias
WHEN NOT MATCHED BY TARGET THEN
	INSERT (Id, Name, ParentId,IsVisible, Alias)
	VALUES (Source.Id, Source.Name, Source.ParentId, Source.IsVisible, Source.Alias)
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT dbo.ClaimTypes OFF;

-- Claim Values
-- DO NOT USE IDENTITY SPECIFICATION!!!
-- These are bit flags. Ids must be explicitly
-- set in powers of 2, where 0 = None.
MERGE INTO dbo.ClaimValues AS Target
USING (VALUES
	(1, 'Full Access'),
	(2, 'Read Only')
) AS Source(Id, Name)
ON Source.Id = Target.Id
WHEN MATCHED THEN
	UPDATE SET Target.Name = Source.Name
WHEN NOT MATCHED BY TARGET THEN
	INSERT (Id, Name)
	VALUES (Source.Id, Source.Name)
WHEN NOT MATCHED BY SOURCE THEN DELETE;


DELETE FROM UserTypesClaimTypes
INSERT INTO UserTypesClaimTypes
(ClaimTypeId,UserTypeId)
VALUES
-- Admins
	(1	,1),
	(2	,1),
	(3	,1),
	(4	,1),
	(5	,1),
	(6	,1),
	(7	,1),
	(8	,1),
	(9	,1),
	(10	,1),
	(11	,1),
	(12	,1),
	(13	,1),
	(14	,1),
	(15	,1),
	(16	,1),
	(17	,1),
	(18	,1),
	(19	,1),
	(20	,1),
	(21	,1),
	(22	,1),
	(23	,1),
	(24	,1),
	(25	,1),
	(26	,1),
	(27	,1),
	(28	,1),
	(29	,1),
	(30	,1),
	(31	,1),
	(32	,1),
	(33	,1),
	(34	,1),
	(35	,1),
	(36	,1),
	(37	,1),
	(38	,1),
	(39	,1),
	(40	,1),
	(41	,1),
	(42	,1),
	(43	,1),
	(44	,1),
	(45	,1),
	(46	,1),
	(47	,1),
	(48	,1),
	(49	,1),
  (50, 1),
	(52	,1),
	(53	,1),
	(60	,1),
    (62	,1),
    (66	,1),
    (67, 1),
    (68, 1),
    (69, 1),
    (70, 1),
	(71, 1),

-- Providers
    (24	,2),
    (36	,2),
    (37	,2),
    (39	,2),
    (40	,2),
    (49	,2),
	(50	,2),
	(54	,2),
	(55	,2),
	(56	,2),
	(57	,2),
	(58	,2),
	(59	,2),
	(60	,2),
	(61	,2),
	(62	,2),
	(63	,2),
	(64	,2),
    (65, 2),
    (67, 2),

-- District Admins
	(7	,3),
    (27	,3),
	(28	,3),
	(30	,3),
	(36	,3),
	(37	,3),
    (39, 3),
	(40	,3),
	(41	,3),
	(42	,3),
	(43	,3),
	(44	,3),
	(45	,3),
	(46	,3),
	(47	,3),
	(48	,3),
	(49	,3),
	(50	,3),
	(51	,3),
    (53 ,3),
    (65 ,3);

-- give Admin Full Access Only
DELETE FROM dbo.UserRoleClaims WHERE RoleId = 1;
INSERT INTO dbo.UserRoleClaims
        ( RoleId ,
          ClaimTypeId ,
          ClaimValueId
        )
SELECT  1 , -- RoleId - int
        id , -- ClaimTypeId - int
        1  -- ClaimValueId - int
FROM dbo.ClaimTypes;

--Settings
SET IDENTITY_INSERT dbo.Settings ON;
MERGE INTO dbo.Settings AS TARGET
USING(VALUES
(1, 'Company Name', 'Edu Doc')
)
AS SOURCE([Id],[Name], [Value])
ON SOURCE.Id = TARGET.Id
WHEN NOT MATCHED BY TARGET THEN
	INSERT([Id], [Name], [Value])
	VALUES([Id], [Name], [Value]);
SET IDENTITY_INSERT dbo.Settings OFF;

-- Contact Statuses
SET IDENTITY_INSERT dbo.ContactStatuses ON;
MERGE INTO dbo.ContactStatuses AS Target
USING ( VALUES
(1, 'Active'),
(2, 'Inactive')
) AS Source(Id, Name)
ON Source.Id = Target.Id
WHEN MATCHED THEN
UPDATE SET Target.Name = Source.Name
WHEN NOT MATCHED THEN
INSERT (Id, Name) VALUES (Source.Id, Source.Name);
SET IDENTITY_INSERT dbo.ContactStatuses OFF;




-- Service  Codes
SET IDENTITY_INSERT ServiceCodes ON;
MERGE INTO ServiceCodes AS Target
USING (
VALUES
	( 1,'Speech Therapy', 'HCS', 'Speech/Language/Audiology', 1, 1, 1, 1),
    ( 2,'Psychology', 'HCY', 'Psychology', 1, 0, 0, 1),
    ( 3,'Occupational Therapy', 'HCO', 'Occupational Therapy', 1, 1, 1, 1),
    ( 4,'Physical Therapy', 'HCP', 'Physical Therapy', 1, 1, 1, 1),
	( 5,'Nursing', 'HCN', 'Nursing', 1, 0, 0, 0),
	( 6,'Non MSP Service', 'HDO', 'Non MSP Service',0, 0, 0, 0),
	( 7,'Counseling/Social Work', 'HCC', 'Counseling/Social Work', 1, 0, 0, 0),
    ( 8,'Audiology', 'AUD', 'Audiology', 1, 1, 0, 0)
	) AS Source (  Id, Name, Code, Area, IsBillable, NeedsReferral, CanHaveMultipleProgressReportsPerStudent, CanCosignProgressReports
    )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN
UPDATE
   SET Name = Source.Name,
   Code = Source.Code,
   Area = Source.Area,
   IsBillable = Source.IsBillable,
   NeedsReferral = Source.NeedsReferral,
   CanHaveMultipleProgressReportsPerStudent = Source.CanHaveMultipleProgressReportsPerStudent,
   CanCosignProgressReports = Source.CanCosignProgressReports
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name, Code, Area, IsBillable, NeedsReferral, CanHaveMultipleProgressReportsPerStudent, CanCosignProgressReports )
	VALUES ( Id, Name, Code, Area, IsBillable, NeedsReferral, CanHaveMultipleProgressReportsPerStudent, CanCosignProgressReports )
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT ServiceCodes OFF;

-- Service  Types
SET IDENTITY_INSERT ServiceTypes ON;
MERGE INTO ServiceTypes AS Target
USING (
VALUES
	( 1,'Evaluation/Assessment', 'B'),
	( 2,'Other (Non-Billable)', 'E'),
	( 3,'Treatment/Therapy',  'A')

	) AS Source ( Id, Name, Code )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN

UPDATE
   SET Name = Source.Name,
   Code = Source.Code

-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name, Code  )
	VALUES ( Id, Name, Code )
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT ServiceTypes OFF;

-- Evaliation  Types
SET IDENTITY_INSERT EvaluationTypes ON;
MERGE INTO EvaluationTypes AS Target
USING (
VALUES
	( 1,'Initial Evaluation/Assessment'),
	( 2,'Re-evaluation/Re-assessment')

	) AS Source ( Id, Name )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN

UPDATE
   SET Name = Source.Name

-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name  )
	VALUES ( Id, Name )
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT EvaluationTypes OFF;







-- MessageFilterTypes
SET IDENTITY_INSERT MessageFilterTypes ON;
MERGE INTO MessageFilterTypes AS Target
USING (
VALUES
	( 1,'Global'),
	( 2,'ESC'),
    ( 3,'School Districts'),
    ( 4,'Service Code'),
    ( 5,'Provider Title'),
    ( 6,'Providers'),
    ( 7,'Login')
	) AS Source ( Id, Name )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN

UPDATE
   SET Name = Source.Name
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name  )
	VALUES ( Id, Name )
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT MessageFilterTypes OFF;


-- StudentTypes
SET IDENTITY_INSERT StudentTypes ON;
MERGE INTO StudentTypes AS Target
USING (
VALUES
	( 1,'IEP',1),
	( 2,'Intervention (NBS)',0),
    ( 3,'Consult Only (NBS)',0),
    ( 4,'504 (NBS)',0),
    ( 5,'IFSP (NBS)',0),
    ( 6,'IEP Non-Billable Minutes (NBS)',0)
	) AS Source ( Id, Name, IsBillable )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN

UPDATE
   SET Name = Source.Name,
  IsBillable =  Source.IsBillable
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name, IsBillable  )
	VALUES ( Id, Name, IsBillable )
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT StudentTypes OFF;


-- StudentDeviationReasons - COMMENTED OUT DUE TO BECOMING MANAGED LIST. KEEPING FOR REFERENCE
/*SET IDENTITY_INSERT StudentDeviationReasons ON;
MERGE INTO StudentDeviationReasons AS Target
USING (
VALUES
    ( 1,  'Student Absent'),
    ( 2,  'Therapist Absent'),
    ( 3,  'Field Trip'),
    ( 4,  'Discipline'),
    ( 5,  'Administrative'),
    ( 6,  'Other'),
    ( 7,  'Scheduling Conflict'),
    ( 8,  'Non-Covered Service'),
    ( 9,  'Holiday'),
    ( 10, 'School Cancellation'),
    ( 11, 'Assembly'),
    ( 12, 'Evaluation Cancelled'),
    ( 13, 'District Testing'),
    ( 14, 'Alt Schedule'),
    ( 15, 'Outside of IEP plan minutes')
) AS Source ( Id, Name )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN

UPDATE
   SET Name = Source.Name
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name  )
	VALUES ( Id, Name )
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT StudentDeviationReasons OFF;*/


-- ESignatureContents
IF NOT EXISTS (SELECT * FROM dbo.ESignatureContents)
BEGIN
  SET IDENTITY_INSERT ESignatureContents ON;
  MERGE INTO ESignatureContents AS Target
  USING (
  VALUES
    ( 1, 'Encounter ESignature', 'I, (Merged Provider Name), by submitting this service documentation for the professional service I provided to the student(s), acknowledge the following:
  Through this process, I am applying my electronic signature in the State of Ohio to the service documentation record that will be created and stored for the student(s). My electronic signature for this service will be identified by the legend "ELECTRONIC SIGNATURE - HPC assigned encounter number".
  I have not permitted any other individual to submit this record under my name.
        Apply my Electronic signature to these encounter(s)'),
    ( 2,'Referral Sign Off', 'As a licensed practitioner of the healing arts, acting within the scope of my practice, the above-named student is referred for an evaluation and, if warranted, further medically necessary services in accordance with this therapist''s recommendations and the IEP team.')
  ) AS Source ( Id, Name, Content )
  ON Target.Id = Source.Id
  -- update matched rows
  WHEN MATCHED THEN

  UPDATE
    SET Name = Source.Name,
    Content = Source.Content
  -- insert new rows
  WHEN NOT MATCHED BY TARGET THEN
    INSERT ( Id, Name, Content )
    VALUES ( Id, Name, Content )
  WHEN NOT MATCHED BY SOURCE THEN DELETE;
  SET IDENTITY_INSERT ESignatureContents OFF;
END;

-- Schools
SET IDENTITY_INSERT Schools ON;
MERGE INTO Schools AS Target
USING (
VALUES
	( 1,'Unknown'),
	( 2,'Out of District')
	) AS Source ( Id, Name )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN

UPDATE
   SET Name = Source.Name
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name)
	VALUES ( Id, Name);
SET IDENTITY_INSERT Schools OFF;

-- Nursing Goal Responses
SET IDENTITY_INSERT NursingGoalResponse ON;
MERGE INTO dbo.NursingGoalResponse AS Target
USING (
VALUES
    ( 1035,
      'Blood Pressure Monitoring',
      'BP = ',
      1
    ),
    ( 1039,
      'Catheterization/Catheter Care',
      '# of cc''s = ',
      1
    ),
    ( 1139,
      'Central Line Care',
      '',
      0
    ),
    ( 1127,
      'G-Tube Care/Feed/Maintenance',
      '',
      0
    ),
    ( 1061,
      'Glucose Monitoring',
      'BS level = ',
      1
    ),
    ( 1140,
      'Infection Control',
      '',
      0
    ),
    ( 1125,
      'Medication 1- Preparation/Administration of Medication per Qualified Medicaid Provider Order',
      '',
      0
    ),
    ( 1146,
      'Medication 2- Preparation/Administration of Medication per Qualified Medicaid Provider Order',
      '',
      0
    ),
    ( 1141,
      'Medication 3- Preparation/Administration of Medication per Qualified Medicaid Provider Order',
      '',
      0
    ),
    ( 1142,
      'Medication 4- Preparation/Administration of Medication per Qualified Medicaid Provider Order',
      '',
      0
    ),
    ( 1132,
      'Respiratory Management',
      '',
      0
    ),
    ( 1107,
      'Tracheotomy Care',
      '',
      0
    ),
    ( 1121,
      'Wound Care/Dressing Change',
      '',
      0
    ))
 AS Source ( Id, Name, ResponseNoteLabel, ResponseNote )
 ON Target.Id = Source.Id
 -- update matched rows
 WHEN MATCHED THEN
    UPDATE SET Name = Source.Name,
            ResponseNoteLabel = Source.ResponseNoteLabel,
            ResponseNote = Source.ResponseNote
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
    INSERT ( Id, Name, ResponseNoteLabel, ResponseNote )
    VALUES ( Id, Name, ResponseNoteLabel, ResponseNote )
-- Delete rows that are in the target but not the source
WHEN NOT MATCHED BY SOURCE THEN
    DELETE;
SET IDENTITY_INSERT NursingGoalResponse OFF;

-- Nursing Goal Responses
-- SET IDENTITY_INSERT NursingGoalResults ON;
-- MERGE INTO dbo.NursingGoalResults AS Target
-- USING (
-- VALUES
--     -- Blood Pressure Monitoring
--     ( 1,    -- ID
--       'Results above normal limits',  -- Name
--       1,    -- NursingresponseId
--       1,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 2,    -- ID
--       'Results below normal limits',  -- Name
--       1,    -- NursingresponseId
--       2,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 3,    -- ID
--       'Results within normal limits',  -- Name
--       1,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),

--     -- Catheterization/Catheter Care
--     ( 4,    -- ID
--       'Urine - blood visible',  -- Name
--       2,    -- NursingresponseId
--       1,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 5,    -- ID
--       'Urine - clear',  -- Name
--       2,    -- NursingresponseId
--       2,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 6,    -- ID
--       'Urine - cloudy',  -- Name
--       2,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),

--     -- Central Line Care
--     ( 7,    -- ID
--       'Line intact',  -- Name
--       3,    -- NursingresponseId
--       1,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 8,    -- ID
--       'No signs/symptoms of infection',  -- Name
--       3,    -- NursingresponseId
--       2,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 9,    -- ID
--       'Tolerated Well',  -- Name
--       3,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),

--     -- G-Tube Care/Feed/Maintenance
--     ( 10,    -- ID
--       'Delivered by bolus, amount delivered',  -- Name
--       4,    -- NursingresponseId
--       1,    -- Sort
--       1 -- ResultsNote
--     ),
--     ( 11,    -- ID
--       'Delivered by drip, amount delivered',  -- Name
--       4,    -- NursingresponseId
--       2,    -- Sort
--       1 -- ResultsNote
--     ),
--     ( 12,    -- ID
--       'G-tube flush',  -- Name
--       4,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 13,    -- ID
--       'G-tube vented, ____ cc’s of air',  -- Name
--       4,    -- NursingresponseId
--       4,    -- Sort
--       1 -- ResultsNote
--     ),
--     ( 14,    -- ID
--       'G-tube vented, no air present',  -- Name
--       4,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 15,    -- ID
--       'Tolerated Well',  -- Name
--       4,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 16,    -- ID
--       'Tube maintenance only',  -- Name
--       4,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),

--         -- Glucose Monitoring
--     ( 17,    -- ID
--       'Carb counting- results ',  -- Name
--       5,    -- NursingresponseId
--       1,    -- Sort
--       1 -- ResultsNote
--     ),
--     ( 18,    -- ID
--       'Results above normal limits',  -- Name
--       5,    -- NursingresponseId
--       2,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 19,    -- ID
--       'Results below normal limits',  -- Name
--       5,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 20,    -- ID
--       'Results within normal limits',  -- Name
--       5,    -- NursingresponseId
--       4,    -- Sort
--       0 -- ResultsNote
--     ),

--         -- Infection Control
--     ( 21,    -- ID
--       'No signs/symptoms of infection',  -- Name
--       6,    -- NursingresponseId
--       1,    -- Sort
--       0 -- ResultsNote
--     ),

--         -- IMedication 1- Preparation/Administration of Medication per Qualified Medicaid Provider Order
--     ( 22,    -- ID
--       'Inhaler (Non-Rescue) - Breath sounds clear',  -- Name
--       7,    -- NursingresponseId
--       1,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 23,    -- ID
--       'Inhaler (Non-Rescue) - Breathing comfortably',  -- Name
--       7,    -- NursingresponseId
--       2,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 24,    -- ID
--       'Inhaler (Non-Rescue) - No improvement',  -- Name
--       7,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 25,    -- ID
--       'Medication Administered w/o incident',  -- Name
--       7,    -- NursingresponseId
--       4,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 26,    -- ID
--       'Tolerated poorly or unable to deliver',  -- Name
--       7,    -- NursingresponseId
--       5,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 27,    -- ID
--       'Tolerated Well',  -- Name
--       7,    -- NursingresponseId
--       6,    -- Sort
--       0 -- ResultsNote
--     ),

--             -- IMedication 2- Preparation/Administration of Medication per Qualified Medicaid Provider Order
--     ( 28,    -- ID
--       'Inhaler (Non-Rescue) - Breath sounds clear',  -- Name
--       8,    -- NursingresponseId
--       1,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 29,    -- ID
--       'Inhaler (Non-Rescue) - Breathing comfortably',  -- Name
--       8,    -- NursingresponseId
--       2,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 30,    -- ID
--       'Inhaler (Non-Rescue) - No improvement',  -- Name
--       8,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 31,    -- ID
--       'Medication Administered w/o incident',  -- Name
--       8,    -- NursingresponseId
--       4,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 32,    -- ID
--       'Tolerated poorly or unable to deliver',  -- Name
--       8,    -- NursingresponseId
--       5,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 33,    -- ID
--       'Tolerated Well',  -- Name
--       8,    -- NursingresponseId
--       6,    -- Sort
--       0 -- ResultsNote
--     ),

--         -- IMedication 3- Preparation/Administration of Medication per Qualified Medicaid Provider Order
--     ( 34,    -- ID
--       'Inhaler (Non-Rescue) - Breath sounds clear',  -- Name
--       9,    -- NursingresponseId
--       1,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 35,    -- ID
--       'Inhaler (Non-Rescue) - Breathing comfortably',  -- Name
--       9,    -- NursingresponseId
--       2,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 36,    -- ID
--       'Inhaler (Non-Rescue) - No improvement',  -- Name
--       9,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 37,    -- ID
--       'Medication Administered w/o incident',  -- Name
--       9,    -- NursingresponseId
--       4,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 38,    -- ID
--       'Tolerated poorly or unable to deliver',  -- Name
--       9,    -- NursingresponseId
--       5,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 39,    -- ID
--       'Tolerated Well',  -- Name
--       9,    -- NursingresponseId
--       6,    -- Sort
--       0 -- ResultsNote
--     ),

--          -- IMedication 4- Preparation/Administration of Medication per Qualified Medicaid Provider Order
--     ( 40,    -- ID
--       'Inhaler (Non-Rescue) - Breath sounds clear',  -- Name
--       10,    -- NursingresponseId
--       1,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 41,    -- ID
--       'Inhaler (Non-Rescue) - Breathing comfortably',  -- Name
--       10,    -- NursingresponseId
--       2,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 42,    -- ID
--       'Inhaler (Non-Rescue) - No improvement',  -- Name
--       10,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 43,    -- ID
--       'Medication Administered w/o incident',  -- Name
--       10,    -- NursingresponseId
--       4,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 44,    -- ID
--       'Tolerated poorly or unable to deliver',  -- Name
--       10,    -- NursingresponseId
--       5,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 45,    -- ID
--       'Tolerated Well',  -- Name
--       10,    -- NursingresponseId
--       6,    -- Sort
--       0 -- ResultsNote
--     ),

--         -- Respiratory Management
--     ( 46,    -- ID
--       'Monitor pulse oximeter for blood O2 saturation',  -- Name
--       11,    -- NursingresponseId
--       1,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 47,    -- ID
--       'Nebulizer Treatment - Breathe sounds clear',  -- Name
--       11,    -- NursingresponseId
--       2,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 48,    -- ID
--       'Nebulizer Treatment - Breathing Comfortably',  -- Name
--       11,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 49,    -- ID
--       'Nebulizer Treatment - No improvement',  -- Name
--       11,    -- NursingresponseId
--       4,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 50,    -- ID
--       'Oral/nasopharyngeal suctioning',  -- Name
--       11,    -- NursingresponseId
--       5,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 51,    -- ID
--       'Oxygen Administration - liters_______/, minutes_____',  -- Name
--       11,    -- NursingresponseId
--       6,    -- Sort
--       1 -- ResultsNote
--     ),
--     ( 52,    -- ID
--       'Percussion and postural drainage',  -- Name
--       11,    -- NursingresponseId
--       7,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 53,    -- ID
--       'Rescue Inhaler - Breath sounds clear',  -- Name
--       11,    -- NursingresponseId
--       8,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 54,    -- ID
--       'Rescue Inhaler - Breathing Comfortably',  -- Name
--       11,    -- NursingresponseId
--       9,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 55,    -- ID
--       'Rescue Inhaler - No improvement',  -- Name
--       11,    -- NursingresponseId
--       10,    -- Sort
--       0 -- ResultsNote
--     ),

--         -- Tracheotomy Care
--     ( 56,    -- ID
--       'Maintenance / Cleaning',  -- Name
--       12,    -- NursingresponseId
--       1,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 57,    -- ID
--       'Placement of Cannula',  -- Name
--       12,    -- NursingresponseId
--       2,    -- Sort
--       0 -- ResultsNote
--     ),
--     ( 58,    -- ID
--       'Suctioning',  -- Name
--       12,    -- NursingresponseId
--       3,    -- Sort
--       0 -- ResultsNote
--     ),

--         -- Wound Care/Dressing Change
--     ( 59,    -- ID
--       'Small amount _____ drainage; no foul odor from wound',  -- Name
--       13,    -- NursingresponseId
--       1,    -- Sort
--       1 -- ResultsNote
--     )
--     )
--  AS Source ( Id, Name, NursingResponseId, Sort, ResultsNote )
--  ON Target.Id = Source.Id
--  -- update matched rows
--  WHEN MATCHED THEN
--     UPDATE SET Name = Source.Name,
--             NursingResponseId = Source.NursingResponseId,
--             Sort = Source.Sort,
--             ResultsNote = Source.ResultsNote
-- -- insert new rows
-- WHEN NOT MATCHED BY TARGET THEN
--     INSERT ( Id, Name, NursingResponseId, Sort, ResultsNote )
--     VALUES ( Id, Name, NursingResponseId, Sort, ResultsNote )
-- -- Delete rows that are in the target but not the source
-- WHEN NOT MATCHED BY SOURCE THEN
--     DELETE;
-- SET IDENTITY_INSERT NursingGoalResults OFF;



-- EncounterStatuses
SET IDENTITY_INSERT EncounterStatuses ON;
MERGE INTO EncounterStatuses AS Target
USING (
VALUES
	( 1,  'New', 1, 0, 0, 0),
	( 2,  'E-Signed', 1, 0, 0, 0),
    ( 3,  'Approve Encounter', 0, 0, 0, 1),
    ( 4,  'Hold For Research', 1, 0, 0, 1),
    ( 5,  'Do Not Bill (Provider Ineligible)', 0, 0, 0, 1),
    ( 6,  'Returned By Admin', 0, 0, 1, 0),
    ( 7,  'Returned By Supervisor', 0, 0, 0, 0),
    ( 8,  'Abandoned', 0, 0, 1, 1),
    ( 9,  'Ready For Supervisor E-Signature', 0, 0, 0, 0),
    ( 10, 'Non MSP Service', 0, 0, 0, 0),
    ( 11, 'Student Non IEP', 0, 0, 0, 0),
    ( 12, 'Deviated', 0, 0, 0, 0),
    ( 13, 'Open Encounter Ready For You', 0, 0, 0, 0),
    ( 14, 'Pending Treatment/Therapy', 0, 0, 0, 0),
    ( 15, 'Pending Evaluation/Assessment', 0, 0, 0, 0),
    ( 16, 'Non Consent', 0, 0, 0, 1),
    ( 17, 'Encounter Entered Prior to Consent', 0, 0, 0, 1),
    ( 18, 'No Referral', 0, 0, 0, 1),
    ( 19, 'Encounter Entered Prior to Referral', 0, 0, 0, 1),
    ( 20, 'Address Issue', 0, 0, 0, 1),
    ( 21, 'Invoiced', 0, 0, 0, 1),
    ( 22, 'Invoiced and Paid', 0, 0, 0, 1),
    ( 23, 'Invoiced and Denied', 0, 0, 0, 1),
    ( 24, 'Invoice 0 service units', 0, 0, 0, 1),
    ( 25, 'Not a medicaid student', 0, 0, 0, 1),
    ( 26, 'Claims older than 365 Days', 0, 0, 0, 1),
    ( 27, 'Pending Consent', 0, 0, 0, 1),
    ( 28, 'Corrected Return', 0, 0, 0, 1),
    ( 29, 'Abandoned Claim', 0, 0, 0, 1),
    ( 30, 'Ready For Billing', 0, 1, 0, 1),
    ( 31, 'Scheduled For Reversal', 1, 1, 1, 1),
    ( 32, 'Denied and Rebilled', 0, 1, 0, 1),
    ( 33, 'Missing Medicaid Number', 0, 0, 0, 1),
    ( 34, 'Pending Reversal', 0, 0, 0, 1),
    ( 35, 'Do Not Bill', 0, 0, 1, 1),
    ( 36, 'Paid And Reversed', 0, 0, 0, 1),
    ( 37, 'Service Unit Rule Violation', 0, 0, 0, 1)
	) AS Source ( Id, Name, IsAuditable, IsBillable, ForReview, HPCAdminOnly)
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN

UPDATE
   SET Name = Source.Name,
   IsAuditable = Source.IsAuditable,
   IsBillable = Source.IsBillable,
   ForReview = Source.ForReview,
   HPCAdminOnly = Source.HPCAdminOnly
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, Name, IsAuditable, IsBillable, ForReview, HPCAdminOnly)
	VALUES ( Id, Name, IsAuditable, IsBillable, ForReview, HPCAdminOnly)
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT EncounterStatuses OFF;

-- EdiFileTypes
SET IDENTITY_INSERT EdiFileTypes ON;
MERGE INTO EdiFileTypes AS Target
USING (
VALUES
	( 1, '837', 'Health Care Claim', 0),
	( 2, '835', 'Health Care Claim Response', 1),
	( 3, '270', 'Medicaid Match', 0),
	( 4, '271', 'Medicaid Match Response', 1)
	) AS Source ( Id, EdiFileFormat, Name, IsResponse )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN

UPDATE
   SET EdiFileFormat = Source.EdiFileFormat,
   Name = Source.Name,
   IsResponse = Source.IsResponse
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( Id, EdiFileFormat, Name, IsResponse )
	VALUES ( Id, EdiFileFormat, Name, IsResponse )
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT EdiFileTypes OFF;

-- EdiMetaDatas
SET IDENTITY_INSERT EdiMetaDatas ON;
MERGE INTO EdiMetaDatas AS Target
USING (
VALUES
	(   1,
        13345,
        'MMISODJFS',
        '005010X222A1',
        '005010X279A1',
        'HPC INC',
        'IC',
        'FRANK BRESKY',
        '6149853631',
        '6147851125',
        'FNBHPC@AOL.COM',
        'OH DEPARTMENT OF JOB AND FAMILY SER',
        'BI',
        'PXC',
        'OH DEPARTMENT OF JOB AND FAMILY SER',
        '03:B:1',
        'ATTEST YES',
        '8'
    )
	) AS Source (
        Id,
        SenderId,
        ReceiverId,
        ClaimImplementationReference,
        RosterValidationImplementationReference,
        SubmitterOrganizationName,
	    SubmitterQlfrId,
        SubmitterName,
        SubmitterPhone,
        SubmitterPhoneAlt,
        SubmitterEmail,
        ReceiverOrganizationName,
	    ProviderCode,
	    ReferenceQlfrId,
        ProviderOrganizationName,
        ServiceLocationCode,
        ClaimNoteDescription,
        FacilityCode
    )
ON Target.Id = Source.Id
-- update matched rows
WHEN MATCHED THEN

UPDATE
   SET SenderId = Source.SenderId,
       ReceiverId = Source.ReceiverId,
       ClaimImplementationReference = Source.ClaimImplementationReference,
       RosterValidationImplementationReference = Source.RosterValidationImplementationReference,
       SubmitterOrganizationName = Source.SubmitterOrganizationName,
       SubmitterQlfrId = Source.SubmitterQlfrId,
       SubmitterName = Source.SubmitterName,
       SubmitterPhone = Source.SubmitterPhone,
       SubmitterPhoneAlt = Source.SubmitterPhoneAlt,
       SubmitterEmail = Source.SubmitterEmail,
       ReceiverOrganizationName = Source.ReceiverOrganizationName,
       ProviderCode = Source.ProviderCode,
       ReferenceQlfrId = Source.ReferenceQlfrId,
       ProviderOrganizationName = Source.ProviderOrganizationName,
       ServiceLocationCode = Source.ServiceLocationCode,
       ClaimNoteDescription = Source.ClaimNoteDescription,
       FacilityCode = Source.FacilityCode
-- insert new rows
WHEN NOT MATCHED BY TARGET THEN
	INSERT (
        Id,
        SenderId,
        ReceiverId,
        ClaimImplementationReference,
        RosterValidationImplementationReference,
        SubmitterOrganizationName,
	    SubmitterQlfrId,
        SubmitterName,
        SubmitterPhone,
        SubmitterPhoneAlt,
        SubmitterEmail,
        ReceiverOrganizationName,
	    ProviderCode,
	    ReferenceQlfrId,
        ProviderOrganizationName,
        ServiceLocationCode,
        ClaimNoteDescription,
        FacilityCode
    )
	VALUES (
        Id,
        SenderId,
        ReceiverId,
        ClaimImplementationReference,
        RosterValidationImplementationReference,
        SubmitterOrganizationName,
	    SubmitterQlfrId,
        SubmitterName,
        SubmitterPhone,
        SubmitterPhoneAlt,
        SubmitterEmail,
        ReceiverOrganizationName,
	    ProviderCode,
	    ReferenceQlfrId,
        ProviderOrganizationName,
        ServiceLocationCode,
        ClaimNoteDescription,
        FacilityCode
    )
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT EdiMetaDatas OFF;

-- Do Not Bill Reasons
MERGE INTO dbo.ProviderInactivityReasons AS Target
USING (VALUES
	(1, 'Leave of Absence', 'LOA'),
	(2, 'Exit', 'EXT'),
    (3, 'License Issue', 'LIC'),
    (4, 'Deceased', 'DEC'),
    (5, 'Other', 'OTH')
) AS Source(Id, Name, Code)
ON Source.Id = Target.Id
WHEN MATCHED THEN
	UPDATE SET
        Target.Name = Source.Name,
        Target.Code = Source.Code
WHEN NOT MATCHED BY TARGET THEN
	INSERT (Id, Name, Code)
	VALUES (Source.Id, Source.Name, Source.Code)
WHEN NOT MATCHED BY SOURCE THEN DELETE;

-- AnnualEntryStatuses
SET IDENTITY_INSERT AnnualEntryStatuses ON;
MERGE INTO dbo.AnnualEntryStatuses AS Target
USING (VALUES
	(1, 'Paid'),
	(2, 'Pending')
) AS Source(Id, Name)
ON Source.Id = Target.Id
WHEN MATCHED THEN
	UPDATE SET
        Target.Name = Source.Name
WHEN NOT MATCHED BY TARGET THEN
	INSERT (Id, Name)
	VALUES (Source.Id, Source.Name)
WHEN NOT MATCHED BY SOURCE THEN DELETE;
SET IDENTITY_INSERT AnnualEntryStatuses OFF;
