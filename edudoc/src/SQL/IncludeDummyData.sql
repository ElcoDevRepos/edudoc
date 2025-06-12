print ('including dummy data')

-- User Roles
SET IDENTITY_INSERT UserRoles ON;
MERGE INTO UserRoles AS Target
USING (VALUES
	(3, 'Underling', 1),
	(4, 'Rookie-of-the-Year', 1),
	(5, 'Captain', 1)
) AS Source([Id], [Name], [IsEditable])
ON (Target.Id = Source.Id)
WHEN MATCHED THEN UPDATE SET
	Name = Source.Name,
	Target.IsEditable = Source.IsEditable
WHEN NOT MATCHED BY TARGET THEN
	INSERT (Id, Name, IsEditable)
	VALUES (Source.Id, Source.Name, Source.IsEditable);
SET IDENTITY_INSERT UserRoles OFF;

-- Auth User
SET IDENTITY_INSERT [AuthUsers] ON;
MERGE INTO [AuthUsers] AS Target
USING (
VALUES
	( 2 ,'wtaft' ,@saltedHash ,@salt ,0x,1, 1),
	( 3 ,'gcleveland' ,@saltedHash ,@salt ,0x,1, 1),
	( 4 ,'gwashington' ,@saltedHash ,@salt ,0x,1, 1),
	( 5 ,'rhayes' ,@saltedHash ,@salt ,0x,1, 1),
	( 6 ,'htruman' ,@saltedHash ,@salt ,0x,1, 1),
	( 7 ,'froosevelt' ,@saltedHash ,@salt ,0x,1, 1),
	( 8 ,'ctaft' ,@saltedHash ,@salt ,0x,1, 1),
	( 9 ,'wharrison' ,@saltedHash ,@salt ,0x,1, 1),
	( 10 ,'mvanburen' ,@saltedHash ,@salt ,0x,1, 1),
	( 11 ,'ztaylor' ,@saltedHash ,@salt ,0x,1, 1),
	( 12 ,'jpolk' ,@saltedHash ,@salt ,0x,1, 1)
	 ) AS Source ( [Id], [Username], [Password], [Salt], [ResetKey], [RoleId], [IsEditable] )
ON ( Target.[Id] = Source.[Id] )
WHEN MATCHED THEN
	UPDATE SET [Username] = Source.[Username] ,
			   [Password] = Source.[Password] ,
			   [Salt] = Source.[Salt] ,
			   [ResetKey] = Source.[ResetKey] ,
			   [RoleId] = SOURCE.[RoleId],
			   [IsEditable] = SOURCE.[IsEditable]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( [Id] ,
			 [Username] ,
			 [Password] ,
			 [Salt] ,
			 [ResetKey] ,
			 [RoleId],
			 [IsEditable]
		   )
	VALUES ( Source.[Id] ,
			 Source.[Username] ,
			 Source.[Password] ,
			 Source.[Salt] ,
			 Source.[ResetKey] ,
			 Source.[RoleId],
			 [IsEditable]
		   );
SET IDENTITY_INSERT [AuthUsers] OFF;

