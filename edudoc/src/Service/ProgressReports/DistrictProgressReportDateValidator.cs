using FluentValidation;
using Model;
using System;
using System.Linq;

namespace Service.ProgressReports
{
    public class DistrictProgressReportDateValidator : AbstractValidator<DistrictProgressReportDate>
    {
        public DistrictProgressReportDateValidator()
        {
            
        }
    }
}
