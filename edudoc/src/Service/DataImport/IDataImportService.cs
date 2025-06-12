using System.Collections.Generic;
using System.Data.Entity;
using System.Threading.Tasks;
using CsvHelper.Configuration.Attributes;
using Model.DataImport;

namespace Service.DataImport
{
    public interface IDataImportService
    {
        /// <summary>
        /// Gets the type of import this service handles
        /// </summary>
        string ImportType { get; }
        
        /// <summary>
        /// Generates a CSV template for data imports
        /// </summary>
        /// <returns>Byte array containing the CSV template</returns>
        byte[] GenerateTemplate();
        
        /// <summary>
        /// Processes an import file and returns a result with validation information
        /// </summary>
        /// <param name="fileContent">The content of the file to process</param>
        /// <param name="createMissingRecords">Whether to create missing records instead of reporting errors</param>
        /// <param name="userId">The ID of the user performing the import</param>
        /// <returns>A result containing the processed data and any errors</returns>
        Task<ImportResult> ProcessImportFileAsync(byte[] fileContent, int userId, bool createMissingRecords = false, DbContextTransaction transaction = null);
        
        /// <summary>
        /// Converts student files to service files
        /// </summary>
        /// <param name="studentFileContent">The content of the student file</param>
        /// <param name="serviceFileContent">The content of the service file</param>
        /// <param name="studentFileName">The name of the student file to extract CustomerId</param>
        /// <returns>The converted service file content</returns>
        Task<byte[]> ConvertSnapFilesAsync(byte[] studentFileContent, byte[] serviceFileContent, string studentFileName);
        
        /// <summary>
        /// Converts MST service records into the encounter import format
        /// </summary>
        /// <param name="jsonContent">The content of the JSON file</param>
        /// <returns>The converted encounter import file content</returns>
        Task<byte[]> ConvertMstFilesAsync(byte[] jsonContent);
    }
    
    /// <summary>
    /// Base class for all import row validation results
    /// </summary>
    public class DataImportRowValidationResult
    {
        /// <summary>
        /// Indicates whether the row passed validation
        /// </summary>
        public bool IsValid { get; set; }
        
        /// <summary>
        /// The original row data from the import file
        /// </summary>
        public Dictionary<string, string> OriginalRow { get; set; }
        
        /// <summary>
        /// List of validation errors found in the row
        /// </summary>
        public List<string> Errors { get; set; }
    }
    
    /// <summary>
    /// Result of an import operation
    /// </summary>
    public class ImportResult
    {
        /// <summary>
        /// Indicates whether the import was successful overall
        /// </summary>
        public bool Success { get; set; }
        
        /// <summary>
        /// Message describing the result of the import
        /// </summary>
        public string Message { get; set; }
        
        /// <summary>
        /// Number of rows successfully processed
        /// </summary>
        public int SuccessCount { get; set; }
        
        /// <summary>
        /// Number of rows with validation errors
        /// </summary>
        public int ErrorCount { get; set; }
        
        /// <summary>
        /// Number of new records created during import
        /// </summary>
        public int CreatedRecordCount { get; set; }
        
        /// <summary>
        /// Collection of rows that had validation errors
        /// </summary>
        public List<ImportRow> ErrorRows { get; set; }
        
        /// <summary>
        /// Byte array containing the error file content
        /// </summary>
        public byte[] ErrorFileContent { get; set; }
    }
} 