-- Addresses
SET IDENTITY_INSERT [Addresses] ON;
MERGE INTO [Addresses] AS Target
USING (
VALUES
	( 1 , '0 Grasskamp Place' , '' , 'Bloomington' , 'IL' , '61709', 'US', '')
 ,  ( 2 , '140 Mallory Court' , '' , 'Saint Louis' , 'MO' , '63158', 'US', '')
 ,  ( 3 , '3 Vahlen Parkway' , '' , 'Salt Lake City' , 'UT' , '84189', 'US', '')
 ,  ( 4 , '9436 6th Court' , '' , 'Carol Stream' , 'IL' , '60158', 'US', '')
 ,  ( 5 , '86 Sundown Drive' , '' , 'Topeka' , 'KS' , '66667', 'US', '')
 ,  ( 6 , '2160 Manley Circle' , '' , 'Orange' , 'CA' , '92862', 'US', '')
 ,  ( 7 , '3 Laurel Alley' , '' , 'Modesto' , 'CA' , '95354', 'US', '')
 ,  ( 8 , '7 Mandrake Plaza' , '' , 'Farmington' , 'MI' , '48335', 'US', '')
 ,  ( 9 , '98862 Nevada Court' , '' , 'Houston' , 'TX' , '77276', 'US', '')
 ,  ( 10 , '7 7th Junction' , '' , 'Dallas' , 'TX' , '75205', 'US', '')
 ,  ( 11 , '5 Blue Bill Park Pass' , '' , 'Providence' , 'RI' , '02912', 'US', '')
 ,  ( 12 , '379 Sachs Junction' , '' , 'Little Rock' , 'AR' , '72204', 'US', '')
 ,  ( 13 , '615 Corben Court' , '' , 'Phoenix' , 'AZ' , '85045', 'US', '')
 ,  ( 14 , '2 Fisk Street' , '' , 'Washington' , 'DC' , '20404', 'US', '')
 ,  ( 15 , '169 Bobwhite Way' , '' , 'Orlando' , 'FL' , '32825', 'US', '')
 ,  ( 16 , '9 Bluejay Way' , '' , 'Milwaukee' , 'WI' , '53205', 'US', '')
 ,  ( 17 , '6 Meadow Vale Pass' , '' , 'San Antonio' , 'TX' , '78255', 'US', '')
 ,  ( 18 , '30 Eastlawn Terrace' , '' , 'Jersey City' , 'NJ' , '07310', 'US', '')
 ,  ( 19 , '590 Granby Court' , '' , 'Inglewood' , 'CA' , '90310', 'US', '')
 ,  ( 20 , '6 Hintze Parkway' , '' , 'Saint Louis' , 'MO' , '63143', 'US', '')
 ,  ( 21 , '3 Vermont Avenue' , '' , 'Roanoke' , 'VA' , '24029', 'US', '')
 ,  ( 22 , '82235 Utah Point' , '' , 'Oxnard' , 'CA' , '93034', 'US', '')
 ,  ( 23 , '9053 Macpherson Way' , '' , 'Knoxville' , 'TN' , '37924', 'US', '')
 ,  ( 24 , '41 Jana Crossing' , '' , 'Jacksonville' , 'FL' , '32230', 'US', '')
 ,  ( 25 , '56083 American Point' , '' , 'Atlanta' , 'GA' , '30375', 'US', '')
 ,  ( 26 , '96568 Mccormick Road' , '' , 'Hamilton' , 'OH' , '45020', 'US', '')
 ,  ( 27 , '75383 Manufacturers Center' , '' , 'Birmingham' , 'AL' , '35290', 'US', '')
 ,  ( 28 , '6 Starling Road' , '' , 'Amarillo' , 'TX' , '79159', 'US', '')
 ,  ( 29 , '4313 Algoma Avenue' , '' , 'Loretto' , 'MN' , '55598', 'US', '')
 ,  ( 30 , '665 Maryland Avenue' , '' , 'San Diego' , 'CA' , '92186', 'US', '')
 ,  ( 31 , '5827 Commercial Trail' , '' , 'Vancouver' , 'WA' , '98664', 'US', '')
 ,  ( 32 , '34306 Scoville Trail' , '' , 'Valdosta' , 'GA' , '31605', 'US', '')
 ,  ( 33 , '86583 Sommers Court' , '' , 'Lancaster' , 'PA' , '17622', 'US', '')
 ,  ( 34 , '4294 Monument Hill' , '' , 'Philadelphia' , 'PA' , '19196', 'US', '')
 ,  ( 35 , '15317 Sage Pass' , '' , 'Jackson' , 'MS' , '39216', 'US', '')
 ,  ( 36 , '81 Carey Court' , '' , 'San Angelo' , 'TX' , '76905', 'US', '')
 ,  ( 37 , '24 Declaration Way' , '' , 'Portland' , 'OR' , '97271', 'US', '')
 ,  ( 38 , '947 Anhalt Drive' , '' , 'Cleveland' , 'OH' , '44191', 'US', '')
 ,  ( 39 , '02 Sachs Park' , '' , 'San Bernardino' , 'CA' , '92415', 'US', '')
 ,  ( 40 , '9484 Melby Hill' , '' , 'Pueblo' , 'CO' , '81015', 'US', '')
 ,  ( 41 , '37 Talisman Parkway' , '' , 'Sandy' , 'UT' , '84093', 'US', '')
 ,  ( 42 , '52 Delaware Park' , '' , 'Arlington' , 'VA' , '22205', 'US', '')
 ,  ( 43 , '22617 Briar Crest Plaza' , '' , 'Cleveland' , 'OH' , '44118', 'US', '')
 ,  ( 44 , '410 Independence Alley' , '' , 'Lincoln' , 'NE' , '68505', 'US', '')
 ,  ( 45 , '7553 Vermont Junction' , '' , 'Sioux Falls' , 'SD' , '57193', 'US', '')
 ,  ( 46 , '50608 Beilfuss Trail' , '' , 'Tampa' , 'FL' , '33605', 'US', '')
 ,  ( 47 , '4387 Emmet Alley' , '' , 'Baltimore' , 'MD' , '21282', 'US', '')
 ,  ( 48 , '715 Doe Crossing Hill' , '' , 'Fairbanks' , 'AK' , '99709', 'US', '')
 ,  ( 49 , '1 Express Crossing' , '' , 'Nashville' , 'TN' , '37220', 'US', '')
 ,  ( 50 , '7352 Kingsford Park' , '' , 'Providence' , 'RI' , '02905', 'US', '')
 ,  ( 51 , '8 Mccormick Street' , '' , 'Denver' , 'CO' , '80217', 'US', '')
 ,  ( 52 , '783 John Wall Park' , '' , 'San Antonio' , 'TX' , '78285', 'US', '')
 ,  ( 53 , '14 Porter Trail' , '' , 'Durham' , 'NC' , '27710', 'US', '')
 ,  ( 54 , '79 Prairie Rose Lane' , '' , 'Canton' , 'OH' , '44720', 'US', '')
 ,  ( 55 , '92295 Barby Lane' , '' , 'Dallas' , 'TX' , '75246', 'US', '')
 ,  ( 56 , '948 West Drive' , '' , 'Charleston' , 'WV' , '25362', 'US', '')
 ,  ( 57 , '71927 Scofield Drive' , '' , 'Mc Keesport' , 'PA' , '15134', 'US', '')
 ,  ( 58 , '25 Lotheville Drive' , '' , 'Zephyrhills' , 'FL' , '33543', 'US', '')
 ,  ( 59 , '8148 Nevada Circle' , '' , 'San Antonio' , 'TX' , '78235', 'US', '')
 ,  ( 60 , '42 Dovetail Circle' , '' , 'Santa Cruz' , 'CA' , '95064', 'US', '')
 ,  ( 61 , '13938 Declaration Pass' , '' , 'Louisville' , 'KY' , '40250', 'US', '')
 ,  ( 62 , '7781 Commercial Crossing' , '' , 'Sacramento' , 'CA' , '95852', 'US', '')
 ,  ( 63 , '592 Randy Trail' , '' , 'El Paso' , 'TX' , '79999', 'US', '')
 ,  ( 64 , '63 Carey Avenue' , '' , 'Syracuse' , 'NY' , '13210', 'US', '')
 ,  ( 65 , '2 Union Terrace' , '' , 'Columbus' , 'GA' , '31904', 'US', '')
 ,  ( 66 , '0 Spaight Place' , '' , 'Billings' , 'MT' , '59105', 'US', '')
 ,  ( 67 , '9 Schmedeman Center' , '' , 'Jackson' , 'MS' , '39204', 'US', '')
 ,  ( 68 , '72 Manley Street' , '' , 'North Little Rock' , 'AR' , '72118', 'US', '')
 ,  ( 69 , '663 Service Junction' , '' , 'Las Vegas' , 'NV' , '89125', 'US', '')
 ,  ( 70 , '4765 High Crossing Point' , '' , 'Arvada' , 'CO' , '80005', 'US', '')
 ,  ( 71 , '50 Birchwood Parkway' , '' , 'Sacramento' , 'CA' , '94280', 'US', '')
 ,  ( 72 , '9 Dapin Drive' , '' , 'Shreveport' , 'LA' , '71161', 'US', '')
 ,  ( 73 , '94757 Jana Drive' , '' , 'Dallas' , 'TX' , '75367', 'US', '')
 ,  ( 74 , '1046 Rockefeller Way' , '' , 'Sacramento' , 'CA' , '95828', 'US', '')
 ,  ( 75 , '6 Ohio Way' , '' , 'Burbank' , 'CA' , '91520', 'US', '')
 ,  ( 76 , '387 Sheridan Parkway' , '' , 'Virginia Beach' , 'VA' , '23454', 'US', '')
 ,  ( 77 , '6 Ludington Parkway' , '' , 'Canton' , 'OH' , '44720', 'US', '')
 ,  ( 78 , '214 Hoffman Hill' , '' , 'Seattle' , 'WA' , '98109', 'US', '')
 ,  ( 79 , '265 Kipling Way' , '' , 'San Luis Obispo' , 'CA' , '93407', 'US', '')
 ,  ( 80 , '84 Reinke Alley' , '' , 'Des Moines' , 'IA' , '50305', 'US', '')
 ,  ( 81 , '4839 Jackson Road' , '' , 'Hayward' , 'CA' , '94544', 'US', '')
 ,  ( 82 , '7 Mandrake Avenue' , '' , 'Hattiesburg' , 'MS' , '39404', 'US', '')
 ,  ( 83 , '09 Leroy Trail' , '' , 'Fort Worth' , 'TX' , '76115', 'US', '')
 ,  ( 84 , '6 Delladonna Plaza' , '' , 'El Paso' , 'TX' , '88569', 'US', '')
 ,  ( 85 , '767 Granby Plaza' , '' , 'Seattle' , 'WA' , '98104', 'US', '')
 ,  ( 86 , '65649 Luster Hill' , '' , 'Cincinnati' , 'OH' , '45296', 'US', '')
 ,  ( 87 , '3 Blaine Crossing' , '' , 'Jefferson City' , 'MO' , '65105', 'US', '')
 ,  ( 88 , '8977 Hooker Circle' , '' , 'Saint Petersburg' , 'FL' , '33731', 'US', '')
 ,  ( 89 , '955 Pierstorff Avenue' , '' , 'Hayward' , 'CA' , '94544', 'US', '')
 ,  ( 90 , '73 Monica Plaza' , '' , 'Fort Wayne' , 'IN' , '46852', 'US', '')
 ,  ( 91 , '72915 Service Circle' , '' , 'Dallas' , 'TX' , '75241', 'US', '')
 ,  ( 92 , '55093 Fordem Terrace' , '' , 'Raleigh' , 'NC' , '27610', 'US', '')
 ,  ( 93 , '96900 Victoria Plaza' , '' , 'Fayetteville' , 'NC' , '28305', 'US', '')
 ,  ( 94 , '91 Farmco Terrace' , '' , 'Denver' , 'CO' , '80223', 'US', '')
 ,  ( 95 , '586 Chive Court' , '' , 'Toledo' , 'OH' , '43699', 'US', '')
 ,  ( 96 , '29337 Transport Way' , '' , 'Charleston' , 'WV' , '25331', 'US', '')
 ,  ( 97 , '149 Logan Road' , '' , 'Virginia Beach' , 'VA' , '23454', 'US', '')
 ,  ( 98 , '875 Summerview Terrace' , '' , 'Memphis' , 'TN' , '38188', 'US', '')
 ,  ( 99 , '161 Bowman Road' , '' , 'Whittier' , 'CA' , '90610', 'US', '')
 ,  ( 100 , '8 Cardinal Hill' , '' , 'Tuscaloosa' , 'AL' , '35487', 'US', '')
	 ) AS Source ( [ID], [Address1], [Address2],
					[City], [StateCode], [Zip], [CountryCode], [Province] )
