
Profiling on an Auxre Sql Server is not straightforward.

Using Azure data Studio and the default profiler extension does not provide all sql so you have to go deeper.


```SQL
CREATE EVENT SESSION [CaptureAllSQL] ON DATABASE
ADD EVENT sqlserver.rpc_completed(
    ACTION(sqlserver.sql_text, sqlserver.client_app_name, sqlserver.username)
),
ADD EVENT sqlserver.sql_batch_completed(
    ACTION(sqlserver.sql_text)
),
ADD EVENT sqlserver.sql_batch_starting(
    ACTION(sqlserver.sql_text)
)
ADD TARGET package0.ring_buffer
WITH (STARTUP_STATE = ON);
GO

ALTER EVENT SESSION [CaptureAllSQL] ON DATABASE STATE = START;
```

After running your queries you're tracing you can see the results with


```SQL
SELECT 
    target_name,
    CAST(target_data AS XML) AS target_data_xml
FROM sys.dm_xe_database_session_targets
WHERE target_name = 'ring_buffer';
```

Inside the XML there are entries for rpc_starting. This xml can then be copied out and you likley have to replace any encoded characters for < or > for example.
This query can then be ran directly. 