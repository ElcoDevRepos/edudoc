using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;


namespace API.Test
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : Microsoft.AspNetCore.Mvc.ControllerBase
    {
        /// <summary>
        /// This method throws an exception so we can test logging and responses
        /// </summary>
        /// <returns></returns>
        /// <exception cref="Exception"></exception>
        [HttpGet]
        [Route("error")]
        [AllowAnonymous]
        public IActionResult Error()
        {
            throw new Exception("Something failed...");
        }
    }
}
