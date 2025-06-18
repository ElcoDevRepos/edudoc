# Local Environment Setup Guide

## System Requirements

- Windows 11
- Administrator access to your machine

## Initial Setup Steps

### 1. Configure PowerShell Execution Policy

Open PowerShell as Administrator and run:
```powershell
Set-ExecutionPolicy RemoteSigned -Force
```
When prompted, type 'Y' to confirm the change.

### 2. Install Node Version Manager (NVM)

1. Download NVM for Windows from the official GitHub repository:
   https://github.com/coreybutler/nvm-windows/releases
   
2. Download and run the latest `nvm-setup.exe`

3. After installation, close and reopen PowerShell to ensure NVM is properly initialized

### 3. Install and Configure Node.js

1. Open a new PowerShell window and install the latest LTS version of Node.js:
```powershell
nvm install lts
```

2. Set the installed LTS version as your default:
```powershell
nvm use lts
```

3. Verify Node.js and npm installation:
```powershell
node -v
npm -v
```
Both commands should return version numbers, confirming successful installation.

### 4. Configure NPM Registry

Create or edit your `.npmrc` file and add the following line:
```
@mt-ng2:registry=https://vanir.rmm.milesapp.com/repository/milesnpm-group/
```

### 6. Install Required Global Packages

Install the following packages globally using npm:

```powershell
npm install -g @angular/cli
npm install -g pnpm
```

### 7. Install Required Software

1. **Visual Studio 2022 Professional**
   - Download from: https://visualstudio.microsoft.com/vs/professional/
   - During installation, ensure you select:
     - ASP.NET and web development
     - Azure development
     - Under "Individual Components", search for "SQL Server Express LocalDB" and make sure it is selected

2. **Git Bash**
   - Download from: https://git-scm.com/downloads
   - After installation (may need admin privileges):
     ```powershell
     git config --system core.longpaths true
     ```
   - Note: This command requires Administrator privileges to succeed

3. **.NET 8.0 SDK**
   - Download the .NET 8.0 SDK from: https://dotnet.microsoft.com/download/dotnet/8.0
   - Run the installer with default settings

4. **SQL Server Management Studio (SSMS)**
   - Download the latest version from: https://learn.microsoft.com/en-us/sql/ssms/download-sql-server-management-studio-ssms
   - Run the installer with default settings

4. **Code Editor (Choose one)**
   - **Cursor**
     - Download from: https://cursor.sh/
     - Recommended for enhanced AI-powered development
   - **Visual Studio Code**
     - Download from: https://code.visualstudio.com/
   - Install recommended extensions

### 8. Configure Development Environment

1. **Set up Development Settings**
   - Copy `appsettings.Development.json.template` to create `appsettings.Development.json`
   - Create the templates directory:
   ```powershell
   mkdir C:\Templates
   ```

### 9. Set Up Local Database Instance

1. **Create LocalDB Instance**
   - Open PowerShell as Administrator and run:
   ```powershell
   # Check if ProjectsV13 instance exists
   $instances = sqllocaldb info
   if ($instances -notcontains "ProjectsV13") {
       Write-Host "Creating new ProjectsV13 instance..."
       sqllocaldb create ProjectsV13
   } else {
       Write-Host "ProjectsV13 instance already exists"
   }
   
   # Ensure the instance is running
   sqllocaldb start ProjectsV13
   ```
   - This script checks if ProjectsV13 exists, creates it if needed, and ensures it's running

2. **Verify Instance Creation**
   - Open SQL Server Management Studio (SSMS) and connect to the instance
      - Server name: `(localdb)\ProjectsV13`
      - Authentication: Windows Authentication
      - Encryption: Optional

### 10. Build and Deploy Database Schema

1. **Open the Database Project in Visual Studio**
   - Open `database/SQL/SQL.sqlproj` directly in Visual Studio 2022
   - The SQL project will open in Solution Explorer

2. **Build and Deploy SQL Database**
   - Right-click on the **SQL.sqlproj** in Solution Explorer
   - Select **"Publish..."** from the context menu
   - In the publish dialog:
     - Click **"Load Profile"**
     - Navigate to and select `local.publish.xml`
     - Review the connection settings (should show `(localdb)\ProjectsV13`)
     - Click **"Publish"**

   - This will:
     - Build the database project
     - Create the database schema on your ProjectsV13 instance
     - Deploy all SQL objects (tables, stored procedures, functions, etc.)
     - Run post-deployment scripts

3. **Verify Database Deployment**
   - In SSMS, refresh your ProjectsV13 instance
   - You should see a database named `edudoc.SQL`
   - Verify that the database contains tables, stored procedures, and other SQL objects

### 11. Run the Legacy Application

1. **Start the Frontend**
   - Open a PowerShell window and navigate to the edudoc folder:
   ```powershell
   cd edudoc
   npm run start
   ```

2. **Build and Run the Backend**
   - In your system's environment variables, set 'ASPNETCORE_ENVIRONMENT' to 'Development'
   - Open `Edudoc.sln` in Visual Studio 2022
   - Build the solution (Build > Build Solution or F6)
   - If prompted, accept any dialogs about trusting development certificates
   - Click the green "Start" button (or press F5) to run the API

### 12. Run the V5 Application

1. **Start the Frontend**
   - Open a PowerShell window and navigate to the edudoc-v5/frontend folder:
   ```powershell
   cd edudoc-v5/frontend/edudoc-v5
   pnpm install
   npm run start
   ```

2. **Build and Run the Backend**
   - Open `EduDocV5.sln` in Visual Studio 2022
   - Build the solution (Build > Build Solution or F6)
   - In Solution Explorer, make sure the HTTPS project is set as the startup project
   - Click the green "Start" button (or press F5) to run the API

### 13. Access and Test the Applications

1. **Log into the Legacy Application**
   - Navigate to http://localhost:4200/v4 in your browser
   - Log in with the following credentials:
     - Username: admin
     - Password: mN5)TV75K8[6v3y

2. **Test V5 Integration**
   - After logging in, click on the "New App (v5)" option in the sidebar
   - Click the "Test Authenticated Endpoint" button
   - You should see a success message, confirming that both applications are working correctly
