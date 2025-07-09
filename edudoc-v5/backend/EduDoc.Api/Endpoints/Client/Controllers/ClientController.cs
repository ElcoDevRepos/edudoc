using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NSwag;
using NSwag.CodeGeneration.CSharp;
using NSwag.CodeGeneration.TypeScript;

namespace EduDoc.Api.Endpoints.Client.Controllers
{

    [AllowAnonymous]
    [ApiController]
    [Route("client-generator")]
    public class ClientGeneratorController : ControllerBase
    {
        [HttpGet("csharp")]
        public async Task<IActionResult> GenerateClient()
        {
            var document = await OpenApiDocument.FromUrlAsync("https://localhost:7118/swagger/v1/swagger.json");

            var settings = new CSharpClientGeneratorSettings
            {
                ClassName = "EduDocClient",
                CSharpGeneratorSettings =
                {
                    Namespace = "EduDocV5Client",
                    ArrayType = "System.Collections.Generic.List",
                    ArrayInstanceType = "System.Collections.Generic.List"
                }
            };

            var generator = new CSharpClientGenerator(document, settings);
            var code = generator.GenerateFile();

            return Content(code, "text/plain");
        }

        [HttpGet("angular")]
        public async Task<IActionResult> GenerateAngularClient()
        {
            // Replace with your actual Swagger endpoint
            var document = await OpenApiDocument.FromUrlAsync("https://localhost:7118/swagger/v1/swagger.json");

            var settings = new TypeScriptClientGeneratorSettings
            {
                Template = TypeScriptTemplate.Angular,
                ClassName = "EduDocClient",
                TypeScriptGeneratorSettings =
                {
                    Namespace = "EduDocV5Client",
                    ModuleName = "api-client"
                }
            };

            var generator = new TypeScriptClientGenerator(document, settings);
            var code = generator.GenerateFile();

            return Content(code, "text/plain");
        }

    }


}
