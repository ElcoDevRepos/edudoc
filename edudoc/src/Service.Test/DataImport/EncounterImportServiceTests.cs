using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using BreckServiceBase.Utilities.Interfaces;
using Model;
using Moq;
using Service.Encounters;
using Xunit;
using CsvHelper;
using System.Globalization;
using System.IO;
using Model.DataImport;

namespace Service.DataImport;

public class EncounterImportServiceTests : EncounterImportServiceTestBase
{
    [Fact]
    public void EncounterImportService_ShouldHaveCorrectImportType()
    {
        // Act & Assert - use the Service instance from the base class
        Assert.Equal("encounters", Service.ImportType);
    }

    [Fact]
    public void GenerateEncounterTemplate_ShouldReturnValidCsvBytes()
    {
        // Act - use the Service instance from the base class
        var templateBytes = Service.GenerateTemplate();

        // Assert
        Assert.NotNull(templateBytes);
        Assert.True(templateBytes.Length > 0);

        // Convert bytes back to string using UTF-8 encoding
        var templateString = Encoding.UTF8.GetString(templateBytes);

        // Verify the template is not empty
        Assert.False(string.IsNullOrWhiteSpace(templateString));

        // Split the file into lines
        var lines = templateString.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);

        // Verify we have at least 3 lines (legend + 2 example rows)
        Assert.True(lines.Length >= 3, $"Expected at least 3 lines, but found {lines.Length}");

        // Get the headers from the first row
        var actualHeaders = lines[0].Split(',').Select(h => h.Trim('"')).ToList();

        // Verify all required headers are present
        AssertHeadersInclude(actualHeaders, "ImportSource");
        
        // District and School information
        AssertHeadersInclude(actualHeaders, "DistrictId", "DistrictName", "DistrictCode", "SchoolId", "SchoolName");
        
        // Provider information
        AssertHeadersInclude(actualHeaders, "ProviderId", "ProviderNPI", "ProviderFirstName", "ProviderLastName");
        
        // Student information
        AssertHeadersInclude(actualHeaders, "StudentId", "StudentCode", "StudentFirstName", "StudentMiddleName", 
            "StudentLastName", "StudentDateOfBirth", "StudentGrade", "StudentMedicaidNo");
        
        // Address fields
        AssertHeadersInclude(actualHeaders, "StudentAddressLine1", "StudentAddressLine2", "StudentCity", 
            "StudentState", "StudentZip");
        
        // Case Load information
        AssertHeadersInclude(actualHeaders, "ServiceCodeId", "ServiceCodeName", "CaseLoadDiagnosisCode", 
            "IEPStartDate", "IEPEndDate");
        
        // Prescription/Script information
        AssertHeadersInclude(actualHeaders, "DoctorFirstName", "DoctorLastName", "DoctorNPI", 
            "PrescriptionInitiationDate", "PrescriptionExpirationDate", "CaseLoadScriptDiagnosisCode");
        
        // Encounter data
        AssertHeadersInclude(actualHeaders, "EncounterDate", "EncounterStartTime", "EncounterEndTime", 
            "ServiceTypeId", "EvaluationTypeId", "EncounterDiagnosisCode", "IsGroup", "AdditionalStudents");
        
        // EncounterStudent data
        AssertHeadersInclude(actualHeaders, "EncounterLocation", "StudentStartTime", "StudentEndTime", 
            "EncounterStudentDate", "EncounterStudentDiagnosisCode", "CPTCode", "TherapyCaseNotes", 
            "SupervisorComments", "IsTelehealth");
        
        // Validation field
        AssertHeadersInclude(actualHeaders, "ValidationErrors");

        // Verify that the second line contains legend values
        using var memoryStream = new MemoryStream(templateBytes);
        using var reader = new StreamReader(memoryStream);
        using var csv = new CsvReader(reader, CultureInfo.InvariantCulture);
        
        // Skip header row
        csv.Read();
        csv.ReadHeader();
        
        // Read legend row
        csv.Read();
        var legendRow = csv.GetRecord<EncounterImportRow>();
        
        Assert.Contains("Source of the import data", legendRow.ImportSource);
        Assert.Contains("REQUIRED", legendRow.DistrictId);
        
        // Verify that the example rows have valid sample data
        csv.Read();
        var exampleRow1 = csv.GetRecord<EncounterImportRow>();
        Assert.Equal("MST Integration", exampleRow1.ImportSource);
        Assert.Equal("Sample District", exampleRow1.DistrictName);
        
