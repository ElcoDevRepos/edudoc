-- WhitespaceCleanup.sql
-- Trims leading and trailing whitespace from a column in a specified table
-- Replace @TableName and @ColumnName with your actual table and column names
-- WARNING: Run this only after confirming issues with WhitespaceIssueFinder.sql
-- Make sure to create a backup or run this in a transaction first

DECLARE @TableName NVARCHAR(128) = 'Addresses';  -- Default to Addresses table
DECLARE @ColumnName NVARCHAR(128) = 'Address1';  -- Default to Address1 column
DECLARE @PrimaryKeyColumn NVARCHAR(128) = 'Id'; -- Assumes a primary key named Id, change if different

DECLARE @SQL NVARCHAR(MAX);

-- Begin transaction for safety - you can commit after reviewing changes
BEGIN TRANSACTION;

SET @SQL = N'
-- Show the records that will be changed (before)
SELECT 
    ' + QUOTENAME(@PrimaryKeyColumn) + ' AS [Primary Key],
    ' + QUOTENAME(@ColumnName) + ' AS [Original Value],
    LTRIM(RTRIM(' + QUOTENAME(@ColumnName) + ')) AS [Trimmed Value],
    CASE
        WHEN ' + QUOTENAME(@ColumnName) + ' LIKE ''% '' THEN ''Has trailing spaces''
        WHEN ' + QUOTENAME(@ColumnName) + ' LIKE '' %'' THEN ''Has leading spaces''
        WHEN ' + QUOTENAME(@ColumnName) + ' LIKE '' %'' AND ' + QUOTENAME(@ColumnName) + ' LIKE ''% '' THEN ''Has both leading and trailing spaces''
    END AS WhitespaceIssue
FROM
    ' + QUOTENAME(@TableName) + '
WHERE
    ' + QUOTENAME(@ColumnName) + ' IS NOT NULL
    AND (' + QUOTENAME(@ColumnName) + ' LIKE ''% '' OR ' + QUOTENAME(@ColumnName) + ' LIKE '' %'');

-- Update the records to trim whitespace
UPDATE ' + QUOTENAME(@TableName) + '
SET ' + QUOTENAME(@ColumnName) + ' = LTRIM(RTRIM(' + QUOTENAME(@ColumnName) + '))
WHERE
    ' + QUOTENAME(@ColumnName) + ' IS NOT NULL
    AND (' + QUOTENAME(@ColumnName) + ' LIKE ''% '' OR ' + QUOTENAME(@ColumnName) + ' LIKE '' %'');';

EXEC sp_executesql @SQL;

-- Count how many records were updated
SET @SQL = N'
SELECT 
    @@ROWCOUNT AS [Records Updated];
';

EXEC sp_executesql @SQL;

-- Uncomment to commit the changes
-- COMMIT TRANSACTION;

-- Or rollback if you want to cancel the changes
ROLLBACK TRANSACTION; 