ON ( Target.[ID] = Source.[ID] )
WHEN MATCHED AND ( NULLIF(Source.[Address1], Target.[Address1]) IS NOT NULL
				   OR NULLIF(Target.[Address1], Source.[Address1]) IS NOT NULL
				   OR NULLIF(Source.[Address2], Target.[Address2]) IS NOT NULL
				   OR NULLIF(Target.[Address2], Source.[Address2]) IS NOT NULL
				   OR NULLIF(Source.[City], Target.[City]) IS NOT NULL
				   OR NULLIF(Target.[City], Source.[City]) IS NOT NULL
				   OR NULLIF(Source.[StateCode], Target.[StateCode]) IS NOT NULL
				   OR NULLIF(Target.[StateCode], Source.[StateCode]) IS NOT NULL
				   OR NULLIF(Source.[Zip], Target.[Zip]) IS NOT NULL
				   OR NULLIF(Target.[Zip], Source.[Zip]) IS NOT NULL
				   OR NULLIF(Source.[CountryCode], Target.[CountryCode]) IS NOT NULL
				   OR NULLIF(Target.[CountryCode], Source.[CountryCode]) IS NOT NULL
				   OR NULLIF(Source.[Province], Target.[Province]) IS NOT NULL
				   OR NULLIF(Target.[Province], Source.[Province]) IS NOT NULL
				 ) THEN
	UPDATE SET [Address1] = Source.[Address1] ,
			   [Address2] = Source.[Address2] ,
			   [City] = Source.[City] ,
			   [StateCode] = Source.[StateCode] ,
			   [Zip] = Source.[Zip] ,
               [CountryCode] = Source.[CountryCode] ,
               [Province] = Source.[Province]
