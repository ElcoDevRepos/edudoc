# API Integration Tests

## Overview
These integration tests will delete all data from the database before each test runs. You are responsible for setting up all the data needed for your test to execute. This often means walking the foreign key tree to create all necessary records.

## Database Setup
The integration tests require a dedicated SQL Server database named `edudoc.SQL_IT`.

To create this database, open the `database/SQL/SQL.sqlproj` project and then publish it using the `integration-test.publish.xml` profile. This will generate the database with the correct schema and all necessary seed data.

