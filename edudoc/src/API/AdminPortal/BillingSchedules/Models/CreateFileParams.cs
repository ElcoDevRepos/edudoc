
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace API.BillingSchedules.Models
{
    public class CreateFilesParams
    {
        [FromForm]
        public IFormFile[] file { get; set; }
    }
}
