using System;
using System.Collections.Generic;
using breckhtmltopdf;
using Microsoft.Extensions.Configuration;
using Model;
using Model.Custom;
using Model.DTOs;

namespace Templator.Models
{
    public class AupAuditParams : BreckTemplatorBase
    {
        public AupAuditParams()
            : base() { }

        public AupAuditParams(IConfiguration configuration)
            : base(configuration) { }

        public List<EncounterResponseDto> Encounters { get; set; }
        public string HeaderText { get; set; }
    }
}