        if (csv.Read())
        {
            var exampleRow2 = csv.GetRecord<EncounterImportRow>();
            Assert.Equal("MST Integration", exampleRow2.ImportSource);
            Assert.Equal("true", exampleRow2.IsGroup);
        }
    }

    private void AssertHeadersInclude(List<string> actualHeaders, params string[] expectedHeaders)
    {
        foreach (var header in expectedHeaders)
        {
            Assert.Contains(header, actualHeaders);
        }
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithValidData_ShouldCreateEncounter()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data
        var rowData = GetValidCsvRowData();
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows", result.Message);

        // Verify encounter was created
        var createdEncounter = Context.Encounters
            .Include(e => e.EncounterStudents)
            .FirstOrDefault(e => e.ProviderId == TestProvider.Id && e.EncounterDate.HasValue && 
                e.EncounterDate.Value.Year == DateTime.UtcNow.Year &&
                e.EncounterDate.Value.Month == DateTime.UtcNow.Month &&
                e.EncounterDate.Value.Day == DateTime.UtcNow.Day);

        Assert.NotNull(createdEncounter);
        Assert.Equal(TestProvider.Id, createdEncounter.ProviderId);
        Assert.Equal(3, createdEncounter.ServiceTypeId); // Treatment/Therapy
        Assert.Equal(TestCaseLoad.DiagnosisCodeId, createdEncounter.DiagnosisCodeId);
        Assert.False(createdEncounter.IsGroup);
        Assert.Equal(0, createdEncounter.AdditionalStudents);

        // Verify encounter student was created
        var createdEncounterStudent = createdEncounter.EncounterStudents.FirstOrDefault();
        Assert.NotNull(createdEncounterStudent);
        Assert.Equal(TestStudent.Id, createdEncounterStudent.StudentId);
        Assert.Equal(TestCaseLoad.DiagnosisCodeId, createdEncounterStudent.DiagnosisCodeId);
        Assert.Equal("Test therapy notes", createdEncounterStudent.TherapyCaseNotes);
        Assert.Equal("Test supervisor comments", createdEncounterStudent.SupervisorComments);
        Assert.False(createdEncounterStudent.IsTelehealth);

        // Verify CPT code was associated
        var cptCodeAssociation = Context.EncounterStudentCptCodes
            .FirstOrDefault(esc => esc.EncounterStudentId == createdEncounterStudent.Id);
        Assert.NotNull(cptCodeAssociation);
        Assert.Equal(TestCptCode.Id, cptCodeAssociation.CptCodeId); // Use the actual test CPT code ID
        Assert.Equal(60, cptCodeAssociation.Minutes); // 1 hour duration
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithEmptyFile_ShouldReturnError()
    {
        // Arrange
        var emptyFileContent = new byte[] { }; // Empty byte array

        // Act
        var result = await Service.ProcessImportFileAsync(emptyFileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail for empty file");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Equal("No data rows found in the import file.", result.Message);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithMissingImportSource_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but remove ImportSource
        var rowData = GetValidCsvRowData();
        rowData.Remove("ImportSource");
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when ImportSource is missing");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("ImportSource is required to determine the appropriate goal for the case load script.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidImportSource_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set ImportSource to a non-existent goal
        var rowData = GetValidCsvRowData();
        rowData["ImportSource"] = "NonExistentGoal";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when ImportSource doesn't match any goal");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("No matching goal found for ImportSource 'NonExistentGoal'", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidDistrictId_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set DistrictId to a non-existent ID
        var rowData = GetValidCsvRowData();
        rowData["DistrictId"] = "999999"; // Use a non-existent district ID
        rowData.Remove("DistrictName"); // Remove DistrictName to force using DistrictId
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when DistrictId doesn't match any district");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("District with ID 999999 not found or is archived", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidDistrictIdFormat_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set DistrictId to an invalid format
        var rowData = GetValidCsvRowData();
        rowData["DistrictId"] = "not-a-number"; // Use an invalid format for DistrictId
        rowData.Remove("DistrictName"); // Remove DistrictName to force using DistrictId
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when DistrictId is in invalid format");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Invalid District ID format: not-a-number", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithSingleDistrictByName_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use DistrictName instead of DistrictId
        var rowData = GetValidCsvRowData();
        rowData.Remove("DistrictId"); // Remove DistrictId to force using DistrictName
        rowData["DistrictName"] = TestDistrict.Name; // Use the name of our test district
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed when a single district is found by name");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Equal("Import completed with 1 successful rows and 0 error rows.", result.Message);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithMultipleDistrictsWithSameName_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set DistrictName to match multiple districts
        var rowData = GetValidCsvRowData();
        rowData.Remove("DistrictId"); // Remove DistrictId to force using DistrictName
        rowData["DistrictName"] = "Duplicate District"; // Use the name that matches multiple districts in test data
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when multiple districts match the name");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Multiple districts found with name 'Duplicate District'. Please specify a district ID.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithArchivedDistrictName_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set DistrictName to an archived district
        var rowData = GetValidCsvRowData();
        rowData.Remove("DistrictId"); // Remove DistrictId to force using DistrictName
        rowData["DistrictName"] = "Archived District"; // Use the name of the archived district from test data
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when district is archived");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Equal("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("District with name 'Archived District' not found or is archived.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithNoDistrictIdentifier_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but remove both DistrictId and DistrictName
        var rowData = GetValidCsvRowData();
        rowData.Remove("DistrictId");
        rowData.Remove("DistrictName");
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when no district identifier is provided");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Equal("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("District could not be identified. Please provide a valid District ID or District Name.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithArchivedProviderTitle_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set ProviderId to the provider with archived title
        var rowData = GetValidCsvRowData();
        rowData["ProviderId"] = TestArchivedProvider.Id.ToString(); // Use the provider with archived title
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when provider's title is archived");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Equal("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Provider (ID: " + TestArchivedProvider.Id + ") has a title that is archived or not found.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithNonexistentProvider_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set ProviderId to a non-existent ID
        var rowData = GetValidCsvRowData();
        rowData["ProviderId"] = "999999"; // Use a non-existent provider ID
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when provider is not found");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Provider with ID 999999 not found or is archived", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidProviderIdFormat_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set ProviderId to an invalid format
        var rowData = GetValidCsvRowData();
        rowData["ProviderId"] = "not-a-number"; // Use an invalid format for ProviderId
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when Provider ID format is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Invalid Provider ID format: not-a-number", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithSingleProviderByNPI_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use ProviderNPI instead of ProviderId
        var rowData = GetValidCsvRowData();
        rowData.Remove("ProviderId"); // Remove ProviderId to force using ProviderNPI
        rowData["ProviderNPI"] = TestProvider.Npi; // Use the NPI of our test provider
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed when a single provider is found by NPI");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Equal("Import completed with 1 successful rows and 0 error rows.", result.Message);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithMultipleProvidersWithSameNPI_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use ProviderNPI that matches multiple providers
        var rowData = GetValidCsvRowData();
        rowData.Remove("ProviderId"); // Remove ProviderId to force using ProviderNPI
        rowData["ProviderNPI"] = "1112223333"; // Use the NPI that matches multiple providers in test data
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when multiple providers match the NPI");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Multiple providers found with NPI '1112223333'. Please specify a provider ID.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithNonexistentProviderNPI_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent ProviderNPI
        var rowData = GetValidCsvRowData();
        rowData.Remove("ProviderId"); // Remove ProviderId to force using ProviderNPI
        rowData["ProviderNPI"] = "9999999999"; // Use a non-existent NPI
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when provider with NPI is not found");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Provider with NPI '9999999999' not found or is archived.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithNonexistentProviderName_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use ProviderFirstName and ProviderLastName instead of ProviderId
        var rowData = GetValidCsvRowData();
        rowData.Remove("ProviderId"); // Remove ProviderId to force using name
        rowData.Remove("ProviderNPI"); // Remove ProviderNPI to force using name
        rowData["ProviderFirstName"] = "Nonexistent"; // Use a non-existent first name
        rowData["ProviderLastName"] = "Provider"; // Use a non-existent last name
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when no provider is found with the given name");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("No provider found with name 'Nonexistent Provider'.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithMultipleProvidersWithSameName_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use ProviderFirstName and ProviderLastName instead of ProviderId
        var rowData = GetValidCsvRowData();
        rowData.Remove("ProviderId"); // Remove ProviderId to force using name
        rowData.Remove("ProviderNPI"); // Remove ProviderNPI to force using name
        rowData["ProviderFirstName"] = "John"; // Use the first name that matches multiple providers
        rowData["ProviderLastName"] = "Smith"; // Use the last name that matches multiple providers
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when multiple providers match the name");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Multiple providers found with name 'John Smith'. Please specify a Provider ID or NPI.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithNoProviderInformation_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but remove all provider-related fields
        var rowData = GetValidCsvRowData();
        rowData.Remove("ProviderId");
        rowData.Remove("ProviderNPI");
        rowData.Remove("ProviderFirstName");
        rowData.Remove("ProviderLastName");
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when no provider information is provided");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Provider information is required. Please provide a Provider ID NPI or Name.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithStudentInArchivedSchool_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a student that is in an archived school
        var rowData = GetValidCsvRowData();
        rowData["StudentId"] = TestArchivedSchoolStudent.Id.ToString();
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when student is in an archived school");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal($"Student (ID: {TestArchivedSchoolStudent.Id}) has a school that is archived or not found.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithArchivedStudent_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use an archived student ID
        var rowData = GetValidCsvRowData();
        rowData["StudentId"] = TestArchivedStudent.Id.ToString(); // Use the ID of the archived student from test data
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when student is archived");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal($"Student with ID {TestArchivedStudent.Id} not found or is archived.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidStudentIdFormat_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set StudentId to an invalid format
        var rowData = GetValidCsvRowData();
        rowData["StudentId"] = "not-a-number"; // Use an invalid format for StudentId
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when Student ID format is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Invalid Student ID format: not-a-number", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithStudentFoundByCodeAndValidSchool_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use StudentCode instead of StudentId
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using StudentCode
        rowData["StudentCode"] = TestStudent.StudentCode; // Use the code of our test student
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed when student is found by code and has a valid school");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Equal("Import completed with 1 successful rows and 0 error rows.", result.Message);

        // Verify encounter was created
        var createdEncounter = Context.Encounters
            .Include(e => e.EncounterStudents)
            .FirstOrDefault(e => e.ProviderId == TestProvider.Id && e.EncounterDate.HasValue && 
                e.EncounterDate.Value.Year == DateTime.UtcNow.Year &&
                e.EncounterDate.Value.Month == DateTime.UtcNow.Month &&
                e.EncounterDate.Value.Day == DateTime.UtcNow.Day);

        Assert.NotNull(createdEncounter);
        Assert.Equal(TestProvider.Id, createdEncounter.ProviderId);
        Assert.Equal(3, createdEncounter.ServiceTypeId); // Treatment/Therapy
        Assert.Equal(TestCaseLoad.DiagnosisCodeId, createdEncounter.DiagnosisCodeId);
        Assert.False(createdEncounter.IsGroup);
        Assert.Equal(0, createdEncounter.AdditionalStudents);

        // Verify encounter student was created
        var createdEncounterStudent = createdEncounter.EncounterStudents.FirstOrDefault();
        Assert.NotNull(createdEncounterStudent);
        Assert.Equal(TestStudent.Id, createdEncounterStudent.StudentId);
        Assert.Equal(TestCaseLoad.DiagnosisCodeId, createdEncounterStudent.DiagnosisCodeId);
        Assert.Equal("Test therapy notes", createdEncounterStudent.TherapyCaseNotes);
        Assert.Equal("Test supervisor comments", createdEncounterStudent.SupervisorComments);
        Assert.False(createdEncounterStudent.IsTelehealth);

        // Verify CPT code was associated
        var cptCodeAssociation = Context.EncounterStudentCptCodes
            .FirstOrDefault(esc => esc.EncounterStudentId == createdEncounterStudent.Id);
        Assert.NotNull(cptCodeAssociation);
        Assert.Equal(TestCptCode.Id, cptCodeAssociation.CptCodeId);
        Assert.Equal(60, cptCodeAssociation.Minutes); // 1 hour duration
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithStudentFoundByCodeButArchivedSchool_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use StudentCode instead of StudentId
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using StudentCode
        rowData["StudentCode"] = TestArchivedSchoolStudent.StudentCode; // Use the code of the student with archived school
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when student's school is archived");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal($"Student (ID: {TestArchivedSchoolStudent.Id}) has a school that is archived or not found.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithDuplicateStudentCode_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use StudentCode instead of StudentId
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using StudentCode
        rowData["StudentCode"] = "STU004"; // Use the code that matches multiple students
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when student code matches multiple students");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Multiple students found with code 'STU004'. Please specify a student ID.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithStudentFoundByNameAndDOB_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use name and DOB instead of StudentId
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = TestStudent.FirstName;
        rowData["StudentLastName"] = TestStudent.LastName;
        rowData["StudentDateOfBirth"] = $"{TestStudent.DateOfBirth:MM/dd/yyyy}";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed when student is found by name and DOB");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Equal("Import completed with 1 successful rows and 0 error rows.", result.Message);

        // Verify encounter was created
        var createdEncounter = Context.Encounters
            .Include(e => e.EncounterStudents)
            .FirstOrDefault(e => e.ProviderId == TestProvider.Id && e.EncounterDate.HasValue && 
                e.EncounterDate.Value.Year == DateTime.UtcNow.Year &&
                e.EncounterDate.Value.Month == DateTime.UtcNow.Month &&
                e.EncounterDate.Value.Day == DateTime.UtcNow.Day);

        Assert.NotNull(createdEncounter);
        Assert.Equal(TestProvider.Id, createdEncounter.ProviderId);
        Assert.Equal(3, createdEncounter.ServiceTypeId); // Treatment/Therapy
        Assert.Equal(TestCaseLoad.DiagnosisCodeId, createdEncounter.DiagnosisCodeId);
        Assert.False(createdEncounter.IsGroup);
        Assert.Equal(0, createdEncounter.AdditionalStudents);

        // Verify encounter student was created
        var createdEncounterStudent = createdEncounter.EncounterStudents.FirstOrDefault();
        Assert.NotNull(createdEncounterStudent);
        Assert.Equal(TestStudent.Id, createdEncounterStudent.StudentId);
        Assert.Equal(TestCaseLoad.DiagnosisCodeId, createdEncounterStudent.DiagnosisCodeId);
        Assert.Equal("Test therapy notes", createdEncounterStudent.TherapyCaseNotes);
        Assert.Equal("Test supervisor comments", createdEncounterStudent.SupervisorComments);
        Assert.False(createdEncounterStudent.IsTelehealth);

        // Verify CPT code was associated
        var cptCodeAssociation = Context.EncounterStudentCptCodes
            .FirstOrDefault(esc => esc.EncounterStudentId == createdEncounterStudent.Id);
        Assert.NotNull(cptCodeAssociation);
        Assert.Equal(TestCptCode.Id, cptCodeAssociation.CptCodeId);
        Assert.Equal(60, cptCodeAssociation.Minutes); // 1 hour duration
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithStudentFoundByNameAndDOBButArchivedSchool_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use name and DOB of student with archived school
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = TestArchivedSchoolStudent.FirstName;
        rowData["StudentLastName"] = TestArchivedSchoolStudent.LastName;
        rowData["StudentDateOfBirth"] = TestArchivedSchoolStudent.DateOfBirth.ToString("MM/dd/yyyy");
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when student's school is archived");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal($"Student (ID: {TestArchivedSchoolStudent.Id}) has a school that is archived or not found.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithMultipleStudentsFoundByNameAndDOB_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use name and DOB that matches multiple students
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "John"; // Use the first name that matches multiple students
        rowData["StudentLastName"] = "Smith"; // Use the last name that matches multiple students
        rowData["StudentDateOfBirth"] = "01/01/2008"; // Use the DOB that matches multiple students
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when multiple students match name and DOB");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Multiple students found with name 'John Smith' and DOB '01/01/2008'. Please specify a student ID or code.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithStudentNotFoundByNameAndDOB_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student name and DOB
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "Nonexistent";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when student is not found by name and DOB");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Student with name 'Nonexistent Student' and DOB '01/01/2000' not found.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidStudentDateOfBirthFormat_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set StudentDateOfBirth to an invalid format
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentDateOfBirth"] = "not-a-date"; // Use an invalid date format
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when StudentDateOfBirth is in invalid format");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Invalid date format for Student Date of Birth: not-a-date", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithNoStudentIdentifier_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but remove all student identifiers
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId
        rowData.Remove("StudentCode"); // Remove StudentCode
        rowData.Remove("StudentFirstName"); // Remove StudentFirstName
        rowData.Remove("StudentLastName"); // Remove StudentLastName
        rowData.Remove("StudentDateOfBirth"); // Remove StudentDateOfBirth
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, false, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when no student identifier is provided");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Student could not be identified. Please provide a valid Student ID Student Code or Name with Date of Birth.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithNoMatchingStudentButValidSchool_ShouldFindSchool()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student name and DOB
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "Nonexistent";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed when no matching student is found but school is valid and createMissingStudentRecords is true");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows", result.Message);

        // Parse the date before using it in the query
        var expectedDateOfBirth = DateTime.Parse("01/01/2000");

        // Verify a new student was created with the correct school
        var createdStudent = Context.Students
            .FirstOrDefault(s => s.FirstName == "Nonexistent" && 
                               s.LastName == "Student" && 
                               s.DateOfBirth == expectedDateOfBirth);

        Assert.NotNull(createdStudent);
        Assert.Equal(TestSchool.Id, createdStudent.SchoolId);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidSchoolIdWhenCreatingMissingStudent_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set SchoolId to a non-existent ID and use a non-existent student
        var rowData = GetValidCsvRowData();
        rowData["SchoolId"] = "99999"; // Use a non-existent school ID
        rowData.Remove("SchoolName"); // Remove SchoolName to force using SchoolId
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when SchoolId doesn't match any school while creating missing student");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("School with ID 99999 not found or is archived.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidSchoolIdFormatWhenCreatingMissingStudent_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set SchoolId to an invalid format and use a non-existent student
        var rowData = GetValidCsvRowData();
        rowData["SchoolId"] = "not-a-number"; // Use an invalid format for SchoolId
        rowData.Remove("SchoolName"); // Remove SchoolName to force using SchoolId
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when SchoolId format is invalid while creating missing student");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("Invalid School ID format: not-a-number", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithSingleSchoolInDistrictWhenCreatingMissingStudent_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed when there is exactly one school in the district while creating missing student");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows", result.Message);

        // Parse the date before using it in the query
        var expectedDateOfBirth = DateTime.Parse("01/01/2000");

        // Verify a new student was created with the correct school
        var createdStudent = Context.Students
            .FirstOrDefault(s => s.FirstName == "New" && 
                               s.LastName == "Student" && 
                               s.DateOfBirth == expectedDateOfBirth);

        Assert.NotNull(createdStudent);
        Assert.Equal(TestSchool.Id, createdStudent.SchoolId);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithMultipleSchoolsSameNameWhenCreatingMissingStudent_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData.Remove("SchoolId"); // Remove SchoolId to force using school name
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["SchoolName"] = "Duplicate Name School"; // Use the name that has multiple schools
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when multiple schools with same name are found");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);

        // Parse the error file content
        var errorContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        var headerRow = errorLines[0].Split(new[] { ',' }, StringSplitOptions.None);
        var errorRow = errorLines[1].Split(new[] { ',' }, StringSplitOptions.None);
        var validationErrorsIndex = Array.IndexOf(headerRow, "ValidationErrors");

        Assert.Equal($"Multiple schools found with name 'Duplicate Name School' in district '{TestDistrict.Name}'. Please specify a school ID.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithNonexistentSchoolNameWhenCreatingMissingStudent_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student and school name
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData.Remove("SchoolId"); // Remove SchoolId to force using school name
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["SchoolName"] = "Nonexistent School"; // Use a non-existent school name
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when school with given name is not found");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);

        // Parse the error file content
        var errorContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        var headerRow = errorLines[0].Split(new[] { ',' }, StringSplitOptions.None);
        var errorRow = errorLines[1].Split(new[] { ',' }, StringSplitOptions.None);
        var validationErrorsIndex = Array.IndexOf(headerRow, "ValidationErrors");

        Assert.Equal("School with name 'Nonexistent School' not found or is archived.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithNoSchoolIdentifierWhenCreatingMissingStudent_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student and remove all school identifiers
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData.Remove("SchoolId"); // Remove SchoolId
        rowData.Remove("SchoolName"); // Remove SchoolName
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when no school identifier is provided while creating missing student");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);

        // Parse the error file content
        var errorContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        var headerRow = errorLines[0].Split(new[] { ',' }, StringSplitOptions.None);
        var errorRow = errorLines[1].Split(new[] { ',' }, StringSplitOptions.None);
        var validationErrorsIndex = Array.IndexOf(headerRow, "ValidationErrors");

        Assert.Equal("School could not be identified. Please provide a valid School ID or Name.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithNoAddressFields_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but remove all address-related fields and use a non-existent student
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData.Remove("StudentAddressLine1");
        rowData.Remove("StudentAddressLine2");
        rowData.Remove("StudentCity");
        rowData.Remove("StudentState");
        rowData.Remove("StudentZip");
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed when no address fields are provided");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows and 0 error rows.", result.Message);

        var expectedDateOfBirth = DateTime.Parse("01/01/2000");

        // Verify a new student was created
        var createdStudent = Context.Students
            .FirstOrDefault(s => s.FirstName == "New" && 
                               s.LastName == "Student" && 
                               s.DateOfBirth == expectedDateOfBirth);

        Assert.NotNull(createdStudent);
        Assert.Equal(TestSchool.Id, createdStudent.SchoolId);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithPartialAddressFields_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but remove all address fields except StudentAddressLine2 and use a non-existent student
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData.Remove("StudentAddressLine1");
        rowData.Remove("StudentCity");
        rowData.Remove("StudentState");
        rowData.Remove("StudentZip");
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when only some address fields are provided");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("The following address fields are required when any address information is provided: StudentAddressLine1 StudentCity StudentState StudentZip", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidStateCode_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student and invalid state code
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["StudentState"] = "XX"; // Use an invalid state code
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when an invalid state code is provided");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Equal("StudentState must be a 2-character state code. Provided value was not found. Got: XX", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithValidAddress_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student and valid address
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["StudentAddressLine1"] = "123 Main St";
        rowData["StudentAddressLine2"] = "Apt 4B";
        rowData["StudentCity"] = "Anytown";
        rowData["StudentState"] = "CA"; // Use a valid state code
        rowData["StudentZip"] = "12345";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed when a valid address is provided");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows and 0 error rows.", result.Message);

        var expectedDateOfBirth = DateTime.Parse("01/01/2000");

        // Verify a new student was created with the correct address
        var createdStudent = Context.Students
            .Include(s => s.Address)
            .FirstOrDefault(s => s.FirstName == "New" && 
                               s.LastName == "Student" && 
                               s.DateOfBirth == expectedDateOfBirth);

        Assert.NotNull(createdStudent);
        Assert.Equal(TestSchool.Id, createdStudent.SchoolId);
        Assert.NotNull(createdStudent.Address);
        Assert.Equal("123 Main St", createdStudent.Address.Address1);
        Assert.Equal("Apt 4B", createdStudent.Address.Address2);
        Assert.Equal("Anytown", createdStudent.Address.City);
        Assert.Equal("CA", createdStudent.Address.StateCode);
        Assert.Equal("12345", createdStudent.Address.Zip);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithAddressValidationFailure_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student and invalid address
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["StudentAddressLine1"] = "123 Main St";
        rowData["StudentAddressLine2"] = "Apt 4B";
        rowData["StudentCity"] = "Anytown";
        rowData["StudentState"] = "CA"; // Use a valid state code
        rowData["StudentZip"] = "123456789009876543211234567890"; // Use an invalid ZIP format
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when address validation fails");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Address validation error:", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithValidIncomingCaseLoadStudentTypeId_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["StudentTypeId"] = "1";
        rowData["StudentTypeName"] = "IEP";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed with valid student type ID");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows and 0 error rows.", result.Message);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidIncomingCaseLoadStudentTypeId_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student and invalid student type
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["StudentTypeId"] = "99999";
        rowData["StudentTypeName"] = "IEP";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail with invalid student type ID");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Student type with ID 99999 not found.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidIncomingCaseLoadStudentTypeIdFormat_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student and invalid student type format
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["StudentTypeId"] = "not-a-number";
        rowData["StudentTypeName"] = "IEP";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail with invalid student type ID format");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Invalid StudentTypeId format: not-a-number", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithValidIncomingCaseLoadStudentTypeName_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData.Remove("StudentTypeId"); // Remove ID to force using name
        rowData["StudentTypeName"] = "IEP";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed with valid student type name");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows and 0 error rows.", result.Message);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidIncomingCaseLoadStudentTypeName_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student and invalid student type name
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData.Remove("StudentTypeId"); // Remove ID to force using name
        rowData["StudentTypeName"] = "NonExistentType";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail with invalid student type name");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Student type with name 'NonExistentType' not found.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithValidIncomingCaseLoadDiagnosisCode_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["CaseLoadDiagnosisCode"] = "Z71.89"; // Valid diagnosis code from test data
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed with valid diagnosis code");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows and 0 error rows.", result.Message);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidIncomingCaseLoadDiagnosisCode_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student and invalid diagnosis code
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["CaseLoadDiagnosisCode"] = "INVALID"; // Invalid diagnosis code
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail with invalid diagnosis code");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Diagnosis code 'INVALID' not found or is archived.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithValidIncomingCaseLoadIEPDates_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["IEPStartDate"] = "01/01/2024";
        rowData["IEPEndDate"] = "12/31/2024";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed with valid IEP dates");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows and 0 error rows.", result.Message);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidIncomingCaseLoadIEPStartDateFormat_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student and invalid IEP start date format
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["IEPStartDate"] = "not-a-date"; // Invalid format that cannot be parsed
        rowData["IEPEndDate"] = "12/31/2024";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail with invalid IEP start date format");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Invalid date format for IEPStartDate: not-a-date. Use MM/DD/YYYY format.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidIncomingCaseLoadIEPEndDateFormat_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student and invalid IEP end date format
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["IEPStartDate"] = "01/01/2024";
        rowData["IEPEndDate"] = "invalid-date"; // Invalid format that cannot be parsed
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail with invalid IEP end date format");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Invalid date format for IEPEndDate: invalid-date. Use MM/DD/YYYY format.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithIncomingCaseLoadIEPEndDateBeforeStartDate_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student and invalid IEP dates
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["IEPStartDate"] = "12/31/2024";
        rowData["IEPEndDate"] = "01/01/2024"; // End date before start date
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when IEP end date is before start date");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("IEPEndDate (1/1/2024) must be after IEPStartDate (12/31/2024).", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithNoIncomingCaseLoadFields_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student and remove all case load fields
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData.Remove("StudentTypeId");
        rowData.Remove("StudentTypeName");
        rowData.Remove("CaseLoadDiagnosisCode");
        rowData.Remove("IEPStartDate");
        rowData.Remove("IEPEndDate");
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed when no case load fields are provided");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows and 0 error rows.", result.Message);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithValidCaseLoadScriptData_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student to force createMissingStudentRecords path
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Add valid case load script data
        rowData["DoctorFirstName"] = "John";
        rowData["DoctorLastName"] = "Doe";
        rowData["DoctorNPI"] = "1234567890";
        rowData["PrescriptionInitiationDate"] = "01/01/2024";
        rowData["CaseLoadScriptDiagnosisCode"] = "Z71.89";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed with valid case load script data");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows and 0 error rows.", result.Message);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithNonNursingServiceCode_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student to force createMissingStudentRecords path
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";

        // Add non-nursing provider data
        rowData["ProviderId"] = TestNonNursingProvider.Id.ToString();
        rowData.Remove("ProviderFirstName");
        rowData.Remove("ProviderLastName");
        rowData.Remove("ProviderNPI");
        
        // Add case load script data with missing required fields
        // This should be ignored since we're using a non-nursing service code
        rowData["DoctorFirstName"] = ""; // Missing required field
        rowData["DoctorLastName"] = ""; // Missing required field
        rowData["DoctorNPI"] = ""; // Missing required field
        rowData["PrescriptionInitiationDate"] = ""; // Missing required field
        rowData["CaseLoadScriptDiagnosisCode"] = ""; // Missing required field
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed with non-nursing service code regardless of case load script data");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows and 0 error rows.", result.Message);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithMissingCaseLoadScriptRequiredFields_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student to force createMissingStudentRecords path
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Add case load script data with missing required fields
        rowData["DoctorFirstName"] = ""; // Missing required field
        rowData["DoctorLastName"] = ""; // Missing required field
        rowData["DoctorNPI"] = ""; // Missing required field
        rowData["PrescriptionInitiationDate"] = ""; // Missing required field
        rowData["CaseLoadScriptDiagnosisCode"] = ""; // Missing required field
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when case load script required fields are missing");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("The following prescription fields are required:", errorRow[validationErrorsIndex]);
        Assert.Contains("DoctorFirstName", errorRow[validationErrorsIndex]);
        Assert.Contains("DoctorLastName", errorRow[validationErrorsIndex]);
        Assert.Contains("DoctorNPI", errorRow[validationErrorsIndex]);
        Assert.Contains("PrescriptionInitiationDate", errorRow[validationErrorsIndex]);
        Assert.Contains("CaseLoadScriptDiagnosisCode", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithLongDoctorFirstName_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student to force createMissingStudentRecords path
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Add case load script data with a doctor first name that exceeds 50 characters
        rowData["DoctorFirstName"] = new string('A', 51); // 51 characters
        rowData["DoctorLastName"] = "Doe";
        rowData["DoctorNPI"] = "1234567890";
        rowData["PrescriptionInitiationDate"] = "01/01/2024";
        rowData["CaseLoadScriptDiagnosisCode"] = "Z71.89";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when doctor first name exceeds 50 characters");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("DoctorFirstName cannot exceed 50 characters", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithLongDoctorLastName_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student to force createMissingStudentRecords path
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Add case load script data with a doctor last name that exceeds 50 characters
        rowData["DoctorFirstName"] = "John";
        rowData["DoctorLastName"] = new string('A', 51); // 51 characters
        rowData["DoctorNPI"] = "1234567890";
        rowData["PrescriptionInitiationDate"] = "01/01/2024";
        rowData["CaseLoadScriptDiagnosisCode"] = "Z71.89";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when doctor last name exceeds 50 characters");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("DoctorLastName cannot exceed 50 characters", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidDoctorNPI_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student to force createMissingStudentRecords path
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Add case load script data with an invalid doctor NPI (not exactly 10 characters)
        rowData["DoctorFirstName"] = "John";
        rowData["DoctorLastName"] = "Doe";
        rowData["DoctorNPI"] = "123456789"; // Only 9 characters
        rowData["PrescriptionInitiationDate"] = "01/01/2024";
        rowData["CaseLoadScriptDiagnosisCode"] = "Z71.89";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when doctor NPI is not exactly 10 characters");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("DoctorNPI must be exactly 10 characters", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidPrescriptionInitiationDate_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student to force createMissingStudentRecords path
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Add case load script data with an invalid prescription initiation date
        rowData["DoctorFirstName"] = "John";
        rowData["DoctorLastName"] = "Doe";
        rowData["DoctorNPI"] = "1234567890";
        rowData["PrescriptionInitiationDate"] = "invalid-date"; // Invalid date format
        rowData["CaseLoadScriptDiagnosisCode"] = "Z71.89";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when prescription initiation date is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Invalid date format for PrescriptionInitiationDate: invalid-date. Use MM/DD/YYYY format.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidPrescriptionExpirationDate_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student to force createMissingStudentRecords path
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Add case load script data with an invalid prescription expiration date
        rowData["DoctorFirstName"] = "John";
        rowData["DoctorLastName"] = "Doe";
        rowData["DoctorNPI"] = "1234567890";
        rowData["PrescriptionInitiationDate"] = "01/01/2024";
        rowData["PrescriptionExpirationDate"] = "invalid-date"; // Invalid date format
        rowData["CaseLoadScriptDiagnosisCode"] = "Z71.89";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when prescription expiration date is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Invalid date format for PrescriptionExpirationDate: invalid-date. Use MM/DD/YYYY format.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithPrescriptionExpirationDateBeforeInitiationDate_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student to force createMissingStudentRecords path
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Add case load script data with expiration date before initiation date
        rowData["DoctorFirstName"] = "John";
        rowData["DoctorLastName"] = "Doe";
        rowData["DoctorNPI"] = "1234567890";
        rowData["PrescriptionInitiationDate"] = "01/01/2024";
        rowData["PrescriptionExpirationDate"] = "12/31/2023"; // Before initiation date
        rowData["CaseLoadScriptDiagnosisCode"] = "Z71.89";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when prescription expiration date is before initiation date");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("PrescriptionExpirationDate (12/31/2023) must be after PrescriptionInitiationDate (1/1/2024).", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithArchivedCaseLoadScriptDiagnosisCode_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student to force createMissingStudentRecords path
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Add case load script data with an archived diagnosis code
        rowData["DoctorFirstName"] = "John";
        rowData["DoctorLastName"] = "Doe";
        rowData["DoctorNPI"] = "1234567890";
        rowData["PrescriptionInitiationDate"] = "01/01/2024";
        rowData["CaseLoadScriptDiagnosisCode"] = "ARCHIVED"; // Archived diagnosis code
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when case load script diagnosis code is archived");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Diagnosis code 'ARCHIVED' not found or is archived.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithMissingCaseLoadScriptDiagnosisCode_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a non-existent student to force createMissingStudentRecords path
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        
        // Add case load script data with a missing diagnosis code
        rowData["DoctorFirstName"] = "John";
        rowData["DoctorLastName"] = "Doe";
        rowData["DoctorNPI"] = "1234567890";
        rowData["PrescriptionInitiationDate"] = "01/01/2024";
        rowData["CaseLoadScriptDiagnosisCode"] = ""; // Missing diagnosis code
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when case load script diagnosis code is missing");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("The following prescription fields are required: CaseLoadScriptDiagnosisCode", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithStudentFieldLengthViolations_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but modify fields to exceed length limits
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId");
        rowData["StudentFirstName"] = new string('a', 51); // Exceeds 50 chars
        rowData["StudentLastName"] = new string('b', 51); // Exceeds 50 chars
        rowData["StudentMiddleName"] = new string('c', 51); // Exceeds 50 chars
        rowData["StudentGrade"] = "123"; // Exceeds 2 chars
        rowData["StudentCode"] = new string('d', 13); // Exceeds 12 chars
        rowData["StudentNotes"] = new string('e', 251); // Exceeds 250 chars
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when student fields exceed length limits");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Fields exceed maximum length: StudentFirstName (max 50 characters) StudentLastName (max 50 characters) StudentMiddleName (max 50 characters) StudentGrade (max 2 characters) StudentCode (max 12 characters) StudentNotes (max 250 characters)", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithMissingRequiredStudentFields_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but remove all required student fields
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId");
        rowData.Remove("StudentCode");
        rowData.Remove("StudentFirstName");
        rowData.Remove("StudentLastName");
        rowData.Remove("StudentDateOfBirth");
        rowData.Remove("StudentGrade");
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when required student fields are missing");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Missing required fields for creating a student: StudentFirstName StudentLastName StudentDateOfBirth StudentGrade", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidMedicaidNoLength_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use an invalid Medicaid number length
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["StudentMedicaidNo"] = "12345"; // Not exactly 12 characters
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when Medicaid number is not exactly 12 characters");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Fields exceed maximum length: StudentMedicaidNo (must be exactly 12 characters)", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithEmptyOptionalStudentFields_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set optional fields to empty strings
        var rowData = GetValidCsvRowData();
        rowData.Remove("StudentId"); // Remove StudentId to force using name and DOB
        rowData.Remove("StudentCode"); // Remove StudentCode to force using name and DOB
        rowData["StudentFirstName"] = "New";
        rowData["StudentLastName"] = "Student";
        rowData["StudentDateOfBirth"] = "01/01/2000";
        rowData["StudentGrade"] = "10";
        rowData["StudentMiddleName"] = "";
        rowData["StudentCode"] = "";
        rowData["StudentMedicaidNo"] = "";
        rowData["StudentNotes"] = "";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed when optional student fields are empty");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows and 0 error rows.", result.Message);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidEncounterDate_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use an invalid encounter date
        var rowData = GetValidCsvRowData();
        rowData["EncounterDate"] = "invalid-date"; // Invalid date format
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when encounter date is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Invalid date format for EncounterDate: invalid-date. Use MM/DD/YYYY format.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidEncounterStartTime_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use an invalid encounter start time
        var rowData = GetValidCsvRowData();
        rowData["EncounterStartTime"] = "invalid-time"; // Invalid time format
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when encounter start time is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Invalid time format for EncounterStartTime: invalid-time. Use HH:MM or HH:MM AM/PM format.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidEncounterEndTime_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use an invalid encounter end time
        var rowData = GetValidCsvRowData();
        rowData["EncounterEndTime"] = "invalid-time"; // Invalid time format
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when encounter end time is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Invalid time format for EncounterEndTime: invalid-time. Use HH:MM or HH:MM AM/PM format.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidStudentStartTime_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use an invalid student start time
        var rowData = GetValidCsvRowData();
        rowData["StudentStartTime"] = "invalid-time"; // Invalid time format
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when student start time is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Invalid time format for StudentStartTime: invalid-time. Use HH:MM or HH:MM AM/PM format.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidStudentEndTime_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use an invalid student end time
        var rowData = GetValidCsvRowData();
        rowData["StudentEndTime"] = "invalid-time"; // Invalid time format
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when student end time is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Invalid time format for StudentEndTime: invalid-time. Use HH:MM or HH:MM AM/PM format.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithStudentEndTimeBeforeStartTime_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but set student end time before start time
        var rowData = GetValidCsvRowData();
        rowData["StudentStartTime"] = "10:00";
        rowData["StudentEndTime"] = "09:00"; // End time before start time
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when student end time is before start time");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("StudentStartTime (14:00:00) must be before StudentEndTime (13:00:00).", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidServiceTypeId_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use an invalid service type ID
        var rowData = GetValidCsvRowData();
        rowData["ServiceTypeId"] = "4"; // Invalid service type ID (valid values are 1, 2, or 3)
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when service type ID is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Invalid ServiceTypeId: 4. Valid values are: 1 (Evaluation/Assessment); 2 (Other/Non-Billable); 3 (Treatment/Therapy)", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidEvaluationTypeId_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use an invalid evaluation type ID
        var rowData = GetValidCsvRowData();
        rowData["EvaluationTypeId"] = "3"; // Invalid evaluation type ID (valid values are 1 or 2)
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when evaluation type ID is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Invalid EvaluationTypeId: 3. Valid values are: 1 (Initial Evaluation/Assessment); 2 (Re-evaluation/Re-assessment)", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidEncounterDiagnosisCode_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use an invalid diagnosis code
        var rowData = GetValidCsvRowData();
        rowData["EncounterDiagnosisCode"] = "INVALID"; // Invalid diagnosis code
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when encounter diagnosis code is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Diagnosis code 'INVALID' not found or is archived.; Error creating data: Failed to create encounter data", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithOverlappingEncounters_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a time that overlaps with an existing encounter
        var rowData = GetValidCsvRowData();
        rowData["EncounterDate"] = DateTime.Today.ToString("MM/dd/yyyy");
        rowData["EncounterStartTime"] = "09:00";
        rowData["EncounterEndTime"] = "10:00";
        rowData["StudentStartTime"] = "09:00";
        rowData["StudentEndTime"] = "10:00";

        var rowData2 = GetValidCsvRowData();
        rowData["EncounterDate"] = DateTime.Today.ToString("MM/dd/yyyy");
        rowData["EncounterStartTime"] = "09:00";
        rowData["EncounterEndTime"] = "10:00";
        rowData["StudentStartTime"] = "09:00";
        rowData["StudentEndTime"] = "10:00";

        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        // Add second encounter data
        csvContent.AppendLine(string.Join(",", rowData2.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when encounters overlap");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains($"This student already has an encounter with this provider on {DateTime.UtcNow:M/dd/yyyy} from 13:00:00 to 14:00:00.; Error creating data: Failed to create encounter data", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithNonOverlappingEncounters_ShouldSucceed()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use a time that doesn't overlap with existing encounters
        var rowData = GetValidCsvRowData();
        rowData["EncounterDate"] = DateTime.Today.ToString("MM/dd/yyyy");
        rowData["EncounterStartTime"] = "11:00";
        rowData["EncounterEndTime"] = "12:00";
        rowData["StudentStartTime"] = "11:00";
        rowData["StudentEndTime"] = "12:00";
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.True(result.Success, "Import should succeed when encounters don't overlap");
        Assert.Equal(1, result.SuccessCount);
        Assert.Equal(0, result.ErrorCount);
        Assert.Null(result.ErrorFileContent);
        Assert.Contains("Import completed with 1 successful rows and 0 error rows.", result.Message);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidEncounterLocation_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use an invalid encounter location
        var rowData = GetValidCsvRowData();
        rowData["EncounterLocation"] = "INVALID"; // Invalid location
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when encounter location is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("Encounter location 'INVALID' not found. Please provide a valid location name.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithInvalidCPTCode_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use an invalid CPT code
        var rowData = GetValidCsvRowData();
        rowData["CPTCode"] = "INVALID"; // Invalid CPT code
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when CPT code is invalid");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("CPT code 'INVALID' not found or is archived. Please provide a valid CPT code.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithLongTherapyCaseNotes_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use therapy case notes that exceed the maximum length
        var rowData = GetValidCsvRowData();
        rowData["TherapyCaseNotes"] = new string('x', 6001); // Exceeds 6000 character limit
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when therapy case notes exceed maximum length");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("TherapyCaseNotes cannot exceed 6000 characters.", errorRow[validationErrorsIndex]);
    }

    [Fact]
    public async Task ProcessImportFileAsync_WithLongSupervisorComments_ShouldReturnError()
    {
        // Arrange
        var csvContent = new StringBuilder();
        
        // Get the valid row data but use supervisor comments that exceed the maximum length
        var rowData = GetValidCsvRowData();
        rowData["SupervisorComments"] = new string('x', 1001); // Exceeds 1000 character limit
        
        // Write headers (using the keys from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Keys));

        // Write data row (using the values from the dictionary)
        csvContent.AppendLine(string.Join(",", rowData.Values));

        var fileContent = Encoding.UTF8.GetBytes(csvContent.ToString());

        // Act
        var result = await Service.ProcessImportFileAsync(fileContent, 1, true, Transaction);

        // Assert
        Assert.False(result.Success, "Import should fail when supervisor comments exceed maximum length");
        Assert.Equal(0, result.SuccessCount);
        Assert.Equal(1, result.ErrorCount);
        Assert.NotNull(result.ErrorFileContent);
        Assert.Contains("Import completed with 0 successful rows and 1 error rows.", result.Message);

        // Verify the error file content
        var errorFileContent = Encoding.UTF8.GetString(result.ErrorFileContent);
        var errorLines = errorFileContent.Split(new[] { '\r', '\n' }, StringSplitOptions.RemoveEmptyEntries);
        
        // Should have header row + 1 data row
        Assert.Equal(2, errorLines.Length);
        
        // Verify the error message is in the ValidationErrors column
        var headers = errorLines[0].Split(',');
        var validationErrorsIndex = Array.IndexOf(headers, "ValidationErrors");
        var errorRow = errorLines[1].Split(',');
        Assert.Contains("SupervisorComments cannot exceed 1000 characters.", errorRow[validationErrorsIndex]);
    }
}
