using breckhtmltopdf;
using Microsoft.Extensions.Configuration;
using Model;
using System.Collections.Generic;
using System.Linq;

namespace Templator.Models
{
    public class ProgressReportParams : BreckTemplatorBase
    {

        public ProgressReportParams() : base() { }

        public ProgressReportParams(IConfiguration configuration) : base(configuration) { }

        public ProgressReport progressReport;

        public SchoolDistrict district;

        public List<Goal> goals;

        public string progress
        {
            get
            {
                return this.progressReport.Progress.GetValueOrDefault() ? "YES" : "NO";
            }
        }

        public string medical
        {
            get
            {
                return this.progressReport.MedicalStatusChange.GetValueOrDefault() ? "Yes" : "No";
            }
        }

        public string treatment
        {
            get
            {
                return this.progressReport.TreatmentChange.GetValueOrDefault() ? "Yes" : "No";
            }
        }

        public string esignedBy
        {
            get
            {
                return this.progressReport.ESignedById.HasValue ? $"{this.progressReport.ESignedBy.FirstName} {this.progressReport.ESignedBy.LastName}, {this.progressReport.ESignedBy.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.Name}" : "N/A";
            }
        }

        public string supervisorTitleLabel
        {
            get
            {
                return isSignedByAssistant() && this.progressReport.SupervisorESignedBy?.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.SupervisorTitleId == null ? "Supervisor's Name & Title: " : "";
            }
        }

        public string supervisorDateLabel
        {
            get
            {
                return isSignedByAssistant() && this.progressReport.SupervisorESignedBy?.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.SupervisorTitleId == null ? "Date: " : "";
            }
        }

        public string supervisorEsignedBy
        {
            get
            {
                return isSignedByAssistant() && this.progressReport.SupervisorESignedBy?.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.SupervisorTitleId == null && this.progressReport.SupervisorESignedById.HasValue ? $"{this.progressReport.SupervisorESignedBy.FirstName} {this.progressReport.SupervisorESignedBy.LastName}, {this.progressReport.SupervisorESignedBy.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.Name}" : "";
            }
        }

        public string supervisorEsignedByDate
        {
            get
            {
                return isSignedByAssistant() && this.progressReport.SupervisorESignedBy?.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.SupervisorTitleId == null && this.progressReport.SupervisorESignedById.HasValue ? progressReport.SupervisorDateESigned.GetValueOrDefault().ToString("MM/dd/yyyy") : "";
            }
        }

        private bool isSignedByAssistant()
        {
            return this.progressReport.ESignedBy.Providers_ProviderUserId.FirstOrDefault().ProviderTitle.SupervisorTitleId != null;
        }

    }

}
