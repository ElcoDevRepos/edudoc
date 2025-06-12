-- WhitespaceIssueFinder.sql
-- Lists all entries in a column that have leading or trailing whitespace
-- If @TableName and @ColumnName are left empty, it will scan all tables and columns

DECLARE @TableName NVARCHAR(128) = '';  -- Leave empty to scan all tables
DECLARE @ColumnName NVARCHAR(128) = '';  -- Leave empty to scan all columns

-- Create a temporary table to store results
CREATE TABLE #WhitespaceResults (
    TableName NVARCHAR(128),
    ColumnName NVARCHAR(128),
    AffectedRows INT,
    IssueType NVARCHAR(50)
);

DECLARE @SQL NVARCHAR(MAX);
DECLARE @CurrentTable NVARCHAR(128);
DECLARE @CurrentColumn NVARCHAR(128);

-- Cursor to iterate through all string columns in all tables
DECLARE ColumnCursor CURSOR FOR
SELECT 
    t.name AS TableName,
    c.name AS ColumnName
FROM sys.tables t
JOIN sys.columns c ON t.object_id = c.object_id
JOIN sys.types ty ON c.user_type_id = ty.user_type_id
WHERE 
    (@TableName = '' OR t.name = @TableName)
    AND (@ColumnName = '' OR c.name = @ColumnName)
    AND ty.name IN ('varchar', 'nvarchar', 'char', 'nchar', 'text', 'ntext');

OPEN ColumnCursor;
FETCH NEXT FROM ColumnCursor INTO @CurrentTable, @CurrentColumn;

WHILE @@FETCH_STATUS = 0
BEGIN
    SET @SQL = N'
    INSERT INTO #WhitespaceResults (TableName, ColumnName, AffectedRows, IssueType)
    SELECT 
        ''' + @CurrentTable + ''' AS TableName,
        ''' + @CurrentColumn + ''' AS ColumnName,
        COUNT(*) AS AffectedRows,
        CASE
            WHEN ' + QUOTENAME(@CurrentColumn) + ' LIKE ''% '' AND ' + QUOTENAME(@CurrentColumn) + ' LIKE '' %'' THEN ''Has both leading and trailing spaces''
            WHEN ' + QUOTENAME(@CurrentColumn) + ' LIKE ''% '' THEN ''Has trailing spaces''
            WHEN ' + QUOTENAME(@CurrentColumn) + ' LIKE '' %'' THEN ''Has leading spaces''
        END AS IssueType
    FROM ' + QUOTENAME(@CurrentTable) + '
    WHERE ' + QUOTENAME(@CurrentColumn) + ' IS NOT NULL
    AND (' + QUOTENAME(@CurrentColumn) + ' LIKE ''% '' OR ' + QUOTENAME(@CurrentColumn) + ' LIKE '' %'')
    GROUP BY 
        CASE
            WHEN ' + QUOTENAME(@CurrentColumn) + ' LIKE ''% '' AND ' + QUOTENAME(@CurrentColumn) + ' LIKE '' %'' THEN ''Has both leading and trailing spaces''
            WHEN ' + QUOTENAME(@CurrentColumn) + ' LIKE ''% '' THEN ''Has trailing spaces''
            WHEN ' + QUOTENAME(@CurrentColumn) + ' LIKE '' %'' THEN ''Has leading spaces''
        END';

    EXEC sp_executesql @SQL;
    
    FETCH NEXT FROM ColumnCursor INTO @CurrentTable, @CurrentColumn;
END

CLOSE ColumnCursor;
DEALLOCATE ColumnCursor;

-- Display results
SELECT 
    TableName,
    ColumnName,
    IssueType,
    AffectedRows
FROM #WhitespaceResults
ORDER BY 
    TableName,
    ColumnName,
    IssueType;

-- Clean up
DROP TABLE #WhitespaceResults;
