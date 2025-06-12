/*
DATABASE ROW COUNT COMPARISON SCRIPT GENERATOR

Purpose:
This script generates a SQL query that can be run on a second database to compare 
row counts between two databases. It identifies tables that have different numbers 
of rows between the databases. I wanted to know if the data set up by the post
deployment script was an accurate representation of the data in prod for things
like value lists etc.

How to use:
1. Run this script on your first/source database
2. Copy the output from the Results pane
3. Run that output script on your second/target database
4. The results will show:
   - TableName: The schema and table name
   - FirstDBCount: Number of rows in the first database
   - SecondDBCount: Number of rows in the second database
   - Difference: "X" if counts differ, empty string if they match

The results are sorted to show tables with differences first.

Note: This script only includes tables that have at least one row in the first database.
*/

-- Run this on your first database to generate a script for the second database
DECLARE @SQL NVARCHAR(MAX) = 
'-- Run this on your second database
WITH FirstDBCounts AS (
    SELECT * FROM (
        VALUES
';

-- Build the VALUES part for the first database counts
SELECT @SQL = @SQL + 
    '        (''' + s.name + '.' + t.name + ''', ' + 
    CAST(SUM(CASE WHEN i.indid <= 1 THEN i.[rows] ELSE 0 END) AS VARCHAR(20)) + '),
'
FROM 
    sys.tables t
JOIN sys.schemas s ON t.schema_id = s.schema_id
JOIN sys.sysindexes i ON t.object_id = i.id
WHERE 
    t.is_ms_shipped = 0  -- Exclude system tables
    AND i.indid <= 1     -- Only count rows from heap (0) or clustered index (1)
    AND i.[rows] > 0     -- Only include tables with at least one row
GROUP BY 
    s.name, t.name
ORDER BY 
    s.name, t.name;

-- Remove the last comma and add the closing part
SET @SQL = LEFT(@SQL, LEN(@SQL) - 3) + '
    ) AS t(TableName, FirstDBCount)
)
SELECT 
    f.TableName,
    f.FirstDBCount,
    ISNULL(s.SecondDBCount, 0) AS SecondDBCount,
    CASE WHEN f.FirstDBCount <> ISNULL(s.SecondDBCount, 0) THEN ''X'' ELSE '''' END AS Difference
FROM 
    FirstDBCounts f
LEFT JOIN (
';

-- Build the UNION ALL part for the second database counts
SELECT @SQL = @SQL + 
    '    