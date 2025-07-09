# Production Data Refresh Guide for Staging Environment

This guide provides instructions on how to refresh the staging database with a recent copy of data from the production environment. Using production data is crucial for realistic testing of new features and bug fixes. The process outlined here uses Azure's database copy functionality via the Azure CLI and follows a safe-swap strategy to minimize downtime and provide a rollback path.

**Warning**: This process replaces the existing staging database. Any data in the staging database that has not been merged to other environments will be lost. Ensure you have backed up any critical staging-specific data before you begin.

## Prerequisites

- You must have the Azure CLI installed and be logged into an account with sufficient permissions to manage resources in both the production and staging resource groups.
- An existing production environment, including:
  - **Resource Group**: `rg-production-eastus2-EduDoc`
  - **SQL Server**: `sql-edudoc-production`
  - **Database**: `edudoc.SQL`
- An existing staging environment, including:
  - **Resource Group**: `rg-staging-eastus2-EduDoc`
  - **SQL Server**: `sql-edudoc-staging`
  - **Database**: `edudoc.SQL`

## Database Refresh Steps (Azure CLI)

The following steps should be executed in a PowerShell terminal.

### Step 1: Define Environment Variables

First, set up variables for your environments. This makes the commands easier to read and adapt.

```powershell
$prodResourceGroupName = "rg-prod-eastus2-EduDoc"
$prodSqlServerName = "sql-prod-eastus2-edudoc"
$prodDatabaseName = "sqldb-prod-eastus2-EduDoc"

$stagingResourceGroupName = "rg-staging-eastus2-EduDoc"
$stagingSqlServerName = "sql-edudoc-staging"
$stagingDatabaseName = "edudoc.SQL"

$timestamp = (Get-Date -Format 'yyyyMMddHHmm')
$copiedDbName = "${stagingDatabaseName}_copy_${timestamp}"
$serviceObjective = "S0"
```

### Step 2: Start the Database Copy

This command initiates a transactionally consistent copy of the production database to a new, temporarily named database on the staging server.

```powershell
az sql db copy --resource-group $prodResourceGroupName --server $prodSqlServerName --name $prodDatabaseName `
  --dest-resource-group $stagingResourceGroupName --dest-server $stagingSqlServerName --dest-name $copiedDbName `
  --service-objective $serviceObjective
```

### Step 3: Monitor Copy Completion

The copy process can take time depending on the database size. Run the following script to monitor its status.

```powershell
while ($true) {
    $status = az sql db show --resource-group $stagingResourceGroupName --server $stagingSqlServerName --name $copiedDbName --query "status" --output tsv
    if ($status -eq "Online") {
        break
    }
    Start-Sleep -Seconds 60
}
```

### Step 4: Swap Databases

Once the copy is complete, you will swap the current staging database with the newly copied one.

**Important**: Before proceeding, you should stop your staging applications to prevent any connections to the database during the swap.

```powershell
# Take your staging applications offline before running this script.

$backupDbName = "${stagingDatabaseName}_old_${timestamp}"
az sql db rename --resource-group $stagingResourceGroupName --server $stagingSqlServerName --name $stagingDatabaseName --new-name $backupDbName
az sql db rename --resource-group $stagingResourceGroupName --server $stagingSqlServerName --name $copiedDbName --new-name $stagingDatabaseName

# Bring your staging applications back online after this script completes.
```

After this step, your staging environment will be running with a fresh copy of the production data.

### Step 5: (Optional) Clean Up Backup Database

After you have fully tested the staging environment and are confident that the data refresh was successful, you can delete the old backup database to save costs.

```powershell
# Run the following command only when you are ready to delete the backup.
# az sql db delete --resource-group $stagingResourceGroupName --server $stagingSqlServerName --name $backupDbName --yes
```

## Post-Refresh Configuration

After copying the database, certain configurations may need to be updated to ensure the staging environment functions correctly.

### User Permissions
If your database contains users that are not mapped to logins on the staging SQL server, they will become "orphaned," and the application may fail to connect. You may need to remap these users.

### Data Anonymization
For security and privacy, it is a best practice to anonymize or scrub sensitive production data (e.g., user information, emails, phone numbers) from the staging environment. This process is highly application-specific and may require custom scripts.

### Environment-Specific Settings
Check for any settings stored in the database that are environment-specific, such as API keys for third-party services or feature flags, and update them for the staging environment. 