WHEN NOT MATCHED BY TARGET THEN
	INSERT ( [ID] ,
			 [Address1] ,
			 [Address2] ,
			 [City] ,
			 [StateCode] ,
			 [Zip] ,
             [CountryCode] ,
             [Province] 
		   )
	VALUES ( Source.[ID] ,
			 Source.[Address1] ,
			 Source.[Address2] ,
			 Source.[City] ,
			 Source.[StateCode] ,
			 Source.[Zip] ,
             Source.[CountryCode] ,
             Source.[Province]
		   );
SET IDENTITY_INSERT Addresses OFF;

-- User
SET IDENTITY_INSERT dbo.Users ON;
MERGE INTO Users AS Target
USING (VALUES 
(2, 'William', 'Taft', 'taft@4miles.com', NULL, 2),
(3, 'Grover', 'Cleveland', 'geeclee@4miles.com', NULL, 3),
(4, 'George', 'Washington', 'washington@4miles.com', NULL, 4),
(5, 'Rutherford', 'Hayes', 'hayes@4miles.com', NULL, 5),
(6, 'Harry', 'Truman', 'truman@4miles.com', NULL, 6),
(7, 'Franklin', 'Roosevelt', 'roosevelt@4miles.com', NULL, 7),
(8, 'Coy', 'Taft', 'coytaft@4miles.com', NULL, 8),
(9, 'William', 'Harrison', 'harrison@4miles.com', NULL, 9),
(10, 'Martin', 'Van Buren', 'vanburen@4miles.com', NULL, 10),
(11, 'Zachary', 'Taylor', 'taylor@4miles.com', NULL, 11),
(12, 'James', 'Polk', 'polk@4miles.com', NULL, 12)
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

