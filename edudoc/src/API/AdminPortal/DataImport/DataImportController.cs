using API.Core.Claims;
using API.ControllerBase;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Service.DataImport;
using System;
using System.IO;
using System.Threading.Tasks;

namespace API.AdminPortal.DataImport
{
    [Route("api/v1/data-import")]
    [Restrict(ClaimTypes.Encounters, ClaimValues.ReadOnly | ClaimValues.FullAccess)]
    public class DataImportController : ApiControllerBase
    {
        private readonly IDataImportService _dataImportService;

        public DataImportController(
            IDataImportService dataImportService)
        {
            _dataImportService = dataImportService;
        }

        [HttpGet]
        [Route("encounters/template")]
        public IActionResult GetEncounterTemplate()
        {
            try
            {
                var csvData = _dataImportService.GenerateTemplate();
                return File(csvData, "text/csv", "encounter_import_template.csv");
            }
            catch (Exception ex)
            {
                return BadRequest($"Error generating template: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("encounters/import")]
        public async Task<IActionResult> ValidateEncounterImport(IFormFile file, [FromQuery] bool createMissingStudentRecords = false)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest("No file uploaded");
            }

            // Validate file type
            var fileExtension = Path.GetExtension(file.FileName).ToLowerInvariant();
            if (fileExtension != ".csv")
            {
                return BadRequest("Only CSV files are allowed");
            }

            try
            {
                // Read the file into a byte array
                byte[] fileBytes;
                using (var ms = new MemoryStream())
                {
                    await file.CopyToAsync(ms);
                    fileBytes = ms.ToArray();
                }

                // Process the file
                var result = await _dataImportService.ProcessImportFileAsync(fileBytes, this.GetUserId(), createMissingStudentRecords);

                // If there are errors, return the error file
                if (result.ErrorCount > 0 && result.ErrorFileContent != null)
                {
                    var originalFileName = Path.GetFileNameWithoutExtension(file.FileName);
                    var errorFileName = $"{originalFileName}_errors_{DateTime.Now:yyyyMMdd_HHmmss}.csv";
                    return File(
                        result.ErrorFileContent, 
                        "text/csv", 
                        errorFileName
                    );
                }

                // If successful with no errors, return a success message
                return Ok(new { 
                    Success = result.Success, 
                    Message = result.Message,
                    SuccessCount = result.SuccessCount
                });
            }
            catch (Exception ex)
            {
                return BadRequest($"Error processing file: {ex.Message}");
            }
        }

        [HttpPost]
        [Route("convert")]
        [ApiExplorerSettings(IgnoreApi = true)]

        public async Task<IActionResult> ConvertPartnerFiles([FromQuery] string partner, [FromForm] IFormFile studentFile, [FromForm] IFormFile serviceFile)
        {
            if (string.IsNullOrWhiteSpace(partner))
            {
                return BadRequest("Integration partner must be specified");
            }

            // Validate based on partner type
            switch (partner.ToUpperInvariant())
            {
                case "SNAP":
                    if (studentFile == null || serviceFile == null || studentFile.Length == 0 || serviceFile.Length == 0)
                    {
                        return BadRequest("Both student and service files are required for SNAP integration");
                    }
                    break;
                case "MST":
                    if (serviceFile == null || serviceFile.Length == 0)
                    {
                        return BadRequest("Service file is required for MST integration");
                    }
                    break;
                default:
                    return BadRequest($"Unsupported integration partner: {partner}");
            }

            // Validate file types
            // var studentFileExtension = Path.GetExtension(studentFile.FileName).ToLowerInvariant();
            // var serviceFileExtension = Path.GetExtension(serviceFile.FileName).ToLowerInvariant();
            // if (fileExtension != ".csv")
            // {
            //     return BadRequest("Only CSV files are allowed");
            // }

            try
            {
                // Read the files into byte arrays
                byte[] studentFileBytes = null;
                byte[] serviceFileBytes;
                
                // Read service file
                using (var ms = new MemoryStream())
                {
                    await serviceFile.CopyToAsync(ms);
                    serviceFileBytes = ms.ToArray();
                }
                
                // Read student file only if it's SNAP
                if (partner.ToUpperInvariant() == "SNAP")
                {
                    using (var ms = new MemoryStream())
                    {
                        await studentFile.CopyToAsync(ms);
                        studentFileBytes = ms.ToArray();
                    }
                }

                // Process the files based on partner
                byte[] convertedFile;
                switch (partner.ToUpperInvariant())
                {
                    case "SNAP":
                        convertedFile = await _dataImportService.ConvertSnapFilesAsync(studentFileBytes, serviceFileBytes, studentFile.FileName);
                        break;
                    case "MST":
                        convertedFile = await _dataImportService.ConvertMstFilesAsync(serviceFileBytes);
                        break;
                    default:
                        return BadRequest($"Unsupported integration partner: {partner}");
                }

                return File(
                    convertedFile,
                    "text/csv",
                    $"converted_encounters_{DateTime.Now:yyyyMMdd_HHmmss}.csv"
                );
            }
            catch (Exception ex)
            {
                return BadRequest($"Error converting files: {ex.Message}");
            }
        }
    }
} 
